// src/pages/AIAssistantPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  User,
  RefreshCw,
  Copy,
  Check,
  History,
  ChevronRight,
  MessageSquare,
  RotateCcw,
  Plus
} from 'lucide-react';

// Formats Markdown-like text into styled JSX
const FormattedMessage = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Process paragraphs and block elements
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty lines
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Horizontal rule
        if (trimmed === '***' || trimmed === '---') {
          return <hr key={idx} className="my-2 border-slate-200/80" />;
        }

        // Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 text-sm mt-2 mb-1">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-bold text-slate-900 text-base mt-2 mb-1">
              {trimmed.replace('## ', '')}
            </h3>
          );
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-purple-500 bg-purple-50/50 p-2.5 rounded-r-xl italic text-purple-950 font-medium my-1.5"
            >
              {renderInlineStyles(trimmed.replace('> ', ''))}
            </blockquote>
          );
        }

        // Bullet points
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-1 my-0.5">
              <span className="text-purple-600 font-bold text-sm leading-none">•</span>
              <span className="flex-1">{renderInlineStyles(trimmed.substring(2))}</span>
            </div>
          );
        }

        // Numbered list
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-1 my-0.5">
              <span className="font-bold text-purple-600 text-xs shrink-0">{numberedMatch[1]}.</span>
              <span className="flex-1">{renderInlineStyles(numberedMatch[2])}</span>
            </div>
          );
        }

        // Standard paragraph
        return <p key={idx}>{renderInlineStyles(line)}</p>;
      })}
    </div>
  );
};

