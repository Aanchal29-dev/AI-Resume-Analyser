// src/pages/ResumeBuilderPage.jsx
import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import ResumePreview from '../components/common/ResumePreview';
import Modal from '../components/common/Modal';
import { useApp } from '../context/AppContext';
import {
  Hammer,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Save,
  Download,
  CheckCircle2,
  FileText,
  Wand2
} from 'lucide-react';

const ResumeBuilderPage = () => {
  const { resumeData, handleUpdateResumeData } = useApp();
  const [activeTab, setActiveTab] = useState('summary'); // 'contact' | 'summary' | 'experience' | 'projects' | 'skills' | 'education'
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiBulletPrompt, setAiBulletPrompt] = useState('Worked on React website');
  const [aiGeneratedResult, setAiGeneratedResult] = useState('');

  const [formData, setFormData] = useState(resumeData);
  const [saveToast, setSaveToast] = useState(false);

  const handleFieldChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveDraft = () => {
    handleUpdateResumeData(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const generateAiBullet = () => {
    setAiGeneratedResult(
      `Engineered 14 responsive React web components using TypeScript and Tailwind CSS, increasing page load speed by 35% and boosting user onboarding completion by 22%.`
    );
  };

  return (
    <Sidebar>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-2 border border-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI Resume Builder Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Interactive Resume Builder</h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
              Build an ATS-optimized single-column resume from scratch with real-time AI bullet enhancement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveToast && (
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
                Draft Saved! ✓
              </span>
            )}
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-stone-800 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4 text-purple-600" /> Save Draft
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/25 flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* Builder Workspace: Left Editor Pane (1 col) | Right Live Preview Pane (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Editor Pane (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-purple-200 shadow-soft p-6 space-y-6">
            {/* Section Switcher Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-purple-100">
              {['contact', 'summary', 'experience', 'projects', 'skills', 'education'].map(sec => (
                <button
                  key={sec}
                  onClick={() => setActiveTab(sec)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold capitalize shrink-0 transition-colors cursor-pointer ${
                    activeTab === sec ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-50 text-stone-800 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>

            {/* Form Section: Contact */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-base">Personal & Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={formData.contact?.fullName || ''}
                      onChange={(e) => handleFieldChange('contact', 'fullName', e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address *</label>
                    <input
                      type="text"
                      value={formData.contact?.email || ''}
                      onChange={(e) => handleFieldChange('contact', 'email', e.target.value)}
                      placeholder="e.g. alex.m@example.com"
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number *</label>
                    <input
                      type="text"
                      value={formData.contact?.phone || ''}
                      onChange={(e) => handleFieldChange('contact', 'phone', e.target.value)}
                      placeholder="e.g. +1 555-0199"
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Location</label>
                    <input
                      type="text"
                      value={formData.contact?.location || ''}
                      onChange={(e) => handleFieldChange('contact', 'location', e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={formData.contact?.linkedin || ''}
                      onChange={(e) => handleFieldChange('contact', 'linkedin', e.target.value)}
                      placeholder="e.g. https://linkedin.com/in/yourprofile"
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">GitHub Profile URL</label>
                    <input
                      type="url"
                      value={formData.contact?.github || ''}
                      onChange={(e) => handleFieldChange('contact', 'github', e.target.value)}
                      placeholder="e.g. https://github.com/yourusername"
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form Section: Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">Professional Summary</h3>
                  <button
                    onClick={() => setShowAiModal(true)}
                    className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className="w-4 h-4" /> Improve with AI
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={formData.summary || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            )}

            {/* Form Section: Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">Work Experience</h3>
                  <button
                    onClick={() => setShowAiModal(true)}
                    className="text-xs sm:text-sm font-bold text-indigo-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className="w-4 h-4" /> AI Bullet Generator
                  </button>
                </div>

                {formData.experience?.map((exp, idx) => (
                  <div key={idx} className="p-4.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => {
                          const updated = [...formData.experience];
                          updated[idx].title = e.target.value;
                          setFormData(prev => ({ ...prev, experience: updated }));
                        }}
                        className="p-2.5 rounded-lg border border-slate-200 font-bold bg-white text-sm"
                        placeholder="Job Title"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...formData.experience];
                          updated[idx].company = e.target.value;
                          setFormData(prev => ({ ...prev, experience: updated }));
                        }}
                        className="p-2.5 rounded-lg border border-slate-200 font-semibold bg-white text-indigo-600 text-sm"
                        placeholder="Company"
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={exp.bullets?.join('\n') || ''}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].bullets = e.target.value.split('\n');
                        setFormData(prev => ({ ...prev, experience: updated }));
                      }}
                      className="w-full p-3 rounded-lg border border-slate-200 text-sm font-sans bg-white leading-relaxed"
                      placeholder="Bullet points (one per line)..."
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Form Section: Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-base">Key Projects</h3>
                {formData.projects?.map((proj, idx) => (
                  <div key={idx} className="p-4.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...(formData.projects || [])];
                        updated[idx].title = e.target.value;
                        setFormData(prev => ({ ...prev, projects: updated }));
                      }}
                      className="w-full p-2.5 rounded-lg border border-slate-200 font-bold bg-white text-sm"
                      placeholder="Project Name"
                    />
                    <textarea
                      rows={3}
                      value={proj.bullets?.join('\n') || ''}
                      onChange={(e) => {
                        const updated = [...(formData.projects || [])];
                        updated[idx].bullets = e.target.value.split('\n');
                        setFormData(prev => ({ ...prev, projects: updated }));
                      }}
                      className="w-full p-3 rounded-lg border border-slate-200 text-sm font-sans bg-white leading-relaxed"
                      placeholder="Project details & achievements..."
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Form Section: Skills */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-base">Technical Skills</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Technical Skills (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(formData.skills?.technical) ? formData.skills.technical.join(', ') : formData.skills?.technical || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      skills: { ...prev.skills, technical: e.target.value.split(', ') }
                    }))}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            )}

            {/* Form Section: Education */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-900 text-base">Education & Degrees</h3>
                {(formData.education || []).map((edu, idx) => (
                  <div key={idx} className="p-4.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...formData.education];
                          updated[idx].degree = e.target.value;
                          setFormData(prev => ({ ...prev, education: updated }));
                        }}
                        className="p-2.5 rounded-lg border border-slate-200 font-bold bg-white text-sm"
                        placeholder="Degree / Major"
                      />
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => {
                          const updated = [...formData.education];
                          updated[idx].school = e.target.value;
                          setFormData(prev => ({ ...prev, education: updated }));
                        }}
                        className="p-2.5 rounded-lg border border-slate-200 font-semibold bg-white text-indigo-600 text-sm"
                        placeholder="Institution"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Live Preview Pane (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
              <span>Live Formatted Preview</span>
              <span className="text-indigo-600 font-bold">100% ATS Single Column Layout</span>
            </div>
            <ResumePreview resume={formData} showPrint={false} />
          </div>
        </div>

        {/* AI Bullet Enhancer Modal */}
        <Modal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          title="AI Bullet Point Generator & Enhancer"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Enter your plain sentence (e.g. "Worked on React website") to generate an action-driven, quantified ATS bullet point.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Plain Action Phrase</label>
              <input
                type="text"
                value={aiBulletPrompt}
                onChange={(e) => setAiBulletPrompt(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <button
              onClick={generateAiBullet}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Generate Quantified Bullet
            </button>

            {aiGeneratedResult && (
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-xs space-y-2">
                <span className="font-bold text-indigo-900 block">AI Generated Result:</span>
                <p className="text-indigo-950 font-medium leading-relaxed bg-white p-3 rounded-lg border border-indigo-100">
                  "{aiGeneratedResult}"
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      // Insert into first bullet of first experience
                      const updatedExp = [...formData.experience];
                      updatedExp[0].bullets[0] = aiGeneratedResult;
                      setFormData(prev => ({ ...prev, experience: updatedExp }));
                      setShowAiModal(false);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs"
                  >
                    Insert into Resume
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default ResumeBuilderPage;
