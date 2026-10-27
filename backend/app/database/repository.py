"""Persistent storage shared by service instances; blocking driver work uses threads."""
from asyncio import to_thread
from copy import deepcopy
from pymongo import MongoClient, ASCENDING
from pymongo.errors import DuplicateKeyError
from app.core.config import settings
from app.core.exceptions import ConflictError

_client = None
_db = None
_repositories = []


class Repository:
    def __init__(self, collection, id_field, seeds=None):
        self.collection = collection
        self.id_field = id_field
        self.seeds = deepcopy(seeds or {})
        if seeds is not None:
            _repositories.append(self)

    def _collection(self):
        if _db is None:
            raise RuntimeError("MongoDB is not connected. Configure MONGODB_URI and start the application.")
        return _db[self.collection]

    async def get(self, identifier):
        return await to_thread(self._collection().find_one, {self.id_field: identifier}, {"_id": 0})

    async def values(self):
        return await to_thread(lambda: list(self._collection().find({}, {"_id": 0})))

    async def items(self):
        return [(item[self.id_field], item) for item in await self.values()]

    async def count(self, query):
        return await to_thread(self._collection().count_documents, query)

    async def put(self, identifier, record):
        document = deepcopy(record)
        if self.collection == "users":
            document["email_normalized"] = document["email"].lower()
        try:
            await to_thread(self._collection().replace_one, {self.id_field: identifier}, document, upsert=True)
        except DuplicateKeyError:
            raise ConflictError(message="A record with this identifier or email already exists.") from None

    async def delete(self, identifier):
        await to_thread(self._collection().delete_one, {self.id_field: identifier})


async def start_database():
    global _client, _db
    if not settings.MONGODB_URI:
        raise RuntimeError("Set MONGODB_URI in backend/.env before starting the backend.")
    # One client per application process; driver pool defaults suit local development.
    _client = MongoClient(settings.MONGODB_URI)
    _db = _client[settings.MONGODB_DATABASE]
    try:
        await to_thread(_client.admin.command, "ping")
        for repo in _repositories:
            await to_thread(_db[repo.collection].create_index, [(repo.id_field, ASCENDING)], unique=True)
        await to_thread(_db.users.create_index, [("email_normalized", ASCENDING)], unique=True)
        for collection in ("resumes", "analyses", "recommendations", "discoveries"):
            await to_thread(_db[collection].create_index, [("user_id", ASCENDING)])
        await to_thread(_db.analyses.create_index, [("resume_id", ASCENDING)])
        if settings.SEED_DEMO_DATA:
            for repo in _repositories:
                for identifier, record in repo.seeds.items():
                    document = deepcopy(record)
                    if repo.collection == "users":
                        document["email_normalized"] = document["email"].lower()
                    await to_thread(_db[repo.collection].update_one,
                                    {repo.id_field: identifier}, {"$setOnInsert": document}, upsert=True)
    except Exception:
        await close_database()
        raise


async def close_database():
    global _client, _db
    if _client is not None:
        await to_thread(_client.close)
    _client = None
    _db = None
