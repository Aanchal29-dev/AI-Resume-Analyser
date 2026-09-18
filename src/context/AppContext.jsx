// src/context/AppContext.jsx
import React, { createContext, useContext, useState } from 'react';
import {
  SAMPLE_RESUMES,
  SAMPLE_JOB_ROLES,
  INITIAL_ANALYSIS_RESULT,
  MOCK_LEARNING_RESOURCES,
  INITIAL_AI_CHAT_MESSAGES,
  MOCK_HISTORY_ITEMS
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth State (Persisted in localStorage until explicit logout)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('skillsync_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [hasAnalyzedResume, setHasAnalyzedResume] = useState(false);

  // Resume & Target Role State
  const [resumeData, setResumeData] = useState(SAMPLE_RESUMES.default.parsed);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [targetRole, setTargetRole] = useState(SAMPLE_JOB_ROLES[0]); // Default Frontend Dev
  const [customJobDescription, setCustomJobDescription] = useState('');
  const [analysisType, setAnalysisType] = useState('job'); // 'general' | 'job'

  // Analysis & Score State
  const [analysis, setAnalysis] = useState(INITIAL_ANALYSIS_RESULT);
  const [scoreHistory, setScoreHistory] = useState([
    { version: 'v1.0 (Initial)', overallScore: 68, atsScore: 75, jobMatchScore: 65, date: '2026-09-10' },
    { version: 'v2.0 (Current)', overallScore: 78, atsScore: 84, jobMatchScore: 72, date: '2026-09-16' }
  ]);

  // Career Discovery State
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});
  const [recommendedRoles, setRecommendedRoles] = useState(SAMPLE_JOB_ROLES.slice(0, 3));

  // Learning Plan State
  const [learningPlan, setLearningPlan] = useState(MOCK_LEARNING_RESOURCES);

  // AI Chat Assistant State
  const [chatMessages, setChatMessages] = useState(INITIAL_AI_CHAT_MESSAGES);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Analysis History State
  const [historyItems, setHistoryItems] = useState(MOCK_HISTORY_ITEMS);

  // Profile / Settings State - Default name is empty string ("")
  const [userProfile, setUserProfileState] = useState(() => {
    const defaultProfile = {
      fullName: '',
      email: '',
      phone: '',
      educationLevel: 'Undergraduate Senior',
      targetIndustry: 'Software & Technology',
      preferredWorkType: 'Full-time / Remote',
      notifications: true
    };
    try {
      const saved = localStorage.getItem('skillsync_user_profile');
      if (saved) {
        return { ...defaultProfile, ...JSON.parse(saved) };
      }
    } catch (e) {}
    return defaultProfile;
  });

  const setUserProfile = (updater) => {
    setUserProfileState(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('skillsync_user_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // --- ACTIONS & MUTATORS ---

  // Auth Handlers
  const login = (email, password, name) => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem('skillsync_auth', 'true');
    } catch (e) {}
    setUserProfile(prev => {
      const updated = {
        ...prev,
        email: email || prev.email || 'user@college.edu',
        fullName: name !== undefined && name !== '' ? name : (prev.fullName || 'User')
      };
      try {
        localStorage.setItem('skillsync_user_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('skillsync_auth');
      localStorage.removeItem('skillsync_user_profile');
    } catch (e) {}
  };

  // 1. Upload Resume
  const handleUploadResume = (fileOrText) => {
    setHasAnalyzedResume(true);
    if (typeof fileOrText === 'string') {
      setUploadedFileName('Pasted_Resume_Text.txt');
      setUploadedFileSize('12 KB');
    } else if (fileOrText && fileOrText.name) {
      setUploadedFileName(fileOrText.name);
      const sizeKb = Math.round(fileOrText.size / 1024);
      setUploadedFileSize(`${sizeKb > 0 ? sizeKb : 180} KB`);
    } else {
      setUploadedFileName('Sample_Resume_Uploaded.pdf');
      setUploadedFileSize('240 KB');
    }
  };

  const handleClearResume = () => {
    setUploadedFileName('');
    setUploadedFileSize('');
    setHasAnalyzedResume(false);
  };

  // 2. Select Target Job Role
  const handleSelectJobRole = (roleObject) => {
    setTargetRole(roleObject);
  };

  // 3. Accept AI Bullet Suggestion
  const handleAcceptSuggestion = (issueId) => {
    setAnalysis(prev => {
      const updatedIssues = prev.issues.map(iss => {
        if (iss.id === issueId) {
          return { ...iss, status: 'resolved' };
        }
        return iss;
      });

      const resolvedCount = updatedIssues.filter(i => i.status === 'resolved').length;
      const newScore = Math.min(95, 78 + resolvedCount * 3);
      const newAts = Math.min(98, 84 + resolvedCount * 2);
      const newMatch = Math.min(94, 72 + resolvedCount * 4);

      return {
        ...prev,
        overallScore: newScore,
        atsCompatibility: newAts,
        jobMatchScore: newMatch,
        issues: updatedIssues
      };
    });

    const targetIssue = analysis.issues.find(i => i.id === issueId);
    if (targetIssue && targetIssue.aiSuggestion) {
      setResumeData(prev => {
        const updatedExp = prev.experience.map(exp => {
          if (exp.id === 'exp-1') {
            return {
              ...exp,
              bullets: exp.bullets.map((b, idx) => idx === 0 ? targetIssue.aiSuggestion : b)
            };
          }
          return exp;
        });
        return { ...prev, experience: updatedExp };
      });
    }
  };

  // 4. Run Recheck
  const handleRunRecheck = () => {
    setHasAnalyzedResume(true);
    const currentScore = analysis.overallScore;
    const boostScore = Math.min(96, currentScore + 6);
    const boostAts = Math.min(98, analysis.atsCompatibility + 4);
    const boostMatch = Math.min(92, analysis.jobMatchScore + 8);

    setAnalysis(prev => ({
      ...prev,
      overallScore: boostScore,
      atsCompatibility: boostAts,
      jobMatchScore: boostMatch,
      lastAnalyzed: 'Just Now',
      status: 'Optimized'
    }));

    const nextVerIndex = scoreHistory.length + 1;
    const newVersion = {
      version: `v${nextVerIndex}.0 (After Recheck)`,
      overallScore: boostScore,
      atsScore: boostAts,
      jobMatchScore: boostMatch,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setScoreHistory(prev => [newVersion, ...prev]);
  };

  // 5. Submit Career Discovery Questionnaire
  const handleSubmitQuestionnaire = (answers) => {
    setQuestionnaireAnswers(answers);
    const matched = [...SAMPLE_JOB_ROLES].slice(0, 4);
    setRecommendedRoles(matched);
  };

  // 6. Send AI Assistant Chat Message
  const handleSendChatMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    setTimeout(() => {
      let aiText = "That's a great question! ";
      const lower = text.toLowerCase();

      if (lower.includes('score') || lower.includes('ats')) {
        aiText += `Your current overall resume score is **${analysis.overallScore}/100** with **${analysis.atsCompatibility}% ATS Compatibility**. Your structural layout is solid, but adding missing keywords like **TypeScript** and **Web Performance** will boost your score above 90.`;
      } else if (lower.includes('role') || lower.includes('match')) {
        aiText += `Based on your resume, you match **Frontend Developer** at **72%**. You are also a strong candidate for **Full Stack Developer** (68%) and **UI/UX Engineer** (75%).`;
      } else if (lower.includes('bullet') || lower.includes('summary')) {
        aiText += `Here is an optimized summary for your resume:\n\n*"Results-driven Frontend Developer skilled in React, JavaScript, and Tailwind CSS. Built responsive web applications serving 1,000+ users with a focus on UI performance and clean API integration."*`;
      } else if (lower.includes('skill') || lower.includes('learn')) {
        aiText += `To maximize your hireability for modern Frontend Developer positions, we recommend prioritizing these 3 skills:\n1. **TypeScript** (High Priority)\n2. **React Testing Library / Jest** (Medium Priority)\n3. **Web Vitals & Performance Optimization** (High Priority)`;
      } else {
        aiText += `I recommend reviewing the **Fix First** section in your Problems & Suggestions report. Updating your passive action verbs to quantified accomplishment statements will significantly improve recruiter response rates.`;
      }

      const aiMsg = {
        id: `m-${Date.now() + 1}`,
        sender: 'assistant',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsChatLoading(false);
    }, 1000);
  };

  const handleClearChat = () => {
    setChatMessages([]);
  };

  // 7. Toggle Learning Resource Status
  const handleToggleResourceStatus = (id, newStatus) => {
    setLearningPlan(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  // 8. Delete History Item
  const handleDeleteHistoryItem = (id) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
  };

  // 9. Add Section or Bullet to Resume Data (Builder mode)
  const handleUpdateResumeData = (updatedParsed) => {
    setResumeData(updatedParsed);
  };

  const activeResumeData = {
    ...resumeData,
    contact: {
      ...resumeData.contact,
      fullName: userProfile.fullName || resumeData.contact?.fullName || 'User'
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        hasAnalyzedResume,
        resumeData: activeResumeData,
        uploadedFileName,
        uploadedFileSize,
        targetRole,
        customJobDescription,
        analysisType,
        analysis,
        scoreHistory,
        questionnaireAnswers,
        recommendedRoles,
        learningPlan,
        chatMessages,
        isChatLoading,
        historyItems,
        userProfile,

        // Auth
        login,
        logout,

        // Handlers
        setHasAnalyzedResume,
        setAnalysisType,
        setCustomJobDescription,
        setUserProfile,
        handleUploadResume,
        handleClearResume,
        handleSelectJobRole,
        handleAcceptSuggestion,
        handleRunRecheck,
        handleSubmitQuestionnaire,
        handleSendChatMessage,
        handleClearChat,
        handleToggleResourceStatus,
        handleDeleteHistoryItem,
        handleUpdateResumeData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
