// src/services/geminiService.js

// Default API Key lookup from localStorage or environment
export const getGeminiApiKey = () => {
  try {
    return localStorage.getItem('skillsync_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  } catch (e) {
    return '';
  }
};

export const setGeminiApiKey = (key) => {
  try {
    if (key) {
      localStorage.setItem('skillsync_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('skillsync_gemini_api_key');
    }
  } catch (e) {}
};

/**
 * Validates and analyzes resume text or document using Gemini API
 */
export const validateAndAnalyzeWithGemini = async (contentOrBase64, mimeType = 'text/plain', targetRole = null) => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('No Gemini API Key provided');
  }

  const isImageOrPdf = mimeType.startsWith('image/') || mimeType === 'application/pdf';
  
  const systemPrompt = `You are a strict ATS Resume Analyzer and Career Evaluator.
Your job is to FIRST determine whether the provided document/text is a genuine Resume, Curriculum Vitae (CV), or Professional Career Profile (containing personal career info, education, work experience, or skills).
If the input is NOT a resume (for example: random image, scenery, food, receipts, invoices, random notes, source code, shopping list, or general text unrelated to a person's professional career), you MUST return isValidResume: false with a clear explanation in rejectionReason.

If it IS a valid resume or career document, extract the candidate details and compute ATS compatibility and match scores.

You MUST respond strictly in valid JSON format matching this schema:
{
  "isValidResume": boolean,
  "rejectionReason": "string explaining why it is invalid if isValidResume is false, else empty string",
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
        "title": "Job Title",
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
    // Base64 payload
    const base64Data = contentOrBase64.includes('base64,') 
      ? contentOrBase64.split('base64,')[1] 
      : contentOrBase64;

    contents = [{
      parts: [
        { text: systemPrompt + (targetRole ? `\nTarget Role to evaluate against: ${targetRole.title} (${targetRole.description})` : '') },
        {
          inline_data: {
            mime_type: mimeType,
            data: base64Data
          }
        }
      ]
    }];
  } else {
    // Plain text payload
    contents = [{
      parts: [
        { text: systemPrompt + (targetRole ? `\nTarget Role to evaluate against: ${targetRole.title} (${targetRole.description})` : '') + `\n\n--- DOCUMENT CONTENT ---\n${contentOrBase64}` }
      ]
    }];
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.1
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const rawResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!rawResponseText) {
    throw new Error('Empty response received from Gemini API');
  }

  const parsedJson = JSON.parse(rawResponseText);
  return parsedJson;
};
