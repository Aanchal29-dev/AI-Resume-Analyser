// src/data/mockData.js

export const SAMPLE_RESUMES = {
  default: {
    id: 'res-101',
    fileName: 'My_Uploaded_Resume.pdf',
    fileSize: '245 KB',
    uploadedAt: '2026-09-16',
    parsed: {
      contact: {
        fullName: '',
        email: 'user@college.edu',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/user-profile',
        github: 'github.com/user-code',
        portfolio: 'user-portfolio.dev'
      },
      summary: 'Motivated student with strong hands-on project experience in web technologies, software development, and technical problem solving. Passionate about applying academic skills to real-world career roles.',
      education: [
        {
          institution: 'State University of Technology',
          degree: 'Bachelor of Science / Arts',
          location: 'San Francisco, CA',
          graduationYear: '2026',
          gpa: '3.8 / 4.0',
          coursework: 'Data Structures & Algorithms, Web Engineering, Machine Learning, Technical Writing'
        }
      ],
      experience: [
        {
          id: 'exp-1',
          title: 'Developer / Project Intern',
          company: 'Tech Solutions Lab',
          location: 'San Francisco, CA',
          period: 'June 2025 - August 2025',
          description: 'Worked on software applications and UI components. Created modules for user dashboard. Fixed bugs reported by QA team.',
          improvedBullet: 'Engineered responsive web components for analytics dashboard, boosting user onboarding completion by 22% and reducing support tickets.',
          bullets: [
            'Developed interactive user interface components to visualize metrics.',
            'Collaborated with engineering team to integrate RESTful API endpoints.',
            'Participated in daily agile standups and code review sessions.'
          ]
        },
        {
          id: 'exp-2',
          title: 'Software Developer Assistant',
          company: 'Campus IT Lab',
          location: 'San Francisco, CA',
          period: 'Jan 2025 - May 2025',
          description: 'Assisted in maintaining campus software and writing Python scripts.',
          improvedBullet: 'Automated record validation using Python scripts, saving 12 hours of manual data entry per week.',
          bullets: [
            'Maintained university portal web pages using HTML, CSS, and JavaScript.',
            'Wrote automation scripts for data cleanup and report generation.'
          ]
        }
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'AI Career & Resume Assistant',
          tech: 'React, Vite, Node.js, Tailwind CSS',
          period: '2026',
          description: 'Built a full-stack web application to analyze resumes and give career advice.',
          improvedBullet: 'Architected a React-driven resume analysis platform with instant ATS score calculations for 200+ test users.',
          bullets: [
            'Developed interactive frontend UI using React, Tailwind CSS, and custom hooks.',
            'Implemented ATS keyword extractor algorithm and skill gap engine.'
          ]
        }
      ],
      skills: {
        technical: ['React', 'JavaScript (ES6+)', 'TypeScript', 'HTML5/CSS3', 'Tailwind CSS', 'Node.js', 'Python', 'Git/GitHub', 'REST APIs', 'SQL'],
        soft: ['Problem Solving', 'Team Collaboration', 'Agile Methodology', 'Technical Writing'],
        tools: ['Vite', 'VS Code', 'Postman', 'Figma']
      },
      certifications: [
        { name: 'Professional Developer Certificate', issuer: 'Coursera / Meta', year: '2025' }
      ]
    }
  }
};

