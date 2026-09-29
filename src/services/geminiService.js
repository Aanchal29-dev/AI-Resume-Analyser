// src/services/geminiService.js

// Default API Key lookup with fallback to provided key
const DEFAULT_KEY = 'AQ.Ab8RN6IqZvFE0w9m-3okouKXvbsn1agvsG9vIYX-cSNLpac3Jw';

// Ordered list of models to try for high availability and low latency
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest',
  'gemini-flash-lite-latest'
];

export const getGeminiApiKey = () => {
  try {
    const stored = localStorage.getItem('skillsync_gemini_api_key');
    if (stored && stored.trim()) return stored.trim();
    return import.meta.env.VITE_GEMINI_API_KEY || DEFAULT_KEY;
  } catch (e) {
    return DEFAULT_KEY;
  }
};

export const setGeminiApiKey = (key) => {
  try {
    if (key && key.trim()) {
      localStorage.setItem('skillsync_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('skillsync_gemini_api_key');
    }
  } catch (e) {}
};

/**
 * Robust helper to call Gemini API with multi-model auto-failover
 */
const callGeminiEndpoint = async (contents, systemInstruction = '', responseJson = false) => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API Key is missing. Please configure it in Settings.');
  }

  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const requestBody = {
        contents,
        generationConfig: {
          temperature: 0.3,
          ...(responseJson ? { response_mime_type: 'application/json' } : {})
        }
      };

      if (systemInstruction) {
        requestBody.system_instruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return text;
        }
      } else {
        const errText = await response.text();
        lastError = new Error(`Model ${modelName} returned ${response.status}: ${errText}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models are currently busy. Please try again shortly.');
};

/**
 * 1. Validates and analyzes resume or certificate text/document using Gemini API
 */
export const validateAndAnalyzeWithGemini = async (contentOrBase64, mimeType = 'text/plain', targetRole = null) => {
  const isImageOrPdf = mimeType.startsWith('image/') || mimeType === 'application/pdf';

  const systemPrompt = `You are a strict ATS Resume Analyzer and Professional Credential Verifier.
Your job is to FIRST determine whether the provided document/text is:
1. A genuine Resume, Curriculum Vitae (CV), or Professional Career Profile.
2. OR a valid Certificate of Course Completion, Internship Completion Certificate, or Professional License/Diploma.

If the input is NOT a resume or certificate (e.g., random pet photo, food, receipt, invoice, random notes, source code, shopping list, or general unrelated text), you MUST return isValidResume: false with a clear explanation in rejectionReason.

If it IS a Certificate or Internship Completion document:
- Set isCertificate: true and isValidResume: true.
- Perform an Originality & Authenticity Audit checking for issuing organization, recipient name, credential ID/serial, completion date, and signs of tampering or font inconsistency.
- Extract the certificate info into certificateDetails and originalityAudit.
- Extract any mentioned skills or role info to merge into parsed data.

If it IS a standard Resume:
- Set isCertificate: false and isValidResume: true.
- Extract candidate details and compute ATS compatibility and match scores.

You MUST respond strictly in valid JSON format matching this schema:
{
  "isValidResume": boolean,
  "isCertificate": boolean,
  "rejectionReason": "string explanation if invalid, else empty string",
  "certificateDetails": {
    "recipientName": "string",
    "title": "string (e.g. Meta Frontend Developer Certificate or Software Engineering Internship)",
    "issuer": "string (e.g. Coursera, Google, Meta, Udemy, Stanford, TechCorp)",
    "issueDate": "string",
    "credentialId": "string or verification code",
    "skills": ["Skill1", "Skill2"]
  },
  "originalityAudit": {
    "authenticityScore": number (0 to 100),
    "status": "Verified Authentic" | "Likely Genuine" | "Review Required",
    "issuerAccreditation": "Accredited / Recognized Organization" | "Standard Issuer",
    "tamperingCheck": "Passed - No font or metadata anomalies detected" | "Potential inconsistencies detected",
    "serialVerification": "Valid format recognized" | "Unverified serial format",
    "notes": "string summary of originality check"
  },
  "parsed": {
    "contact": {
      "fullName": "Candidate Full Name or empty string",
      "email": "email or empty string",
      "phone": "phone or empty string",
      "location": "location or empty string",
      "linkedin": "linkedin url or empty string",
      "github": "github url or empty string",
      "portfolio": "portfolio url or empty string"
    },
    "summary": "Professional summary or objective",
    "education": [
      {
        "institution": "University / College Name",
        "degree": "Degree Title",
        "location": "City, State",
        "graduationYear": "Year",
        "gpa": "GPA or empty string",
        "coursework": "Relevant Courses"
      }
    ],
    "experience": [
      {
        "id": "exp-1",
        "title": "Job Title or Internship Role",
        "company": "Company Name",
        "location": "Location",
        "period": "Start - End Date",
        "description": "Role overview",
        "improvedBullet": "Optimized bullet with metrics",
        "bullets": ["Bullet 1", "Bullet 2"]
      }
    ],
    "projects": [
      {
        "id": "proj-1",
        "name": "Project Name",
        "tech": "Technologies used",
        "period": "Year",
        "description": "Overview",
        "improvedBullet": "Improved metric-driven bullet",
        "bullets": ["Bullet 1"]
      }
    ],
    "skills": {
      "technical": ["Skill1", "Skill2"],
      "soft": ["Skill1", "Skill2"],
      "tools": ["Tool1", "Tool2"]
    },
    "certifications": [
      { "name": "Certificate Name", "issuer": "Issuer", "year": "Year" }
    ]
  },
  "overallScore": number (0 to 100),
  "atsCompatibility": number (0 to 100),
  "jobMatchScore": number (0 to 100),
  "completenessPercent": number (0 to 100),
  "keyStrengths": ["Strength 1", "Strength 2"],
  "criticalGaps": ["Gap 1", "Gap 2"]
}`;

  let contents = [];

  if (isImageOrPdf && typeof contentOrBase64 === 'string') {
    const base64Data = contentOrBase64.includes('base64,') 
      ? contentOrBase64.split('base64,')[1] 
      : contentOrBase64;

    contents = [{
      parts: [
        { text: (targetRole ? `Target Role to evaluate against: ${targetRole.title} (${targetRole.description})\n` : '') + 'Please analyze the attached document.' },
        {
          inline_data: {
            mime_type: mimeType,
            data: base64Data
          }
        }
      ]
    }];
  } else {
    contents = [{
      parts: [
        { text: (targetRole ? `Target Role to evaluate against: ${targetRole.title} (${targetRole.description})\n\n` : '') + `--- DOCUMENT CONTENT ---\n${contentOrBase64}` }
      ]
    }];
  }

  const rawText = await callGeminiEndpoint(contents, systemPrompt, true);
  return JSON.parse(rawText);
};

/**
 * 2. Generates Interactive AI Chat Responses using Gemini (Direct, comprehensive answers in chat)
 */
export const generateAIChatResponse = async (userMessage, chatHistory = [], resumeContext = null, targetRole = null) => {
  const systemInstruction = `You are "SkillSync AI Coach" powered by Google Gemini. You are a world-class technical recruiter, resume writer, and career mentor.

CRITICAL RULES:
1. NEVER redirect the user to other pages or tell them "go check the fix first section" or "visit other tabs". Always provide the FULL, complete, actionable answer directly inside this chat!
2. If the user asks for bullet point improvements, write out 2 to 3 complete, polished, metric-driven bullet points using the Google X-Y-Z formula directly in the chat.
3. If the user asks for a summary, write the complete professional summary directly in the chat so they can read or copy it immediately.
4. If the user asks technical questions (e.g. React, TypeScript, System Design, SQL, algorithms, ATS algorithms), give clear, thorough, friendly explanations with examples.
5. If the user asks about interview questions, give sample questions AND winning answers.
6. Format your responses with beautiful Markdown: use bolding, bullet points, code snippets, and structured headings where appropriate.
7. Tone: Insightful, empathetic, professional, and directly useful.

Candidate Context:
- Name: ${resumeContext?.contact?.fullName || 'Candidate'}
- Target Role: ${targetRole?.title || 'Software Engineering'}
- Target Role Category: ${targetRole?.category || 'Technology'}
- Technical Skills: ${Array.isArray(resumeContext?.skills?.technical) ? resumeContext.skills.technical.join(', ') : 'JavaScript, React, Git, SQL'}
- Work Experience Count: ${resumeContext?.experience?.length || 0} positions
- Education: ${resumeContext?.education?.[0]?.degree || 'Computer Science / Engineering'}
- Certifications: ${resumeContext?.certifications?.map(c => c.name).join(', ') || 'Professional Course Credentials'}`;

  const formattedContents = chatHistory.slice(-8).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  formattedContents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  const responseText = await callGeminiEndpoint(formattedContents, systemInstruction, false);
  return responseText;
};

/**
 * 3. Generates high-impact AI bullet point rewrites
 */
export const generateBulletOptimizationWithGemini = async (originalBullet, roleTitle = 'Software Developer') => {
  const systemInstruction = `You are an elite executive resume writer. Rewrite the following resume bullet point using strong action verbs, quantifiable metrics, and modern technical vocabulary tailored for a ${roleTitle} position. Respond in valid JSON format: { "improvedBullet": "...", "actionVerb": "...", "metricsAdded": "...", "rationale": "..." }`;

  const contents = [{
    parts: [{ text: `Original bullet point: "${originalBullet}"` }]
  }];

  const rawText = await callGeminiEndpoint(contents, systemInstruction, true);
  return JSON.parse(rawText);
};

/**
 * 4. Generates tailored career discovery recommendations
 */
export const generateCareerRecommendationsWithGemini = async (answers, resumeSkills = []) => {
  const systemInstruction = `You are a career pathway recommendation engine. Based on the user's answers and technical skills, recommend 4 top-fitting job roles with match percentages and skill gaps. Respond strictly in JSON:
{
  "recommendations": [
    {
      "id": "string",
      "title": "Role Title",
      "category": "Domain",
      "matchPercentage": number,
      "whyFit": "string",
      "recommendedNextSteps": ["Step 1", "Step 2"],
      "skillsToLearn": ["Skill 1", "Skill 2"]
    }
  ]
}`;

  const contents = [{
    parts: [{ text: `User Questionnaire Answers: ${JSON.stringify(answers)}\nResume Skills: ${resumeSkills.join(', ')}` }]
  }];

  const rawText = await callGeminiEndpoint(contents, systemInstruction, true);
  return JSON.parse(rawText);
};

/**
 * 5. Fetches daily trending resume and career FAQs directly from Gemini
 */
export const fetchDailyGeminiFAQs = async (forceRefresh = false) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const cachedDate = localStorage.getItem('skillsync_faqs_date');
  const cachedFaqs = localStorage.getItem('skillsync_daily_gemini_faqs');

  if (!forceRefresh && cachedDate === todayStr && cachedFaqs) {
    try {
      return JSON.parse(cachedFaqs);
    } catch (e) {}
  }

  const systemInstruction = `You are Google Gemini Career Intelligence. Generate 6 of the most trending and frequently asked questions and high-impact answers regarding resume writing, ATS scanner optimization, career switching, internship credentials, and modern hiring practices for today (${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}).
Respond strictly in JSON format matching this schema:
{
  "lastUpdated": "${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}",
  "trendingTheme": "AI Resume Screening & Keyword Impact",
  "faqs": [
    {
      "q": "Question text",
      "a": "Detailed, highly actionable answer...",
      "category": "ATS Optimization | Formatting | Career Strategy | Interview Prep",
      "trendingScore": "Trending Today"
    }
  ]
}`;

  const contents = [{
    parts: [{ text: `Generate the top 6 most frequently asked resume and job questions on Gemini for ${todayStr}.` }]
  }];

  try {
    const rawText = await callGeminiEndpoint(contents, systemInstruction, true);
    const parsed = JSON.parse(rawText);
    if (parsed?.faqs && parsed.faqs.length > 0) {
      localStorage.setItem('skillsync_faqs_date', todayStr);
      localStorage.setItem('skillsync_daily_gemini_faqs', JSON.stringify(parsed));
      return parsed;
    }
  } catch (err) {
    console.warn('Gemini FAQ dynamic generation fallback:', err);
  }

  // Curated Fallback with today's date
  const fallback = {
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    trendingTheme: "Modern ATS Algorithms & Career Discovery",
    faqs: [
      {
        q: "How does SkillSync's Gemini AI analyze my resume differently from standard ATS checkers?",
        a: "Unlike traditional keyword-counting tools, SkillSync uses Google Gemini to semantically evaluate context, quantified impact (Google X-Y-Z formula), section completeness, and genuine alignment against target job descriptions.",
        category: "ATS Optimization",
        trendingScore: "Top Question"
      },
      {
        q: "Can I upload course completion or internship certificates for verification?",
        a: "Yes! SkillSync automatically recognizes certificates from Coursera, Udemy, Meta, Google, universities, and internship employers, performing an originality and authenticity audit before adding them to your profile.",
        category: "Certifications",
        trendingScore: "Trending"
      },
      {
        q: "How often are the resume suggestions and industry trends updated?",
        a: "The AI analysis model and FAQ trends are updated daily via Google Gemini to reflect current tech industry hiring demands and algorithm changes.",
        category: "Industry Trends",
        trendingScore: "Daily Update"
      },
      {
        q: "What should I do if I am a fresher with no previous work experience?",
        a: "Use our 'Discover My Career Path' questionnaire. Gemini AI maps your academic coursework, projects, and strengths to high-demand roles, generating tailored resume bullets from scratch.",
        category: "Career Strategy",
        trendingScore: "Student Favorite"
      },
      {
        q: "How does the side-by-side AI bullet point rewrite work?",
        a: "The AI Correction Suite examines weak or passive phrases and rewrites them into metric-driven accomplishment statements tailored specifically for your target role.",
        category: "Formatting",
        trendingScore: "Hot Topic"
      },
      {
        q: "How do I optimize my resume for automated HR screening filters?",
        a: "Ensure single-column layout, standard section headers, clean typography, and include relevant technical skills matched to the job description.",
        category: "ATS Tips",
        trendingScore: "High Demand"
      }
    ]
  };

  localStorage.setItem('skillsync_faqs_date', todayStr);
  localStorage.setItem('skillsync_daily_gemini_faqs', JSON.stringify(fallback));
  return fallback;
};
