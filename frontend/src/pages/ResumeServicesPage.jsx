// src/pages/ResumeServicesPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ServiceDetailModal from '../components/common/ServiceDetailModal';
import { PLATFORM_SERVICES } from '../data/mockData';
import { Sparkles, ArrowRight } from 'lucide-react';

const ResumeServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div className="min-h-screen bg-[#f3e8fa] text-stone-800 flex flex-col font-sans selection:bg-purple-600 selection:text-white relative">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-300/80 text-purple-800 text-xs font-extrabold shadow-xs">
            <Sparkles className="w-4 h-4 text-purple-600" /> Platform Services Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Comprehensive AI Resume & Career Services
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed font-medium">
            Click on any service card below to view its detailed step-by-step working process, deliverables, and features.
          </p>
        </div>

        {/* 10 Services Grid - Matching Landing Page Card Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_SERVICES.map((srv) => (
            <div
              key={srv.id}
              onClick={() => setSelectedService(srv)}
              className="bg-[#fbf7fd] hover:bg-purple-100/60 p-6 rounded-2xl border border-purple-200/80 shadow-soft hover:border-purple-500 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/90 text-purple-700 border border-purple-300/60 flex items-center justify-center font-bold group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100/70 text-purple-800 border border-purple-200">
                    {srv.badge}
                  </span>
                </div>
                <h3 className="font-bold text-stone-900 text-base group-hover:text-purple-700 transition-colors">{srv.title}</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">{srv.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-200/60 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
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
