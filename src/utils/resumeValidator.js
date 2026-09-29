// src/utils/resumeValidator.js

import { getGeminiApiKey, validateAndAnalyzeWithGemini } from '../services/geminiService';

// Standard Resume & Career vocabulary categories
const CAREER_INDICATORS = {
  sections: [
    'experience', 'work experience', 'employment history', 'work history', 'professional experience',
    'education', 'academic background', 'academic history', 'qualifications',
    'skills', 'technical skills', 'core competencies', 'key skills', 'areas of expertise',
    'projects', 'key projects', 'personal projects', 'academic projects',
    'summary', 'professional summary', 'executive summary', 'profile', 'about me', 'objective', 'career objective',
    'certifications', 'licenses', 'courses', 'achievements', 'awards', 'publications'
  ],
  jobTitles: [
    'developer', 'engineer', 'architect', 'designer', 'manager', 'lead', 'specialist',
    'consultant', 'analyst', 'intern', 'assistant', 'associate', 'officer', 'coordinator',
    'scientist', 'technician', 'administrator', 'director', 'programmer', 'strategist',
    'frontend', 'backend', 'fullstack', 'full stack', 'devops', 'software'
  ],
  educationTerms: [
    'bachelor', 'master', 'phd', 'doctorate', 'degree', 'b.s.', 'b.sc', 'b.tech', 'b.e.',
    'b.a.', 'm.s.', 'm.sc', 'm.tech', 'm.b.a.', 'university', 'college', 'institute',
    'school', 'gpa', 'cgpa', 'major', 'minor', 'coursework', 'graduated', 'graduation'
  ],
  actionVerbs: [
    'developed', 'engineered', 'created', 'designed', 'implemented', 'managed',
    'built', 'led', 'architected', 'maintained', 'optimized', 'spearheaded',
    'collaborated', 'analyzed', 'orchestrated', 'automated', 'deployed'
  ]
};

// Obvious non-resume keywords in filenames
const INVALID_FILENAME_PATTERNS = [
  /cat/i, /dog/i, /pet/i, /wallpaper/i, /invoice/i, /receipt/i, /bill/i,
  /screenshot/i, /meme/i, /food/i, /ticket/i, /statement/i, /bank/i,
  /passport/i, /id_card/i, /license_plate/i, /landscape/i, /selfie/i
];

/**
 * Validates text or file input to verify it contains career/resume information
 */