export const SAMPLE_JOB_ROLES = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    category: 'Software Engineering',
    demand: 'High',
    avgSalary: '$85,000 - $120,000',
    description: 'Build responsive, scalable, and intuitive web user interfaces using modern JavaScript frameworks like React, Vue, or Next.js.',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'HTML5/CSS3', 'Tailwind CSS', 'REST APIs', 'Git', 'Responsive Design', 'Web Performance'],
    niceToHave: ['Next.js', 'Redux', 'Jest/Testing Library', 'Figma', 'GraphQL'],
    responsibilities: [
      'Translate UI/UX designs into high-quality component-based code.',
      'Optimize application speed, accessibility, and cross-browser compatibility.',
      'Collaborate with backend developers to connect RESTful & GraphQL endpoints.',
      'Participate in code reviews, sprint planning, and automated testing.'
    ]
  },
  {
    id: 'tech-writer',
    title: 'Technical Writer / Documentation Specialist',
    category: 'Literature & Publishing',
    demand: 'High',
    avgSalary: '$75,000 - $110,000',
    description: 'Draft clear, concise API documentation, developer guides, user manuals, and technical articles for complex software platforms.',
    requiredSkills: ['Technical Writing', 'Markdown', 'API Documentation (Swagger/OpenAPI)', 'Editing & Proofreading', 'Git', 'Content Strategy'],
    niceToHave: ['HTML/CSS', 'Docusaurus', 'Information Architecture', 'User Research'],
    responsibilities: [
      'Collaborate with software engineers to document complex technical architectures.',
      'Create step-by-step developer tutorials and API reference guides.',
      'Maintain knowledge base articles and release notes for software deployments.'
    ]
  },
  {
    id: 'content-strategist',
    title: 'Content Strategist & Copywriter',
    category: 'Literature & Publishing',
    demand: 'Medium-High',
    avgSalary: '$70,000 - $105,000',
    description: 'Plan, write, and optimize brand narratives, editorial calendars, marketing copy, and digital publication content.',
    requiredSkills: ['Copywriting', 'Content Strategy', 'SEO Writing', 'Editorial Planning', 'Storytelling', 'CMS (WordPress/HubSpot)'],
    niceToHave: ['Analytics (Google Analytics)', 'A/B Testing', 'Social Media Management', 'AP Style'],
    responsibilities: [
      'Develop compelling content strategies tailored for target reader audiences.',
      'Write high-converting website copy, blog publications, and newsletter campaigns.',
      'Audit existing publications for brand tone, SEO keywords, and engagement metrics.'
    ]
  },
  {
    id: 'ux-writer',
    title: 'UX Writer / Microcopy Specialist',
    category: 'Literature & Design',
    demand: 'High',
    avgSalary: '$80,000 - $115,000',
    description: 'Craft intuitive microcopy, button labels, error messages, and onboarding text inside web and mobile applications.',
    requiredSkills: ['UX Writing', 'Microcopy', 'User Journey Mapping', 'Figma', 'Information Architecture', 'Usability Testing'],
    niceToHave: ['Content Design Systems', 'Accessibility (WCAG)', 'A/B Testing'],
    responsibilities: [
      'Design clear, helpful UI microcopy that guides users seamlessly through product flows.',
      'Establish brand voice guidelines for error states, tooltips, and modal dialogs.',
      'Conduct usability tests on copy variations to improve task completion rates.'
    ]
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Developer',
    category: 'Software Engineering',
    demand: 'Very High',
    avgSalary: '$90,000 - $135,000',
    description: 'Develop end-to-end web applications handling both frontend user interfaces and backend database/server architecture.',
    requiredSkills: ['React', 'Node.js', 'Express', 'JavaScript', 'Python', 'SQL (MySQL/PostgreSQL)', 'REST APIs', 'Git', 'HTML/CSS'],
    niceToHave: ['Docker', 'AWS', 'MongoDB', 'TypeScript', 'CI/CD'],
    responsibilities: [
      'Design modular client-side components and server-side REST API controllers.',
      'Manage relational database schemas, migrations, and query optimization.',
      'Implement authentication, authorization, and secure API gateways.'
    ]
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    demand: 'High',
    avgSalary: '$75,000 - $105,000',
    description: 'Extract, clean, analyze, and visualize data to deliver actionable insights that drive business strategy.',
    requiredSkills: ['Python', 'SQL', 'Pandas', 'Data Visualization', 'Tableau / PowerBI', 'Excel', 'Statistics'],
    niceToHave: ['R', 'A/B Testing', 'BigQuery', 'Machine Learning Basics'],
    responsibilities: [
      'Query complex relational databases to generate recurring performance reports.',
      'Create interactive executive dashboards using Tableau or PowerBI.',
      'Perform exploratory data analysis to spot market trends and anomalies.'
    ]
  }
];

