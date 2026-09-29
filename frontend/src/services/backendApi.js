// frontend/src/services/backendApi.js
/**
 * Backend API Client for FastAPI Backend.
 * Provides unified methods to communicate with the FastAPI server running on port 8000
 * (or proxied via /api in Vite dev server).
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api/v1';

/**
 * Generic request helper with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const headers = {
      ...(!options.isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    };

    const config = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === 'object' && !options.isFormData) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new Error(errorData?.error?.message || errorData?.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.warn(`[Backend API] Request to ${endpoint} failed:`, err.message);
    throw err;
  }
};

export const backendApi = {
  // System Health
  checkHealth: () => fetch('/api/health').then(r => r.json()).catch(() => ({ status: 'offline' })),

  // Users & Profile
  getUser: (userId = 'usr_demo123456') => apiRequest(`/users/${userId}`),
  getUserProfile: (userId = 'usr_demo123456') => apiRequest(`/users/${userId}/profile`),
  updateUser: (userId, data) => apiRequest(`/users/${userId}`, { method: 'PUT', body: data }),

  // Resumes
  getResumes: (userId) => apiRequest(`/resumes${userId ? `?user_id=${userId}` : ''}`),
  getResumeById: (resumeId) => apiRequest(`/resumes/${resumeId}`),
  uploadResumeFile: (file, userId = 'usr_demo123456') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    return apiRequest('/resumes/upload', {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
  },
  createResume: (data) => apiRequest('/resumes', { method: 'POST', body: data }),
  updateResume: (resumeId, data) => apiRequest(`/resumes/${resumeId}`, { method: 'PUT', body: data }),
  deleteResume: (resumeId) => apiRequest(`/resumes/${resumeId}`, { method: 'DELETE' }),

  // Job Descriptions
  getJobs: (category) => apiRequest(`/jobs${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getJobById: (jobId) => apiRequest(`/jobs/${jobId}`),
  createJob: (data) => apiRequest('/jobs', { method: 'POST', body: data }),

  // Analyses
  getAnalyses: (userId, resumeId) => {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (resumeId) params.append('resume_id', resumeId);
    return apiRequest(`/analyses?${params.toString()}`);
  },
  getAnalysisById: (analysisId) => apiRequest(`/analyses/${analysisId}`),
  createAnalysis: (data) => apiRequest('/analyses', { method: 'POST', body: data }),

  // Recommendations
  getRecommendations: (userId) => apiRequest(`/recommendations${userId ? `?user_id=${userId}` : ''}`),
  createRecommendations: (data) => apiRequest('/recommendations', { method: 'POST', body: data }),

  // Career Discovery
  submitQuestionnaire: (data) => apiRequest('/career/questionnaire', { method: 'POST', body: data }),
  getCareerRoles: () => apiRequest('/career/roles'),
  getCareerRoleById: (roleId) => apiRequest(`/career/roles/${roleId}`),

  // Direct AI & Gemini Integration Endpoints
  chatWithAI: (message, chatHistory = [], candidateName, targetRole) =>
    apiRequest('/ai/chat', {
      method: 'POST',
      body: { message, chat_history: chatHistory, candidate_name: candidateName, target_role: targetRole },
    }),

  optimizeBulletWithAI: (bullet, roleTitle) =>
    apiRequest('/ai/optimize-bullet', {
      method: 'POST',
      body: { bullet, role_title: roleTitle },
    }),

  analyzeResumeTextWithAI: (resumeText, targetRole, jobDescription) =>
    apiRequest('/ai/analyze-text', {
      method: 'POST',
      body: { resume_text: resumeText, target_role: targetRole, job_description: jobDescription },
    }),
};

export default backendApi;
