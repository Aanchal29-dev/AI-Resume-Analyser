// src/pages/JobMatcherPage.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Search,
  MapPin,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Filter,
  DollarSign,
  IndianRupee,
  Calendar,
  Clock,
  Layers,
  Check,
  Bookmark,
  Share2,
  Send,
  X,
  FileText,
  BadgeCheck,
  TrendingUp,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

// Comprehensive dataset of Indian industry job openings with salaries strictly in INR (₹ LPA)
const INITIAL_JOB_LISTINGS = [
  {
    id: 'job-grid-01',
    title: 'Grid Integration Software Engineer',
    company: 'Tata Power Renewable Systems',
    companyLogo: 'TP',
    logoColor: 'from-blue-600 to-indigo-700',
    location: 'Bengaluru, Karnataka',
    workMode: 'Hybrid',
    experience: '2 - 5 years',
    salaryMin: 18.0,
    salaryMax: 28.0,
    salaryINR: '₹18.0 - ₹28.0 LPA',
    salaryMonthly: '₹1.50L - ₹2.33L / month',
    category: 'Software & Technology',
    industry: 'Software & Technology',
    matchScore: 94,
    fitLevel: 'Strong Fit',
    description: 'Develop and maintain simulation software and data pipelines for power system grid integration, renewable energy forecasting, and load flow analysis. Collaborate with power systems engineers to translate complex physical models into scalable software components.',
    requiredSkills: ['Python', 'C++', 'SQL', 'PSS/E', 'PSCAD', 'ETAP', 'Git', 'Data Structures', 'System Integration'],
    matchingSkills: ['Python', 'C++', 'SQL', 'PSS/E', 'PSCAD', 'ETAP', 'Git', 'Data Structures', 'System Integration'],
    missingSkills: ['Load Flow Analysis'],
    benefits: ['Comprehensive Health Insurance (Family)', 'Annual Performance Bonus', 'PF + Gratuity', 'Flexible Hybrid Hours', 'Relocation Support'],
    postedDate: '1 day ago',
    applicantsCount: 28,
    isFeatured: true
  },
  {
    id: 'job-grid-02',
    title: 'Power Systems Simulation & Grid Integration Engineer',
    company: 'Siemens Energy India',
    companyLogo: 'SE',
    logoColor: 'from-emerald-600 to-teal-700',
    location: 'Gurugram, Haryana',
    workMode: 'Hybrid',
    experience: '3 - 6 years',
    salaryMin: 17.5,
    salaryMax: 27.0,
    salaryINR: '₹17.5 - ₹27.0 LPA',
    salaryMonthly: '₹1.45L - ₹2.25L / month',
    category: 'Software & Technology',
    industry: 'Software & Technology',
    matchScore: 92,
    fitLevel: 'Strong Fit',
    description: 'Lead simulation algorithm development for modern high-voltage transmission networks, microgrid integration, and energy storage telemetry.',
    requiredSkills: ['Python', 'C++', 'System Integration', 'PSS/E', 'Data Analytics', 'ETAP', 'Cloud Architecture'],
    matchingSkills: ['Python', 'C++', 'System Integration', 'PSS/E', 'Data Analytics', 'ETAP'],
    missingSkills: ['Microgrid Telemetry'],
    benefits: ['Health Insurance', 'Retirement Pension Scheme', 'Learning Allowance (₹75k/yr)', 'Hybrid Work Policy'],
    postedDate: '2 days ago',
    applicantsCount: 42,
    isFeatured: true
  },
  {
    id: 'job-embed-03',
    title: 'Senior Embedded & Systems Integration Engineer',
    company: 'Bosch Global Software Technologies',
    companyLogo: 'BG',
    logoColor: 'from-rose-600 to-red-700',
    location: 'Bengaluru, Karnataka',
    workMode: 'On-site',
    experience: '3 - 7 years',
    salaryMin: 16.0,
    salaryMax: 26.0,
    salaryINR: '₹16.0 - ₹26.0 LPA',
    salaryMonthly: '₹1.33L - ₹2.16L / month',
    category: 'Software & Technology',
    industry: 'Software & Technology',
    matchScore: 89,
    fitLevel: 'Good Fit',
    description: 'Architect firmware and software interfaces for industrial automation cells, real-time power electronic controllers, and sensor data pipelines.',
    requiredSkills: ['C++', 'Python', 'System Integration', 'Git', 'Data Structures', 'Problem Solving', 'Embedded Systems'],
    matchingSkills: ['C++', 'Python', 'System Integration', 'Git', 'Data Structures', 'Problem Solving'],
    missingSkills: ['CAN Protocol', 'RTOS'],
    benefits: ['Medical Insurance with OPD', 'Annual Bonus', 'Transport Cab Facility', 'Subsidized Cafeteria'],
    postedDate: '3 days ago',
    applicantsCount: 65,
    isFeatured: false
  },
  {
    id: 'job-energy-04',
    title: 'Energy Storage & BMS Software Developer',
    company: 'Ola Electric Technologies',
    companyLogo: 'OE',
    logoColor: 'from-amber-600 to-orange-700',
    location: 'Bengaluru, Karnataka',
    workMode: 'On-site',
    experience: '2 - 5 years',
    salaryMin: 19.0,
    salaryMax: 30.0,
    salaryINR: '₹19.0 - ₹30.0 LPA',
    salaryMonthly: '₹1.58L - ₹2.50L / month',
    category: 'Software & Technology',
    industry: 'Software & Technology',
    matchScore: 90,
    fitLevel: 'Strong Fit',
    description: 'Build core battery telemetry pipelines, state-of-charge estimator algorithms, and cloud integration microservices for electric mobility.',
    requiredSkills: ['Python', 'C++', 'Data Analytics', 'AWS', 'API Development', 'System Integration', 'Problem Solving'],
    matchingSkills: ['Python', 'C++', 'Data Analytics', 'AWS', 'API Development', 'System Integration', 'Problem Solving'],
    missingSkills: ['Battery Thermal Modeling'],
    benefits: ['Competitive ESOPs', 'Comprehensive Medical Cover', 'On-site Gymnasium & Meals', 'Performance Incentives'],
    postedDate: 'Just posted',
    applicantsCount: 19,
    isFeatured: true
  },
  {
    id: 'job-abb-05',
    title: 'Grid Automation & SCADA Software Developer',
    company: 'ABB India',
    companyLogo: 'AB',
    logoColor: 'from-violet-600 to-purple-800',
    location: 'Chennai, Tamil Nadu',
    workMode: 'Hybrid',
    experience: '2 - 6 years',
    salaryMin: 16.5,
    salaryMax: 25.5,
    salaryINR: '₹16.5 - ₹25.5 LPA',
    salaryMonthly: '₹1.37L - ₹2.12L / month',
    category: 'Software & Technology',
    industry: 'Software & Technology',
    matchScore: 91,
    fitLevel: 'Strong Fit',
    description: 'Develop mission-critical substation automation software, IEC 61850 protocol adapters, and analytics dashboards for smart power grids.',
    requiredSkills: ['C++', 'Python', 'SQL', 'PSCAD', 'System Integration', 'API Development', 'Analytical Thinking'],
    matchingSkills: ['C++', 'Python', 'SQL', 'PSCAD', 'System Integration', 'API Development', 'Analytical Thinking'],
    missingSkills: ['IEC 61850 Protocol'],
    benefits: ['PF & Gratuity', 'Health & Term Insurance', 'Work From Home Stipend', 'Parental Leave'],
    postedDate: '4 days ago',
    applicantsCount: 38,
    isFeatured: false
  },
  {
    id: 'job-schneider-06',
    title: 'Smart Grid & Power Systems Software Analyst',
    company: 'Schneider Electric India',
    companyLogo: 'SE',
    logoColor: 'from-green-600 to-emerald-800',
    location: 'Bengaluru, Karnataka',
    workMode: 'Hybrid',
    experience: '2 - 5 years',
    salaryMin: 17.0,
    salaryMax: 26.5,
    salaryINR: '₹17.0 - ₹26.5 LPA',
    salaryMonthly: '₹1.41L - ₹2.20L / month',
    category: 'Software & Technology',
    industry: 'Software & Technology',
    matchScore: 93,
    fitLevel: 'Strong Fit',
    description: 'Design electrical distribution network calculation software, harmonic analysis engines, and power quality visualization tools.',
    requiredSkills: ['Python', 'SQL', 'ETAP', 'PSS/E', 'Tableau', 'Data Analytics', 'Cross-functional Collaboration'],
    matchingSkills: ['Python', 'SQL', 'ETAP', 'PSS/E', 'Tableau', 'Data Analytics', 'Cross-functional Collaboration'],
    missingSkills: ['Harmonic Power Quality'],
    benefits: ['Health Insurance (self + parents)', 'Quarterly Incentive', 'Employee Stock Purchase Program', 'Flexible Work Options'],
    postedDate: '2 days ago',
    applicantsCount: 24,
    isFeatured: true
  },
  {
    id: 'job-qualcomm-07',
    title: 'Systems Performance & C++ Software Engineer',
    company: 'Qualcomm India',
    companyLogo: 'QC',
    logoColor: 'from-blue-700 to-cyan-800',
    location: 'Bengaluru, Karnataka',
    workMode: 'Hybrid',
    experience: '3 - 6 years',
    salaryMin: 22.0,
    salaryMax: 36.0,
    salaryINR: '₹22.0 - ₹36.0 LPA',
    salaryMonthly: '₹1.83L - ₹3.00L / month',
    category: 'Software & Technology',
    industry: 'Software & Technology',
    matchScore: 88,
    fitLevel: 'Good Fit',
    description: 'Optimize high-throughput multithreaded simulation software, hardware abstraction layers, and memory profiling pipelines.',
    requiredSkills: ['C++', 'Python', 'Data Structures', 'Git', 'Cloud Architecture', 'Problem Solving'],
    matchingSkills: ['C++', 'Python', 'Data Structures', 'Git', 'Problem Solving'],
    missingSkills: ['Kernel Debugging', 'Valgrind Profiling'],
    benefits: ['Lucrative Restricted Stock Units (RSUs)', 'Top Tier Medical Cover', 'Wellness Allowance', 'Annual Bonus (15-20%)'],
    postedDate: '5 days ago',
    applicantsCount: 84,
    isFeatured: false
  },
  {
    id: 'job-infosys-08',
    title: 'Cloud Infrastructure & Data Analytics Specialist',
    company: 'Infosys Cobalt',
    companyLogo: 'IN',
    logoColor: 'from-indigo-600 to-purple-800',
    location: 'Hyderabad, Telangana',
    workMode: 'Remote',
    experience: '2 - 5 years',
    salaryMin: 14.0,
    salaryMax: 23.0,
    salaryINR: '₹14.0 - ₹23.0 LPA',
    salaryMonthly: '₹1.16L - ₹1.91L / month',
    category: 'Software & Technology',
    industry: 'Software & Technology',
    matchScore: 86,
    fitLevel: 'Good Fit',
    description: 'Build automated AWS cloud infrastructure pipelines, relational database synchronization controllers, and analytics ETL jobs.',
    requiredSkills: ['Python', 'SQL', 'AWS', 'Cloud Architecture', 'API Development', 'Tableau', 'Git'],
    matchingSkills: ['Python', 'SQL', 'AWS', 'Cloud Architecture', 'API Development', 'Tableau', 'Git'],
    missingSkills: ['Terraform', 'Kubernetes'],
    benefits: ['100% Remote Policy', 'High Speed Internet Allowance', 'Health Insurance', 'Certification Reimbursements'],
    postedDate: '3 days ago',
    applicantsCount: 72,
    isFeatured: false
  },
  {
    id: 'job-razorpay-09',
    title: 'Full Stack & API Platform Developer',
    company: 'Razorpay Technologies',
    companyLogo: 'RZ',
    logoColor: 'from-blue-600 to-teal-600',
    location: 'Bengaluru, Karnataka',
    workMode: 'Hybrid',
    experience: '2 - 5 years',
    salaryMin: 18.0,
    salaryMax: 28.0,
    salaryINR: '₹18.0 - ₹28.0 LPA',
    salaryMonthly: '₹1.50L - ₹2.33L / month',
    category: 'Software & Technology',
    industry: 'Software & Technology',
    matchScore: 85,
    fitLevel: 'Good Fit',
    description: 'Develop high-resilience payment gateway API endpoints, developer SDKs, and merchant-facing real-time analytics web interfaces.',
    requiredSkills: ['Python', 'SQL', 'API Development', 'Git', 'Data Structures', 'Analytical Thinking'],
    matchingSkills: ['Python', 'SQL', 'API Development', 'Git', 'Data Structures', 'Analytical Thinking'],
    missingSkills: ['Node.js', 'Redis Caching'],
    benefits: ['Comprehensive Insurance', 'Wellness Stipend', 'Unlimited PTO', 'Annual Learning Credits'],
    postedDate: '1 day ago',
    applicantsCount: 53,
    isFeatured: false
  },
  {
    id: 'job-robotics-10',
    title: 'Autonomous Robotics Systems Engineer',
    company: 'GreyOrange Robotics',
    companyLogo: 'GO',
    logoColor: 'from-amber-600 to-red-600',
    location: 'Gurugram, Haryana',
    workMode: 'Hybrid',
    experience: '2 - 6 years',
    salaryMin: 18.0,
    salaryMax: 32.0,
    salaryINR: '₹18.0 - ₹32.0 LPA',
    salaryMonthly: '₹1.50L - ₹2.66L / month',
    category: 'Robotics & Automation',
    industry: 'Robotics',
    matchScore: 87,
    fitLevel: 'Good Fit',
    description: 'Implement autonomous mobile robot navigation algorithms, kinematics simulation models, and multi-robot fleet dispatch telemetry.',
    requiredSkills: ['C++', 'Python', 'System Integration', 'Data Structures', 'Problem Solving', 'Strategic Planning'],
    matchingSkills: ['C++', 'Python', 'System Integration', 'Data Structures', 'Problem Solving', 'Strategic Planning'],
    missingSkills: ['ROS (Robot Operating System)', 'LiDAR SLAM'],
    benefits: ['Stock Options', 'Health Cover with Parents', 'Gym Membership', 'Catered Lunches'],
    postedDate: '4 days ago',
    applicantsCount: 31,
    isFeatured: false
  },
  {
    id: 'job-fintech-11',
    title: 'FinTech Quantitative Systems & Risk Analyst',
    company: 'PhonePe Technologies',
    companyLogo: 'PP',
    logoColor: 'from-purple-700 to-indigo-900',
    location: 'Bengaluru, Karnataka',
    workMode: 'Hybrid',
    experience: '2 - 5 years',
    salaryMin: 18.5,
    salaryMax: 30.0,
    salaryINR: '₹18.5 - ₹30.0 LPA',
    salaryMonthly: '₹1.54L - ₹2.50L / month',
    category: 'Finance, Banking & Accounting',
    industry: 'Finance, Banking & Accounting',
    matchScore: 86,
    fitLevel: 'Good Fit',
    description: 'Design risk modeling pipelines, transaction anomaly detection engines, and automated regulatory auditing analytics.',
    requiredSkills: ['Python', 'SQL', 'Data Analytics', 'Tableau', 'Problem Solving', 'Analytical Thinking'],
    matchingSkills: ['Python', 'SQL', 'Data Analytics', 'Tableau', 'Problem Solving', 'Analytical Thinking'],
    missingSkills: ['Risk Modeling', 'FinTech Compliance'],
    benefits: ['Top Quartile CTC & Bonuses', 'Medical Insurance (₹10L)', 'Hybrid Work Allowance', 'PF & Gratuity'],
    postedDate: '2 days ago',
    applicantsCount: 46,
    isFeatured: false
  },
  {
    id: 'job-health-12',
    title: 'Clinical Data & Health Informatics Analyst',
    company: 'Apollo Health Digital',
    companyLogo: 'AH',
    logoColor: 'from-emerald-700 to-cyan-800',
    location: 'Chennai, Tamil Nadu',
    workMode: 'Hybrid',
    experience: '2 - 5 years',
    salaryMin: 12.0,
    salaryMax: 21.0,
    salaryINR: '₹12.0 - ₹21.0 LPA',
    salaryMonthly: '₹1.00L - ₹1.75L / month',
    category: 'Healthcare & Medical Sciences',
    industry: 'Healthcare & Medical Sciences',
    matchScore: 84,
    fitLevel: 'Good Fit',
    description: 'Bridge medical record informatics, patient treatment analytics pipelines, and secure cloud health record APIs.',
    requiredSkills: ['Python', 'SQL', 'Data Analytics', 'Tableau', 'Cross-functional Collaboration'],
    matchingSkills: ['Python', 'SQL', 'Data Analytics', 'Tableau', 'Cross-functional Collaboration'],
    missingSkills: ['EHR Systems', 'HIPAA / FHIR Standards'],
    benefits: ['Apollo Hospital Discounts', 'Health & Term Insurance', 'Retirement PF', 'Annual Health Checkups'],
    postedDate: '6 days ago',
    applicantsCount: 22,
    isFeatured: false
  }
];