// Helper for bold, italics, code inline tags
const renderInlineStyles = (text) => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*|\`.*?\`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-purple-100/70 text-purple-800 font-mono px-1.5 py-0.5 rounded text-[11px] font-semibold border border-purple-200">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

const AIAssistantPage = () => {
  const {
    chatMessages,
    setChatMessages,
    isChatLoading,
    handleSendChatMessage,
    handleClearChat
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedChatSessions, setSavedChatSessions] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsync_saved_chat_sessions');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const messagesEndRef = useRef(null);

  const promptPills = [
    "Explain how cloud computing works",
    "What is an API and how does it function?",
    "Give me 2 strong bullet examples for my role",
    "How to structure winning interview answers (STAR method)",
    "Explain how neural networks learn"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isChatLoading]);

  // Persist saved chat sessions
  const persistSessions = (sessions) => {
    setSavedChatSessions(sessions);
    try {
      localStorage.setItem('skillsync_saved_chat_sessions', JSON.stringify(sessions));
    } catch (e) {}
  };

  // Archive current session before clearing
  const archiveCurrentChat = () => {
    const userMsgs = chatMessages.filter(m => m.sender === 'user');
    if (userMsgs.length > 0) {
      const firstText = userMsgs[0]?.text || 'Chat Session';
      const newSession = {
        id: `session-${Date.now()}`,
        title: firstText.length > 36 ? firstText.slice(0, 36) + '...' : firstText,
        timestamp: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        messageCount: chatMessages.length,
        messages: chatMessages
      };
      const updated = [newSession, ...savedChatSessions];
      persistSessions(updated);
    }
  };

  const handleClearWithArchive = () => {
    archiveCurrentChat();
    handleClearChat();
  };

  const handleRestoreSession = (session) => {
    if (setChatMessages) {
      setChatMessages(session.messages || []);
    }
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    const updated = savedChatSessions.filter(s => s.id !== sessionId);
    persistSessions(updated);
  };

  const onSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isChatLoading) return;
    handleSendChatMessage(inputText);
    setInputText('');
  };

  const handlePillClick = (prompt) => {
    if (isChatLoading) return;
    handleSendChatMessage(prompt);
  };

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto h-[calc(100vh-7rem)] flex flex-col space-y-4 font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-purple-200/80 pb-3 gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-stone-900">SkillSync Assistant</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SkillSync AI Live
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Unrestricted AI Assistant • In-depth general answers first with tailored role perspective</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* History Toggle Button */}
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer ${
                isHistoryOpen
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-white hover:bg-purple-50 text-stone-800 border-purple-200'
              }`}
              title="Toggle Previous Chats Drawer"
            >
              <History className="w-4 h-4 text-purple-700" />
              <span>Previous Chats</span>
              {savedChatSessions.length > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-purple-600 text-white text-[10px] font-black flex items-center justify-center">
                  {savedChatSessions.length}
                </span>
              )}
            </button>

            {/* Clear Chat Button (High Contrast, Bold Text, Red Hover) */}
            <button
              onClick={handleClearWithArchive}
              className="px-3 py-1.5 rounded-xl border border-purple-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-stone-800 hover:text-rose-600 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Clear active chat and archive to Previous Chats"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Chat</span>
            </button>
          </div>
        </div>

        {/* Chat Area + Collapsible Right-Side History Drawer */}
        <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
          {/* Main Active Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 h-full space-y-3">
            {/* Chat Messages Container */}
            <div className="flex-1 bg-white rounded-2xl border border-purple-200/90 shadow-soft p-4 sm:p-6 overflow-y-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <Bot className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-stone-800 text-base">How can I help you today?</h3>
                    <p className="text-xs text-stone-500 font-medium max-w-sm mt-1">
                      Ask about concepts, interview answers, resume phrasing, or any career question!
                    </p>
                  </div>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gradient-to-tr from-purple-600 to-violet-600 text-white shadow-xs'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className={`p-4 sm:p-5 rounded-2xl text-xs leading-relaxed space-y-2 shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-[#faf7fd] text-stone-800 rounded-tl-none border border-purple-200/80'
                    }`}>
                      {msg.sender === 'user' ? (
                        <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                      ) : (
                        <FormattedMessage content={msg.text} />
                      )}
                      <span className={`text-[9px] block text-right pt-1 ${msg.sender === 'user' ? 'text-purple-200' : 'text-stone-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {isChatLoading && (
                <div className="flex gap-3 max-w-md">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-violet-600 text-white flex items-center justify-center text-xs shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 bg-purple-50/70 rounded-2xl text-xs text-stone-600 animate-pulse flex items-center gap-2 border border-purple-200/60 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" /> SkillSync AI is formulating response...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompt Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
              {promptPills.map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePillClick(pill)}
                  disabled={isChatLoading}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 hover:text-purple-950 border border-purple-200 text-purple-900 font-extrabold text-[11px] shrink-0 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  ✨ {pill}
                </button>
              ))}
            </div>

            {/* Input Bar Form */}
            <form onSubmit={onSend} className="flex gap-2 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isChatLoading}
                placeholder="Ask any question: concepts, tech architecture, interview strategy, or resume tips..."
                className="flex-1 p-3 rounded-xl border border-purple-200 bg-white text-stone-900 text-xs font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:bg-purple-50 placeholder:text-stone-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isChatLoading}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Collapsible Previous Chats Right Drawer */}
          {isHistoryOpen && (
            <div className="w-72 sm:w-80 bg-white/95 rounded-2xl border border-purple-200/90 shadow-soft p-4 flex flex-col shrink-0 animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-3">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-700" />
                  <h3 className="font-extrabold text-sm text-stone-900">Previous Chats</h3>
                </div>
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-purple-700 hover:bg-purple-50 cursor-pointer"
                  title="Close History Panel"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Saved Sessions List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {savedChatSessions.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-stone-400 space-y-2">
                    <MessageSquare className="w-8 h-8 text-purple-200" />
                    <p className="text-xs font-medium">No previous chats saved yet.</p>
                    <p className="text-[11px] text-stone-400">
                      When you clear your conversation, your chats are automatically preserved here.
                    </p>
                  </div>
                ) : (
                  savedChatSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleRestoreSession(session)}
                      className="p-3 rounded-xl border border-purple-100 hover:border-purple-300 bg-purple-50/40 hover:bg-purple-50/90 transition-all cursor-pointer group space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-stone-900 group-hover:text-purple-900 line-clamp-1">
                          {session.title}
                        </span>
                        <button
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="text-stone-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                          title="Delete saved chat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium">
                        <span>{session.timestamp}</span>
                        <span className="text-purple-700 font-bold flex items-center gap-1 group-hover:underline">
                          <RotateCcw className="w-2.5 h-2.5" /> Restore
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {savedChatSessions.length > 0 && (
                <div className="pt-3 border-t border-purple-100 mt-2">
                  <button
                    onClick={() => persistSessions([])}
                    className="w-full py-2 text-center text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    Clear All Chat History
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default AIAssistantPage;
