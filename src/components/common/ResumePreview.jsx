// src/components/common/ResumePreview.jsx
import React from 'react';
import { Mail, Phone, MapPin, Globe, Link2, ExternalLink, Printer } from 'lucide-react';

const ResumePreview = ({ resume, isCompact = false, showPrint = true }) => {
  if (!resume || !resume.contact) {
    return <div className="p-6 text-center text-slate-400">No resume data available.</div>;
  }

  const { contact, summary, education, experience, projects, skills, certifications } = resume;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 md:p-8 font-sans text-slate-800 print-area relative">
      {showPrint && (
        <div className="absolute top-4 right-4 print:hidden flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </div>
      )}

      {/* Header / Contact Info */}
      <div className="border-b border-slate-200 pb-4 mb-4 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{contact.fullName}</h1>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-2">
          {contact.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-indigo-600" /> {contact.email}
            </span>
          )}
          {contact.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-indigo-600" /> {contact.phone}
            </span>
          )}
          {contact.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {contact.location}
            </span>
          )}
          {contact.linkedin && (
            <span className="flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-indigo-600" /> {contact.linkedin}
            </span>
          )}
          {contact.github && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-600" /> {contact.github}
            </span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-xs md:text-sm">
                  <span className="text-slate-900">{exp.title} — <span className="text-indigo-600">{exp.company}</span></span>
                  <span className="text-slate-500 text-xs font-normal">{exp.period} | {exp.location}</span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-xs text-slate-700 leading-normal">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1 mb-3">
            Key Technical Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-xs md:text-sm">
                  <span className="text-slate-900">{proj.name} <span className="text-xs font-normal text-slate-500">({proj.tech})</span></span>
                  <span className="text-slate-500 text-xs font-normal">{proj.period}</span>
                </div>
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs text-slate-700">
                    {proj.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs md:text-sm">
                <div className="flex justify-between font-semibold">
                  <span>{edu.degree}</span>
                  <span className="text-slate-500 font-normal">{edu.graduationYear}</span>
                </div>
                <div className="text-slate-600 font-medium text-xs">{edu.institution}, {edu.location} {edu.gpa && `| GPA: ${edu.gpa}`}</div>
                {edu.coursework && <div className="text-[11px] text-slate-500 mt-0.5">Relevant Coursework: {edu.coursework}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div className="mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1 mb-2">
            Technical & Soft Skills
          </h2>
          <div className="space-y-1.5 text-xs text-slate-700">
            {skills.technical && (
              <div>
                <span className="font-semibold text-slate-900">Technical Skills: </span>
                {Array.isArray(skills.technical) ? skills.technical.join(', ') : skills.technical}
              </div>
            )}
            {skills.tools && (
              <div>
                <span className="font-semibold text-slate-900">Developer Tools: </span>
                {Array.isArray(skills.tools) ? skills.tools.join(', ') : skills.tools}
              </div>
            )}
            {skills.soft && (
              <div>
                <span className="font-semibold text-slate-900">Soft Skills: </span>
                {Array.isArray(skills.soft) ? skills.soft.join(', ') : skills.soft}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1 mb-2">
            Certifications & Training
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
            {certifications.map((cert, idx) => (
              <li key={idx}>
                <span className="font-medium text-slate-900">{cert.name}</span> — {cert.issuer} ({cert.year})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
