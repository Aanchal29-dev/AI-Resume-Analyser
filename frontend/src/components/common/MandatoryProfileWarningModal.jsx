// src/components/common/MandatoryProfileWarningModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

const MandatoryProfileWarningModal = ({
  isOpen,
  onClose,
  missingFields = [],
  userProfile = {},
  selectedIndustry = '',
  onSaveAndProceed
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: userProfile.fullName || '',
    email: userProfile.email || '',
    phone: userProfile.phone || '',
    targetIndustry: selectedIndustry || userProfile.targetIndustry || '',
    educationLevel: userProfile.educationLevel || 'Undergraduate Senior'
  });

  const [localErrors, setLocalErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: userProfile.fullName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        targetIndustry: selectedIndustry || userProfile.targetIndustry || '',
        educationLevel: userProfile.educationLevel || 'Undergraduate Senior'
      });
      setLocalErrors({});
    }
  }, [isOpen, userProfile, selectedIndustry]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    const name = (formData.fullName || '').trim();
    if (!name || ['student', 'user', 'demo user', 'demo', 'candidate'].includes(name.toLowerCase())) {
      errs.fullName = 'Please enter your real full name';
    }
    if (!formData.email || !formData.email.includes('@')) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone || formData.phone.trim().length < 6) {
      errs.phone = 'Please enter a contact phone number';
    }
    if (!formData.targetIndustry || formData.targetIndustry === 'Others') {
      errs.targetIndustry = 'Please specify your target industry / field';
    }
    if (!formData.educationLevel) {
      errs.educationLevel = 'Please select your education level';
    }
    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (onSaveAndProceed) {
      onSaveAndProceed(formData);
    }
  };

  const handleNavigateToProfile = () => {
    onClose();
    navigate('/profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#fbf7fd] rounded-3xl border-2 border-amber-300 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 font-sans"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Alert Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Mandatory Profile Details Required</h3>
              <p className="text-xs text-amber-100 font-medium">Required before synthesizing your ATS resume</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Missing Warning Alert Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-900 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              Incomplete Profile Information
            </div>
            <p className="text-stone-700 leading-relaxed">
              To build a verified ATS-compliant resume with industry alignment, Google Gemini requires your contact, education, and target field.
            </p>
            {missingFields.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {missingFields.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-100 text-rose-800 font-bold border border-rose-200 text-[11px]"
                  >
                    ✕ {f.label || f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* In-Place Quick Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-800 mb-1 flex items-center justify-between text-xs sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-purple-600" /> Full Name <span className="text-rose-600">*</span>
                </span>
                {localErrors.fullName && <span className="text-rose-600 font-semibold text-xs">{localErrors.fullName}</span>}
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full p-3 rounded-xl border bg-white text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 transition-all ${
                  localErrors.fullName ? 'border-rose-400 focus:ring-rose-100' : 'border-purple-200/80 focus:border-purple-600 focus:ring-purple-100'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1 flex items-center justify-between text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-purple-600" /> Email <span className="text-rose-600">*</span>
                  </span>
                  {localErrors.email && <span className="text-rose-600 font-semibold text-[11px]">Required</span>}
                </label>
                <input
                  type="email"
                  placeholder="e.g. alex@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-3 rounded-xl border bg-white text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 transition-all ${
                    localErrors.email ? 'border-rose-400 focus:ring-rose-100' : 'border-purple-200/80 focus:border-purple-600 focus:ring-purple-100'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1 flex items-center justify-between text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-purple-600" /> Phone <span className="text-rose-600">*</span>
                  </span>
                  {localErrors.phone && <span className="text-rose-600 font-semibold text-[11px]">Required</span>}
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full p-3 rounded-xl border bg-white text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 transition-all ${
                    localErrors.phone ? 'border-rose-400 focus:ring-rose-100' : 'border-purple-200/80 focus:border-purple-600 focus:ring-purple-100'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1 flex items-center justify-between text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-purple-600" /> Field / Industry <span className="text-rose-600">*</span>
                  </span>
                  {localErrors.targetIndustry && <span className="text-rose-600 font-semibold text-[11px]">Required</span>}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Robotics, Healthcare, Tech"
                  value={formData.targetIndustry}
                  onChange={(e) => setFormData({ ...formData, targetIndustry: e.target.value })}
                  className={`w-full p-3 rounded-xl border bg-white text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 transition-all ${
                    localErrors.targetIndustry ? 'border-rose-400 focus:ring-rose-100' : 'border-purple-200/80 focus:border-purple-600 focus:ring-purple-100'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1 flex items-center justify-between text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-purple-600" /> Education Level <span className="text-rose-600">*</span>
                  </span>
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                  className="w-full p-3 rounded-xl border border-purple-200/80 bg-white text-stone-900 font-medium text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all cursor-pointer"
                >
                  <option>Undergraduate Senior</option>
                  <option>Recent Graduate (0-1 yrs)</option>
                  <option>Master's Candidate</option>
                  <option>Career Switcher</option>
                  <option>High School / Diploma</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-2.5 border-t border-purple-100">
              <button
                type="button"
                onClick={handleNavigateToProfile}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Open Full Profile
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
              >
                Save & Create Resume <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MandatoryProfileWarningModal;