// Industry-Specific Questionnaires
export const FIELD_QUESTIONNAIRES = {
  literature: [
    {
      id: 1,
      question: "What primary area of writing or literature excites you most?",
      category: "Focus Area",
      options: [
        { label: "Technical Writing & Developer Documentation", role: "tech-writer" },
        { label: "Content Strategy, Journalism & Editorial Copywriting", role: "content-strategist" },
        { label: "UX Microcopy & Product Content Design", role: "ux-writer" },
        { label: "Creative Writing, Fiction & Literary Publishing", role: "content-strategist" }
      ]
    },
    {
      id: 2,
      question: "Which writing tools and digital platforms do you use regularly?",
      category: "Tools & Skills",
      options: [
        { label: "Markdown, Git, and API Documentation Tools (Swagger/Docusaurus)", role: "tech-writer" },
        { label: "Content Management Systems (WordPress, CMS, HubSpot) & SEO", role: "content-strategist" },
        { label: "Figma, Design Systems & Wireframing Microcopy", role: "ux-writer" },
        { label: "Google Docs, Scrivener, and Editorial Style Guides (AP/Chicago)", role: "content-strategist" }
      ]
    },
    {
      id: 3,
      question: "How do you approach editing and research for a publication?",
      category: "Methodology",
      options: [
        { label: "Collaborating with subject matter experts to demystify complex technical concepts", role: "tech-writer" },
        { label: "Analyzing reader demographics, SEO keywords, and engagement metrics", role: "content-strategist" },
        { label: "Testing user flow clarity, error message tone, and interface conciseness", role: "ux-writer" },
        { label: "Deep qualitative analysis, literary critique, and historical research", role: "content-strategist" }
      ]
    },
    {
      id: 4,
      question: "What is your target career output in the literature & communications field?",
      category: "Career Output",
      options: [
        { label: "Clear API reference manuals and technical developer portals", role: "tech-writer" },
        { label: "High-impact brand stories, articles, and content marketing campaigns", role: "content-strategist" },
        { label: "Intuitive product copy that makes software effortless to navigate", role: "ux-writer" }
      ]
    }
  ],

  tech: [
    {
      id: 1,
      question: "Which software engineering domain interests you most?",
      category: "Domain Preference",
      options: [
        { label: "Frontend Web Interfaces & React Component Architecture", role: "frontend-dev" },
        { label: "Backend API Controllers, Databases & Server Infrastructure", role: "backend-dev" },
        { label: "Full Stack End-to-End Application Engineering", role: "fullstack-dev" }
      ]
    },
    {
      id: 2,
      question: "How comfortable are you writing code on a daily basis?",
      category: "Skill Level",
      options: [
        { label: "I love coding every day (JavaScript, TypeScript, Python)", role: "frontend-dev" },
        { label: "I prefer working with SQL databases, servers, and APIs", role: "fullstack-dev" },
        { label: "I want to build full-stack web products from scratch", role: "fullstack-dev" }
      ]
    },
    {
      id: 3,
      question: "What type of technical output excites you most?",
      category: "Output",
      options: [
        { label: "Interactive web applications with smooth UI animations", role: "frontend-dev" },
        { label: "High-throughput RESTful API endpoints and database models", role: "fullstack-dev" }
      ]
    }
  ],

  business: [
    {
      id: 1,
      question: "Which business or analytics specialization matches your interest?",
      category: "Specialization",
      options: [
        { label: "Business Analysis & Process Optimization", role: "data-analyst" },
        { label: "Digital Marketing, SEO & Growth Strategy", role: "content-strategist" },
        { label: "Product Management & Market Research", role: "data-analyst" }
      ]
    },
    {
      id: 2,
      question: "Which analytical tools do you feel most comfortable with?",
      category: "Tools",
      options: [
        { label: "Excel, SQL Databases, and Tableau / PowerBI", role: "data-analyst" },
        { label: "Google Analytics, HubSpot, and SEO Tools", role: "content-strategist" }
      ]
    }
  ]
};

export const INITIAL_ANALYSIS_RESULT = {
  overallScore: 78,
  atsCompatibility: 84,
  jobMatchScore: 72,
  lastAnalyzed: 'Sept 16, 2026',
  status: 'Needs Tailoring',
  categories: [
    {
      id: 'ats',
      name: 'ATS Compatibility',
      score: 84,
      status: 'Passed',
      color: 'emerald',
      summary: 'Clean structural layout with parseable fonts and standard section headings.'
    },
    {
      id: 'content',
      name: 'Content Quality',
      score: 74,
      status: 'Important',
      color: 'amber',
      summary: 'Strong experience descriptions, but 3 bullet points lack quantifiable impact metrics.'
    },
    {
      id: 'skills',
      name: 'Skills Match',
      score: 72,
      status: 'Important',
      color: 'amber',
      summary: '7 key role skills detected; missing TypeScript, Web Performance, and Automated Testing.'
    },
    {
      id: 'formatting',
      name: 'Formatting & Layout',
      score: 90,
      status: 'Passed',
      color: 'emerald',
      summary: 'Consistent line spacing, legible margins, and ATS-friendly single-column layout.'
    },
    {
      id: 'jobmatch',
      name: 'Job Description Match',
      score: 72,
      status: 'Important',
      color: 'amber',
      summary: 'Good alignment for target role, but missing specialized keywords.'
    },
    {
      id: 'experience',
      name: 'Experience Impact',
      score: 70,
      status: 'Fix First',
      color: 'rose',
      summary: 'Action verbs are repetitive ("Worked on", "Created"). Replace with high-impact verbs.'
    },
    {
      id: 'readability',
      name: 'Grammar & Readability',
      score: 88,
      status: 'Passed',
      color: 'emerald',
      summary: 'Zero spelling errors detected; clear concise phrasing.'
    }
  ],
  issues: [
    {
      id: 'issue-1',
      severity: 'Fix First',
      title: 'Passive Action Verbs in Experience Section',
      section: 'Experience',
      explanation: 'Lines like "Worked on a website using React" sound passive and fail to highlight your engineering ownership or results.',
      whyItMatters: 'Recruiters spend 6 seconds per resume. Bullet points starting with weak verbs fail to leave a lasting impression.',
      suggestedAction: 'Rewrite with action verbs like "Engineered", "Architected", or "Optimized", followed by metric outcomes.',
      originalText: 'Worked on a website using React and JavaScript to display metrics.',
      aiSuggestion: 'Engineered responsive React web interfaces to visualize real-time analytics, improving user retention by 18%.',
      status: 'pending'
    },
    {
      id: 'issue-2',
      severity: 'Fix First',
      title: 'Missing Critical Keyword: TypeScript',
      section: 'Skills / Experience',
      explanation: 'Target role explicitly lists TypeScript as a core requirement, but it is absent from your experience bullets.',
      whyItMatters: 'ATS filters auto-reject candidates missing mandatory skill tags.',
      suggestedAction: 'Add TypeScript to your technical skills matrix and mention its application in a project.',
      originalText: 'Technical Skills: React, JavaScript, HTML, CSS',
      aiSuggestion: 'Technical Skills: React, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS',
      status: 'pending'
    }
  ]
};

