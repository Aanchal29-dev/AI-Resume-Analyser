// src/pages/ResumeServicesPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ServiceDetailModal from '../components/common/ServiceDetailModal';
import { PLATFORM_SERVICES } from '../data/mockData';
import { Sparkles, ArrowRight, HelpCircle } from 'lucide-react';

const ResumeServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Platform Services Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive AI Resume & Career Services
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Click on any service card below to view its detailed step-by-step working process, deliverables, and features.
          </p>
        </div>

        {/* 10 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_SERVICES.map((srv) => (
            <div
              key={srv.id}
              onClick={() => setSelectedService(srv)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {srv.badge}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{srv.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{srv.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                <span>View Process & Details</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />

      <Footer />
    </div>
  );
};

export default ResumeServicesPage;