const JobMatcherPage = () => {
  const navigate = useNavigate();
  const {
    resumeData,
    targetRole,
    uploadedFileName,
    userProfile,
    selectedIndustry
  } = useApp();

  const applicantName = resumeData?.contact?.fullName?.trim() || userProfile?.fullName?.trim() || 'Aanchal Sharma';
  const activeFileName = uploadedFileName || resumeData?.fileName || 'Active_Resume.pdf';

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedSalaryBand, setSelectedSalaryBand] = useState('All');
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'salaryHigh' | 'recent'
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  // Application Modal state
  const [activeApplyJob, setActiveApplyJob] = useState(null);
  const [applicantEmail, setApplicantEmail] = useState(resumeData?.contact?.email || 'aanchal.sharma@example.com');
  const [applicantPhone, setApplicantPhone] = useState(resumeData?.contact?.phone || '+91 98765 43210');
  const [expectedCTC, setExpectedCTC] = useState('24.0');
  const [noticePeriod, setNoticePeriod] = useState('15 Days');
  const [coverNote, setCoverNote] = useState(
    `Dear Hiring Team,\n\nI am enthusiastic about applying for this role. With my background in simulation software, Python, C++, and power systems engineering, I am confident in delivering high-impact contributions to your team.\n\nBest regards,\n${applicantName}`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(null);

  // Toggle bookmark
  const toggleBookmark = (id) => {
    setBookmarkedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtered and sorted job listings
  const filteredJobs = useMemo(() => {
    return INITIAL_JOB_LISTINGS.filter((job) => {
      // Search term filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesSkills = job.requiredSkills.some((s) => s.toLowerCase().includes(q));
        const matchesLocation = job.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSkills && !matchesLocation) return false;
      }

      // Location filter
      if (selectedLocation !== 'All') {
        if (!job.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      }

      // Work mode filter
      if (selectedWorkMode !== 'All') {
        if (job.workMode.toLowerCase() !== selectedWorkMode.toLowerCase()) return false;
      }

      // Salary band filter (in INR LPA)
      if (selectedSalaryBand === '10-18') {
        if (job.salaryMax < 10 || job.salaryMin > 18) return false;
      } else if (selectedSalaryBand === '18-25') {
        if (job.salaryMax < 18 || job.salaryMin > 25) return false;
      } else if (selectedSalaryBand === '25+') {
        if (job.salaryMax < 25) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match') return b.matchScore - a.matchScore;
      if (sortBy === 'salaryHigh') return b.salaryMax - a.salaryMax;
      if (sortBy === 'recent') return a.postedDate.localeCompare(b.postedDate);
      return 0;
    });
  }, [searchQuery, selectedLocation, selectedWorkMode, selectedSalaryBand, sortBy]);

  // Handle application submission
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setAppliedJobs((prev) => new Set(prev).add(activeApplyJob.id));
      const refId = `IND-APP-${Math.floor(100000 + Math.random() * 900000)}`;
      setApplicationSuccess({
        jobTitle: activeApplyJob.title,
        company: activeApplyJob.company,
        refId,
        salaryINR: activeApplyJob.salaryINR
      });
      setActiveApplyJob(null);
    }, 700);
  };

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto space-y-8 font-sans pb-16">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-2 border border-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Active Job Matcher & Opportunities
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Jobs You Can Apply For
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Matched in real-time against active resume: <span className="font-bold text-purple-900">{activeFileName}</span>. All compensation shown in <strong className="text-emerald-700 font-extrabold">INR (₹ LPA)</strong>.
            </p>
          </div>

          <button
            onClick={() => navigate('/resume-overview')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-stone-800 font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-purple-600" /> Back to Resume Analyzer
          </button>
        </div>

        {/* Candidate Context Pill Banner */}
        <div className="bg-[#fbf7fd] rounded-2xl p-4 sm:p-5 border border-purple-200/90 shadow-soft flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap text-xs sm:text-sm">
            <div>
              <span className="text-stone-500 font-medium block text-[11px]">Candidate</span>
              <span className="font-extrabold text-stone-900">{applicantName}</span>
            </div>
            <div className="h-8 w-px bg-purple-200 hidden sm:block" />
            <div>
              <span className="text-stone-500 font-medium block text-[11px]">Primary Target Role</span>
              <span className="font-extrabold text-purple-900">{targetRole?.title || 'Grid Integration Software Engineer'}</span>
            </div>
            <div className="h-8 w-px bg-purple-200 hidden sm:block" />
            <div>
              <span className="text-stone-500 font-medium block text-[11px]">Peak Alignment</span>
              <span className="font-extrabold text-emerald-700">94% Fit Score</span>
            </div>
            <div className="h-8 w-px bg-purple-200 hidden sm:block" />
            <div>
              <span className="text-stone-500 font-medium block text-[11px]">Currency Display</span>
              <span className="font-extrabold text-stone-900 inline-flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> INR (₹ Lacs per Annum)
              </span>
            </div>
          </div>

          <div className="text-xs font-bold text-purple-800 bg-purple-100/90 px-3 py-1.5 rounded-xl border border-purple-200">
            {filteredJobs.length} verified jobs open
          </div>
        </div>

        {/* Search & Multi-Criteria Filtering Controls */}
        <div className="bg-white rounded-2xl p-5 border border-purple-200/90 shadow-soft space-y-4">
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company name, skill (e.g. Python, Grid Integration, Siemens, ABB)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-purple-200 bg-[#fdfbfd] text-sm text-stone-900 font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Location Filter */}
            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-600" /> Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-stone-800 font-bold focus:outline-none focus:border-purple-600"
              >
                <option value="All">All Locations in India</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Gurugram">Gurugram / NCR</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            {/* Work Mode Filter */}
            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-purple-600" /> Work Mode
              </label>
              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-stone-800 font-bold focus:outline-none focus:border-purple-600"
              >
                <option value="All">All Modes (Remote/Hybrid)</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            {/* Salary Range Filter (INR) */}
            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-1 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Pay Scale (INR)
              </label>
              <select
                value={selectedSalaryBand}
                onChange={(e) => setSelectedSalaryBand(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-stone-800 font-bold focus:outline-none focus:border-purple-600"
              >
                <option value="All">All INR Salaries</option>
                <option value="10-18">₹10 - ₹18 LPA</option>
                <option value="18-25">₹18 - ₹25 LPA</option>
                <option value="25+">₹25+ LPA (Senior)</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" /> Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-stone-800 font-bold focus:outline-none focus:border-purple-600"
              >
                <option value="match">Highest Match %</option>
                <option value="salaryHigh">Highest Salary (₹ LPA)</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Application Success Modal Banner */}
        {applicationSuccess && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-soft flex items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-emerald-950 text-base">
                  Application Submitted Successfully!
                </h4>
                <p className="text-xs text-stone-700 mt-0.5">
                  Applied for <strong className="text-stone-900">{applicationSuccess.jobTitle}</strong> at{' '}
                  <strong className="text-stone-900">{applicationSuccess.company}</strong> • Tracking ID:{' '}
                  <span className="font-mono font-bold text-emerald-800">{applicationSuccess.refId}</span> • Pay: <span className="font-bold text-emerald-800">{applicationSuccess.salaryINR}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setApplicationSuccess(null)}
              className="px-3 py-1.5 rounded-lg border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Job Listings Grid */}
        <div className="space-y-5">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-purple-200 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="font-extrabold text-stone-900 text-lg">No matching job listings found</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Try broadening your search query or reset the location and salary filters to view all available roles in INR.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation('All');
                  setSelectedWorkMode('All');
                  setSelectedSalaryBand('All');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isApplied = appliedJobs.has(job.id);
              const isBookmarked = bookmarkedJobs.has(job.id);

              return (
                <div
                  key={job.id}
                  className={`bg-white rounded-2xl p-6 border transition-all duration-300 shadow-soft hover:shadow-md ${
                    isApplied ? 'border-emerald-300 bg-emerald-50/20' : 'border-purple-200 hover:border-purple-400'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                    {/* Left: Company & Role Details */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Company Avatar */}
                      <div
                        className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${job.logoColor} flex items-center justify-center text-white font-black text-lg shrink-0 shadow-sm`}
                      >
                        {job.companyLogo}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-extrabold text-stone-900 text-lg sm:text-xl tracking-tight leading-snug">
                            {job.title}
                          </h3>
                          {job.isFeatured && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wide">
                              Top Match
                            </span>
                          )}
                          {isApplied && (
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Applied
                            </span>
                          )}
                        </div>

                        {/* Company & Meta info */}
                        <div className="flex items-center gap-3 text-xs text-stone-600 font-semibold flex-wrap">
                          <span className="text-stone-900 font-bold flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-purple-600" /> {job.company}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-500" /> {job.location}
                          </span>
                          <span>•</span>
                          <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded-md font-bold text-[11px] border border-purple-200">
                            {job.workMode}
                          </span>
                          <span>•</span>
                          <span className="text-stone-500">{job.experience}</span>
                        </div>

                        {/* Job Description Snippet */}
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal pt-1">
                          {job.description}
                        </p>

                        {/* Matching Skills vs Missing Keywords */}
                        <div className="pt-2 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="font-extrabold text-emerald-800 text-[11px] uppercase tracking-wider">
                              Matching Resume Skills:
                            </span>
                            {job.matchingSkills.slice(0, 6).map((sk, idx) => (
                              <span
                                key={idx}
                                className="bg-emerald-50 text-emerald-900 px-2.5 py-0.5 rounded-md font-bold text-xs border border-emerald-200 shadow-2xs"
                              >
                                ✓ {sk}
                              </span>
                            ))}
                            {job.missingSkills.length > 0 && (
                              <>
                                <span className="font-extrabold text-rose-800 text-[11px] uppercase tracking-wider ml-1">
                                  Missing:
                                </span>
                                {job.missingSkills.map((sk, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-rose-50 text-rose-900 px-2.5 py-0.5 rounded-md font-bold text-xs border border-rose-200 shadow-2xs"
                                  >
                                    ✗ {sk}
                                  </span>
                                ))}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Perks & Benefits */}
                        <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-stone-600 font-medium">
                          {job.benefits.map((b, idx) => (
                            <span key={idx} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-semibold">
                              ✓ {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Salary (strictly INR), Match Score & Apply Button */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 lg:w-64 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-100">
                      <div className="text-left lg:text-right">
                        {/* Match Score Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300 shadow-2xs mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{job.matchScore}% Resume Fit</span>
                        </div>

                        {/* Salary in INR */}
                        <div className="flex items-center lg:justify-end gap-1 text-lg sm:text-xl font-black text-stone-900">
                          <IndianRupee className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>{job.salaryINR}</span>
                        </div>
                        <div className="text-[11px] font-bold text-stone-500">
                          Est. {job.salaryMonthly}
                        </div>
                      </div>

                      {/* Action CTAs */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleBookmark(job.id)}
                          className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                            isBookmarked
                              ? 'bg-purple-100 text-purple-700 border-purple-300'
                              : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
                          }`}
                          title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark job'}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-purple-600' : ''}`} />
                        </button>

                        <button
                          onClick={() => setActiveApplyJob(job)}
                          disabled={isApplied}
                          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white shadow-purple-600/25 hover:scale-105 active:scale-95'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-4 h-4" /> Applied
                            </>
                          ) : (
                            <>
                              Apply Now <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ========================================================================= */}
        {/* MODAL: APPLY TO JOB OPENING WITH PRE-FILLED ACTIVE RESUME                  */}
        {/* ========================================================================= */}
        {activeApplyJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-purple-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider">
                    Direct Application Submission
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-lg sm:text-xl">
                    Apply to {activeApplyJob.company}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Position: <strong className="text-stone-900">{activeApplyJob.title}</strong> • Pay:{' '}
                    <strong className="text-emerald-700">{activeApplyJob.salaryINR}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setActiveApplyJob(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs font-sans">
                {/* Auto-Attached Active Resume */}
                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-stone-900 text-xs sm:text-sm">{activeFileName}</div>
                      <div className="text-[11px] text-stone-600 font-semibold">
                        Auto-attached from Active Resume Analyzer • {activeApplyJob.matchScore}% Match
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Ready
                  </span>
                </div>

                {/* Candidate Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={applicantName}
                      disabled
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-stone-900 font-medium focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-stone-900 font-medium focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Notice Period</label>
                    <select
                      value={noticePeriod}
                      onChange={(e) => setNoticePeriod(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-stone-900 font-bold focus:outline-none focus:border-purple-600"
                    >
                      <option value="Immediate">Immediate / 0 Days</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days (1 Month)</option>
                      <option value="60 Days">60 Days (2 Months)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1 flex items-center justify-between">
                    <span>Expected Compensation (in INR ₹ LPA)</span>
                    <span className="text-emerald-700 font-extrabold">₹{expectedCTC} LPA</span>
                  </label>
                  <input
                    type="range"
                    min="12.0"
                    max="45.0"
                    step="0.5"
                    value={expectedCTC}
                    onChange={(e) => setExpectedCTC(e.target.value)}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-bold">
                    <span>₹12.0 LPA</span>
                    <span>₹24.0 LPA</span>
                    <span>₹35.0 LPA</span>
                    <span>₹45.0 LPA</span>
                  </div>
                </div>

                {/* Brief Cover Note */}
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Short Cover Note</label>
                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full p-3 rounded-xl border border-purple-200 bg-white text-stone-800 text-xs focus:outline-none focus:border-purple-600 font-sans"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-purple-100">
                  <button
                    type="button"
                    onClick={() => setActiveApplyJob(null)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      'Submitting Application...'
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default JobMatcherPage;