export const PLATFORM_SERVICES = [
  {
    id: 's1',
    title: 'Resume Quality Analysis',
    description: 'Deep structural check of resume formatting, word choice, section ordering, and contact information.',
    icon: 'FileSearch',
    badge: 'Popular'
  },
  {
    id: 's2',
    title: 'ATS Compatibility Checker',
    description: 'Simulate how applicant tracking systems parse your PDF/DOCX resume file.',
    icon: 'Cpu',
    badge: 'Core'
  },
  {
    id: 's3',
    title: 'Job Description Matching',
    description: 'Compare your resume against any target job description and get an instant match % score.',
    icon: 'Target',
    badge: 'Essential'
  },
  {
    id: 's4',
    title: 'AI Resume Bullet Enhancer',
    description: 'Transform weak bullet points into high-impact, quantified accomplishment statements.',
    icon: 'Sparkles',
    badge: 'AI Powered'
  },
  {
    id: 's5',
    title: 'AI Resume Builder',
    description: 'Build an ATS-optimized single-column resume from scratch with step-by-step AI guidance.',
    icon: 'FileText',
    badge: 'Interactive'
  },
  {
    id: 's6',
    title: 'Career Path Discovery',
    description: 'Unsure what role suits you? Answer guided questions to discover ideal career roles matched to your field.',
    icon: 'Compass',
    badge: 'Guided'
  },
  {
    id: 's7',
    title: 'Skill Gap Analysis',
    description: 'Identify missing technical skills and keywords required for your dream role.',
    icon: 'CheckSquare',
    badge: 'Actionable'
  },
  {
    id: 's8',
    title: 'Personalized Learning Plan',
    description: 'Get curated beginner & intermediate learning resources to close your skill gaps.',
    icon: 'GraduationCap',
    badge: 'Curated'
  },
  {
    id: 's9',
    title: 'AI Assistant',
    description: 'Interactive chat assistant to explain ATS rules, rewrite summaries, and answer career questions.',
    icon: 'Bot',
    badge: '24/7 AI'
  },
  {
    id: 's10',
    title: 'Resume Recheck & Version History',
    description: 'Track score improvements across multiple edits with before-and-after score comparisons.',
    icon: 'History',
    badge: 'Tracking'
  }
];

export const MOCK_LEARNING_RESOURCES = [
  {
    id: 'lr-1',
    skill: 'TypeScript',
    level: 'Beginner to Intermediate',
    priority: 'High',
    estHours: '12 hrs',
    status: 'To Learn',
    resources: [
      { name: 'TypeScript Official Handbook & Sandbox', provider: 'TypeScript Documentation', type: 'Documentation', free: true },
      { name: 'Understanding TypeScript for React Developers', provider: 'freeCodeCamp YouTube', type: 'Video Course', free: true }
    ]
  },
  {
    id: 'lr-2',
    skill: 'Web Performance & Optimization',
    level: 'Intermediate',
    priority: 'High',
    estHours: '8 hrs',
    status: 'In Progress',
    resources: [
      { name: 'Web.dev Performance Audits & Core Web Vitals', provider: 'Google Web.dev', type: 'Guide', free: true }
    ]
  }
];

export const INITIAL_AI_CHAT_MESSAGES = [
  {
    id: 'm-1',
    sender: 'assistant',
    text: "Hello! I am your AI Career & Resume Assistant. I'm ready to help analyze your resume or recommend target roles based on your chosen career field. How can I help you today?",
    timestamp: '11:30 AM'
  }
];

export const MOCK_HISTORY_ITEMS = [
  {
    id: 'hist-1',
    fileName: 'My_Uploaded_Resume.pdf',
    jobRole: 'Frontend Developer',
    date: '2026-09-16',
    overallScore: 78,
    atsScore: 84,
    jobMatchScore: 72,
    status: 'Needs Improvement'
  }
];