export const validateResumeContent = async (input, fileName = '', fileType = '') => {
  const apiKey = getGeminiApiKey();

  // 1. If Gemini API Key is available, use real AI evaluation
  if (apiKey) {
    try {
      if (typeof input === 'string' && (input.startsWith('data:') || input.length > 5000)) {
        // Base64 or long payload
        const res = await validateAndAnalyzeWithGemini(input, fileType || 'text/plain');
        if (!res.isValidResume) {
          return {
            isValid: false,
            error: res.rejectionReason || 'AI Analysis: The uploaded file does not contain valid career, profession, or resume information.'
          };
        }
        return {
          isValid: true,
          parsedData: res.parsed,
          aiScore: res.overallScore,
          atsScore: res.atsCompatibility,
          jobMatchScore: res.jobMatchScore
        };
      } else if (typeof input === 'string' && input.length > 20) {
        const res = await validateAndAnalyzeWithGemini(input, 'text/plain');
        if (!res.isValidResume) {
          return {
            isValid: false,
            error: res.rejectionReason || 'AI Analysis: The uploaded text does not appear to be a resume or career document.'
          };
        }
        return {
          isValid: true,
          parsedData: res.parsed,
          aiScore: res.overallScore,
          atsScore: res.atsCompatibility,
          jobMatchScore: res.jobMatchScore
        };
      }
    } catch (err) {
      console.warn('Gemini validation fallback to local validator due to:', err);
      // Fallback to local heuristic validation if API network issue
    }
  }

  // 2. Strict Local Heuristic Validation
  // If it's a file object / name check
  if (fileName) {
    const extMatch = fileName.match(/\.([0-9a-z]+)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : '';
    const allowedExts = ['pdf', 'docx', 'doc', 'txt', 'png', 'jpg', 'jpeg'];
    
    if (!allowedExts.includes(ext)) {
      return {
        isValid: false,
        error: `Unsupported file type (.${ext}). Please upload a PDF, DOCX, DOC, TXT, PNG, or JPG resume file.`
      };
    }

    // Check invalid filename indicators
    for (const pattern of INVALID_FILENAME_PATTERNS) {
      if (pattern.test(fileName)) {
        return {
          isValid: false,
          error: `Invalid file "${fileName}". The file name indicates it is not a resume or CV document. Please upload your professional resume.`
        };
      }
    }
  }

  // If we have plain text to inspect
  if (typeof input === 'string' && input.trim().length > 0) {
    const text = input.toLowerCase();

    // Check minimum meaningful length
    if (text.trim().length < 60) {
      return {
        isValid: false,
        error: 'The provided text is too short to be a valid resume. A resume must contain contact details, experience, skills, and education.'
      };
    }

    // Tally career categories found
    let sectionMatches = 0;
    for (const sec of CAREER_INDICATORS.sections) {
      if (text.includes(sec)) {
        sectionMatches++;
      }
    }

    let jobMatches = 0;
    for (const title of CAREER_INDICATORS.jobTitles) {
      if (text.includes(title)) {
        jobMatches++;
      }
    }

    let eduMatches = 0;
    for (const edu of CAREER_INDICATORS.educationTerms) {
      if (text.includes(edu)) {
        eduMatches++;
      }
    }

    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(input);
    const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(input);
    const hasContact = hasEmail || hasPhone || text.includes('linkedin') || text.includes('github');

    // Score calculation
    let careerScore = 0;
    if (sectionMatches >= 2) careerScore += 3;
    else if (sectionMatches >= 1) careerScore += 1.5;

    if (jobMatches >= 2) careerScore += 2.5;
    else if (jobMatches >= 1) careerScore += 1;

    if (eduMatches >= 2) careerScore += 2;
    else if (eduMatches >= 1) careerScore += 1;

    if (hasContact) careerScore += 2;

    // Career threshold: Must match at least 2 distinct career categories
    const distinctCategoriesPresent = [
      sectionMatches > 0,
      jobMatches > 0,
      eduMatches > 0,
      hasContact
    ].filter(Boolean).length;

    if (careerScore < 3.5 || distinctCategoriesPresent < 2) {
      return {
        isValid: false,
        error: 'Invalid Document Content: The uploaded text does not contain sufficient career, education, experience, or skill details. Please upload a legitimate resume or CV.'
      };
    }

    return {
      isValid: true,
      extractedCategories: {
        hasContact,
        sectionMatches,
        jobMatches,
        eduMatches
      }
    };
  }

  // If binary document (PDF / DOCX / Image) without direct client-side text extracted:
  // Check if filename contains resume-related keywords or neutral naming
  if (fileName) {
    const lowerName = fileName.toLowerCase();
    const hasPositiveResumeMarker = /resume|cv|curriculum|profile|portfolio|bio|career|developer|engineer|analyst|job|intern|application/i.test(lowerName);
    
    // If it's an image without resume keyword in filename
    if (/\.(png|jpg|jpeg)$/i.test(fileName) && !hasPositiveResumeMarker) {
      return {
        isValid: false,
        error: `Invalid Image File: "${fileName}" does not appear to be a resume screenshot or scanned CV. If uploading an image, ensure it is a clearly readable scan of your resume.`
      };
    }
  }

  return { isValid: true };
};

/**
 * Calculates dynamic section completeness for a parsed resume object
 */
export const calculateSectionCompleteness = (resume) => {
  const sections = {
    contact: Boolean(resume?.contact?.email || resume?.contact?.phone || resume?.contact?.fullName),
    summary: Boolean(resume?.summary && resume.summary.trim().length > 15),
    experience: Boolean(resume?.experience && resume.experience.length > 0),
    projects: Boolean(resume?.projects && resume.projects.length > 0),
    skills: Boolean(
      (Array.isArray(resume?.skills?.technical) && resume.skills.technical.length > 0) ||
      (typeof resume?.skills?.technical === 'string' && resume.skills.technical.trim().length > 0)
    ),
    education: Boolean(resume?.education && resume.education.length > 0)
  };

  const detectedCount = Object.values(sections).filter(Boolean).length;
  const totalCount = 6;
  const percentage = Math.round((detectedCount / totalCount) * 100);

  return {
    sections,
    detectedCount,
    totalCount,
    percentage
  };
};
