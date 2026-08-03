import { Project, SkillCategory, TimelineMilestone, CVVariant } from '../types';

export const PERSONAL_INFO = {
  name: "Mahmoud Wehaiba",
  title: "Agricultural Engineer // Full-Stack & AI Systems Developer",
  location: "Egypt (Remote / Global)",
  tagline: "Bridging Agricultural Engineering, Scalable Web Systems, and Local AI Automation",
  email: "mahmoudwheba22@gmail.com",
  github: "https://github.com/meteoroite",
  linkedin: "https://www.linkedin.com/in/mahmoud-wehaiba-628a42221/",
  avatarUrl: "/images/profile.jpeg",
  logoUrl: "/images/logo.png",
  education: {
    degree: "Bachelor of Agricultural Engineering (General Division)",
    institution: "Tanta University",
    graduated: "June 2024",
  },
  militaryService: "Completed Mandatory Military Service (March 2025 - March 2026)",
  statusText: "OPEN FOR FULL-TIME ROLES & HIGH-IMPACT FREELANCE / PRODUCT CONSULTING",
  bio: `Agricultural Engineering graduate from Tanta University (2024) with a strong self-taught transition into software engineering and AI systems development. Specializes in building production-oriented full-stack web applications, async backend microservices, and orchestrating local/cloud LLM agents. Combines system-level engineering discipline with an entrepreneurial drive to build practical automation and high-value AI products.`,
  coreValues: [
    "Craftsmanship & Architectural Rigor",
    "Curiosity & Continuous Systems Learning",
    "Simplicity & Pragmatic Engineering First",
    "Independence & Full-Project Ownership"
  ]
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "course-platform",
    title: "Tornado E-Learning Platform",
    category: "Full-Stack",
    shortDesc: "High-concurrency online learning platform with real-time course rooms, authentication, and dockerized micro-services.",
    fullDesc: "Comprehensive online learning ecosystem supporting interactive video courses, real-time WebSocket notifications, JWT security, and structured progress tracking. Architected with modular backend separation for scalability.",
    stack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Socket.IO", "Docker", "Tailwind CSS"],
    status: "Active",
    keyLesson: "Large-scale e-learning platforms thrive when backend domain modules are strictly separated from presentation logic.",
    featured: true,
    role: "Full-Stack Engineer & Architect",
    metrics: ["Real-Time WebSocket Sync", "Dockerized Container Stack", "JWT RBAC Security"]
  },
  {
    id: "jarvis-assistant",
    title: "JARVIS Local AI Workspace Assistant",
    category: "AI",
    shortDesc: "Autonomous local AI engine for developer productivity, task orchestration, and context-aware RAG search.",
    fullDesc: "Local-first AI assistant built for desktop automation, code parsing, and context memory. Leverages local LLMs via Ollama to ensure complete data privacy while providing rapid command execution.",
    stack: ["Python", "FastAPI", "Ollama", "Qdrant Vector DB", "LangChain", "Docker", "REST APIs"],
    status: "Active",
    keyLesson: "Build a rock-solid, testable execution core before layering complex agent memory or multi-modal tools.",
    featured: true,
    role: "Sole AI Architect & Developer",
    metrics: ["100% Local Privacy", "Sub-second RAG Vector Retrieval", "Async Task Engine"]
  },
  {
    id: "healthmaster",
    title: "HealthMaster Digital Medical Card",
    category: "Full-Stack",
    shortDesc: "Unified medical card ecosystem centralizing patient records via secure QR codes across clinics, labs, and pharmacies.",
    fullDesc: "Centralized healthcare card system that allows doctors, labs, and pharmacies to instantly query and upload encrypted patient health history using a quick QR scan. Included custom portal modules for clinical roles.",
    stack: ["Node.js", "Express", "React", "MongoDB", "QR Engine", "JWT Auth", "REST API"],
    status: "Completed",
    keyLesson: "Designing domain-driven RBAC early prevents massive data refactoring when scaling to multiple user personas.",
    featured: true,
    role: "Backend & Systems Lead",
    metrics: ["Multi-Role Clinic Portals", "Instant QR Scan Decryption", "Zero Data Leaks"]
  },
  {
    id: "ai-agent-factory",
    title: "AI Agent Factory Engine",
    category: "AI",
    shortDesc: "Orchestration framework for dynamically instantiating, testing, and deploying specialized LLM agents.",
    fullDesc: "Modular platform enabling the creation of single-purpose and multi-agent teams with customizable system prompts, tool bindings, and vector memory instances.",
    stack: ["Python", "CrewAI", "LangChain", "FastAPI", "Ollama", "Docker"],
    status: "Paused",
    keyLesson: "Reusable abstractions and standard tool definitions are essential when scaling from 1 agent to 100.",
    featured: true,
    role: "AI Lead",
    metrics: ["Dynamic Tool Binding", "Multi-Agent Teams"]
  },
  {
    id: "dodo-mask",
    title: "Dodo Mask Client Web Application",
    category: "Client Work",
    shortDesc: "Production client application built and delivered as sole developer for real-world business operation.",
    fullDesc: "Custom web application engineered for client presentation, product showcase, and direct customer interactions with custom branding and swift page load optimizations.",
    stack: ["JavaScript (ES6+)", "HTML5", "CSS3 / Tailwind", "Vercel Pipeline"],
    status: "Completed",
    keyLesson: "Delivering software for real clients requires balancing technical elegance with hard business deadlines.",
    demoUrl: "https://dodo-mask.vercel.app/",
    featured: true,
    role: "Sole Developer & Consultant",
    metrics: ["100% Client Satisfaction", "Lighthouse 98 Performance Score"]
  },
  {
    id: "computer-vision-input",
    title: "Hand Gesture Keyboard & Eye Mouse",
    category: "Computer Vision",
    shortDesc: "Human-Computer Interaction (HCI) software mapping facial eye-tracking and hand gestures to OS input controls.",
    fullDesc: "Accessible HCI solutions utilizing OpenCV and MediaPipe to convert real-time camera feeds into precise mouse cursor movements and gesture-triggered virtual key strokes.",
    stack: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI", "NumPy"],
    status: "Completed",
    keyLesson: "Real-time computer vision requires aggressive frame-buffering and noise smoothing for usable UX.",
    featured: false,
    role: "CV Researcher & Developer",
    metrics: ["30 FPS Camera Pipeline", "Sub-50ms Input Latency"]
  },
  {
    id: "tornado-social",
    title: "Tornado Social Media Hub",
    category: "Full-Stack",
    shortDesc: "Pinterest-inspired visual discovery and social platform featuring Google OAuth and media storage.",
    fullDesc: "Mahmoud's first full-stack milestone project implementing end-to-end OAuth authentication, grid image rendering, comment threads, and user saved collections.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Google OAuth", "Tailwind CSS"],
    status: "Completed",
    keyLesson: "Completing a full-stack project end-to-end creates foundational confidence across authentication & databases.",
    featured: false,
    role: "Full-Stack Developer",
    metrics: ["Google OAuth 2.0", "Masonry Image Layout"]
  },
  {
    id: "holy-quran-app",
    title: "Holy Quran Media Reader & Audio Player",
    category: "Client Work",
    shortDesc: "Web application for reading recitations and listening to high-quality audio streams of the Holy Quran.",
    fullDesc: "Mobile-responsive web experience built with accessibility, low-latency audio buffering, dark/light themes, and chapter bookmarking.",
    stack: ["React", "JavaScript", "HTML5 Audio API", "Tailwind CSS"],
    status: "Completed",
    demoUrl: "https://holy-quran-pi.vercel.app",
    keyLesson: "Media-rich applications require robust state synchronization across page switches and audio buffers.",
    featured: false,
    role: "Sole Developer",
    metrics: ["Responsive Mobile Audio UX", "PWA Ready"]
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "languages",
    name: "Core Languages",
    iconName: "Code2",
    skills: [
      { name: "JavaScript (ES6+)", level: "Expert", years: "8+ yrs", note: "Primary web language since 2016" },
      { name: "TypeScript", level: "Advanced", years: "4+ yrs", note: "Strict type safety for full-stack apps" },
      { name: "Python", level: "Advanced", years: "5+ yrs", note: "FastAPI, AI agent frameworks, OpenCV" },
      { name: "C#", level: "Proficient", years: "2+ yrs", note: "ASP.NET Core REST web APIs" },
      { name: "SQL", level: "Proficient", years: "3+ yrs", note: "PostgreSQL schema design & queries" }
    ]
  },
  {
    id: "backend",
    name: "Backend Architecture",
    iconName: "Server",
    skills: [
      { name: "Node.js / Express", level: "Expert", years: "5+ yrs", note: "RESTful endpoints, middleware, JWT" },
      { name: "FastAPI", level: "Advanced", years: "3+ yrs", note: "Async Python backends & AI services" },
      { name: "ASP.NET Core", level: "Proficient", years: "2+ yrs", note: "Clean architecture microservices" },
      { name: "WebSockets / Socket.IO", level: "Advanced", years: "3+ yrs", note: "Real-time sync & bi-directional rooms" },
      { name: "REST API Design", level: "Expert", years: "6+ yrs", note: "OpenAPI specs, security, error handling" }
    ]
  },
  {
    id: "ai-automation",
    name: "AI & LLM Systems",
    iconName: "Cpu",
    skills: [
      { name: "Ollama / Local LLMs", level: "Expert", years: "2+ yrs", note: "Quantized model execution & privacy" },
      { name: "RAG & Vector Search", level: "Advanced", years: "2+ yrs", note: "Qdrant, embeddings, semantic retrieval" },
      { name: "LangChain & CrewAI", level: "Advanced", years: "2+ yrs", note: "Multi-agent orchestration & tools" },
      { name: "Prompt Engineering", level: "Expert", years: "3+ yrs", note: "System prompt optimization & schemas" },
      { name: "Gemini API", level: "Advanced", years: "2+ yrs", note: "Multimodal, streaming, function calls" }
    ]
  },
  {
    id: "frontend",
    name: "Modern Frontend",
    iconName: "Layout",
    skills: [
      { name: "React 18 / 19", level: "Expert", years: "6+ yrs", note: "Hooks, context, component modularity" },
      { name: "Next.js", level: "Advanced", years: "3+ yrs", note: "App router, SSR, API proxies" },
      { name: "Tailwind CSS", level: "Expert", years: "5+ yrs", note: "Custom design systems & responsiveness" },
      { name: "React Native (Expo)", level: "Proficient", years: "2+ yrs", note: "Cross-platform mobile interfaces" },
      { name: "Three.js", level: "Exploring", years: "1+ yr", note: "3D canvases & shaders" }
    ]
  },
  {
    id: "database-devops",
    name: "Databases & DevOps",
    iconName: "Database",
    skills: [
      { name: "MongoDB", level: "Advanced", years: "5+ yrs", note: "NoSQL document collections & indexing" },
      { name: "PostgreSQL", level: "Proficient", years: "2+ yrs", note: "Relational tables, joins, transactions" },
      { name: "Redis", level: "Proficient", years: "2+ yrs", note: "In-memory caching & session stores" },
      { name: "Docker & Docker Compose", level: "Advanced", years: "3+ yrs", note: "Containerized dev & production" },
      { name: "Git & Linux / WSL", level: "Expert", years: "8+ yrs", note: "WSL2 environment, Git pipelines" }
    ]
  }
];

export const TIMELINE_DATA: TimelineMilestone[] = [
  {
    year: "2016",
    period: "2016 - 2020",
    title: "Self-Taught Engineering Genesis",
    role: "Aspiring Developer",
    description: "Began journey into programming through rigorous self-study. Mastered core computer science concepts, JavaScript, C++, algorithms, and initial web architectures.",
    highlights: [
      "Built foundational knowledge in algorithms and data structures",
      "Created early static web utilities and DOM tools",
      "Adopted Linux and shell scripting early on"
    ],
    type: "education"
  },
  {
    year: "2020 - 2024",
    period: "Tanta University",
    title: "B.Sc. Agricultural Engineering & Full-Stack Expansion",
    role: "Engineering Student & Developer",
    organization: "Tanta University",
    description: "Earned B.Sc. in Agricultural Engineering while simultaneously engineering complex full-stack applications, health cards, computer vision gesture systems, and MERN apps.",
    highlights: [
      "Graduated in June 2024 with Agricultural Engineering Degree",
      "Engineered 'HealthMaster' QR medical system",
      "Developed 'Hand Gesture Keyboard' & 'Eye Mouse' using OpenCV & MediaPipe",
      "Shipped 'Dodo Mask' client web app"
    ],
    type: "achievement"
  },
  {
    year: "2025 - 2026",
    period: "March 2025 - March 2026",
    title: "Mandatory Military Service & Systems Planning",
    role: "Military Service & Long-term Architect",
    organization: "Egyptian Armed Forces",
    description: "Completed mandatory military service with honor while maintaining rigorous planning for backend engineering, AI agent architectures, and career roadmap.",
    highlights: [
      "Refined long-term software career strategy",
      "Planned JARVIS Local AI workspace engine architecture",
      "Strengthened dockerized dev workflow under WSL"
    ],
    type: "military"
  },
  {
    year: "2026 - Present",
    period: "2026 - Future",
    title: "AI & Full-Stack Engineering Leadership",
    role: "Software / AI Engineer & Founder",
    description: "Actively delivering production-oriented software, local LLM orchestration tools, and client solutions. Combining Agricultural Engineering discipline with scalable AI products.",
    highlights: [
      "Building JARVIS Local AI assistant platform",
      "Architecting production e-learning platforms",
      "Offering full-stack, AI automation & AgTech consulting"
    ],
    type: "career"
  }
];

export const CV_VARIANTS: CVVariant[] = [
  {
    id: "fullstack-ai",
    title: "Full-Stack & AI Systems Engineer",
    focus: "React, Node.js, Python, FastAPI, Local LLMs, Vector DBs, Docker",
    summary: "Versatile Full-Stack & AI Engineer proficient in building high-concurrency Node.js/FastAPI backends, interactive React frontends, and local RAG search pipelines.",
    highlights: [
      "8+ years coding experience across JS/TS, Python, C#, and C++",
      "Built JARVIS local LLM engine using Ollama, FastAPI & Qdrant",
      "Architected Tornado dockerized e-learning platform with WebSockets",
      "Strong proficiency in WSL2, Docker, MongoDB, and PostgreSQL"
    ],
    recommendedFor: "Software Houses, Startups, AI Product Teams & Full-Stack Roles"
  },
  {
    id: "backend-systems",
    title: "Backend & Systems Engineer",
    focus: "Node.js, Express, ASP.NET Core, FastAPI, PostgreSQL, Redis, Docker",
    summary: "Backend specialist with deep focus on RESTful API design, authentication security, database schema modeling, async task queues, and containerization.",
    highlights: [
      "Engineered RBAC authentication & QR decryption pipelines for HealthMaster",
      "Built async FastAPI microservices and ASP.NET Core web APIs",
      "Experienced with Redis caching, MongoDB indexing, and PostgreSQL joins",
      "Rigorous adherence to Clean Architecture and SOLID principles"
    ],
    recommendedFor: "Backend Engineering, API Platform, Infrastructure & Database Roles"
  },
  {
    id: "agtech-entrepreneur",
    title: "Agricultural Engineering & AgTech Innovator",
    focus: "Agri-Engineering B.Sc., Precision Tech, Computer Vision, AI Automation",
    summary: "Agricultural Engineer (Tanta University '24) equipped with software capabilities to solve real-world agricultural problems using computer vision and AI automation.",
    highlights: [
      "B.Sc. in Agricultural Engineering from Tanta University",
      "Developed gesture and eye-tracking systems with OpenCV and MediaPipe",
      "Unique perspective combining biological/agri systems with modern code",
      "Passionate about building AgTech SaaS & smart farming tools"
    ],
    recommendedFor: "AgTech Ventures, Smart Farming Research, Hardware-Software Systems"
  }
];

export const INITIAL_POSTS_DATA = [
  {
    id: "building-jarvis-local-llm",
    title: "Building JARVIS: Orchestrating Local LLMs with Ollama, Qdrant & FastAPI",
    summary: "How I designed a privacy-focused local AI workspace assistant with vector search RAG and sub-second execution latency without cloud token dependency.",
    content: `Local LLM execution has reached a tipping point. With model quantization (GGUF, Q4_K_M) and optimized inference engines like Ollama, developers can run capable 7B and 14B models directly on workstation hardware.

### Why Local First?
Data privacy, deterministic latency, and zero token costs are critical for developer workspace tools. When indexing local source code, personal notes, or internal specs, sending raw embeddings to cloud APIs can be a compliance liability.

### Architecture Blueprint
1. **Inference Layer**: Ollama serving Qwen2.5 / Llama3 models locally over REST endpoints.
2. **Vector Memory**: Qdrant vector database running in a Docker container, generating dense embeddings with \`bge-m3\`.
3. **Execution Pipeline**: Async FastAPI server in Python managing tool invocation, file parsing, and system command sandboxing.

### Key Learnings
- **Chunking Strategy Matters**: Overlapping recursive character text splitters (500 tokens with 50 token overlap) produce dramatically better retrieval context than naive line splitting.
- **Async Queueing**: Always decouple embedding generation from API response loops to maintain high responsiveness in the developer UI.`,
    tags: ["AI", "Ollama", "Python", "FastAPI", "Vector DB"],
    date: "2026-07-15",
    readTime: "5 min read",
    likes: 24,
    comments: [
      {
        id: "c1",
        author: "Tarek Mansour",
        text: "Great breakdown! How did you handle context window degradation over long workspace sessions?",
        createdAt: "2026-07-16 14:20",
        likes: 3
      },
      {
        id: "c2",
        author: "Elena Rostova",
        text: "The Qdrant + Ollama combination is brilliant for local RAG. Appreciate the insight on chunking strategy.",
        createdAt: "2026-07-18 09:12",
        likes: 5
      }
    ],
    status: "published" as const,
    author: "Mahmoud Wehaiba"
  },
  {
    id: "agtech-computer-vision-future",
    title: "Bridging Agricultural Engineering & Computer Vision: Smart Farming Automation",
    summary: "Reflections from my B.Sc. thesis at Tanta University on applying OpenCV, MediaPipe, and edge inference to precision agriculture and crop health tracking.",
    content: `Agriculture is fundamentally a engineering domain of massive scale, biological variability, and spatial complexity. Combining agricultural engineering principles with real-time computer vision opens immense efficiency gains for modern precision farming.

### Real-World Vision Pipelines in Agriculture
- **Fruit & Crop Health Detection**: Utilizing RGB-D cameras and YOLO/Custom CNN models to detect early pest infestations before visual decay spans across fields.
- **Automated Weed Discrimination**: Differentiating crops from invasive weeds using color-space segmentation (HSV thresholding) and morphological contour analysis.
- **HCI for Heavy Machinery**: Applying gesture tracking and eye movement detection (MediaPipe) to assist operators managing multi-harvest machinery in noisy cab environments.

### The Path Ahead
By combining embedded edge hardware (Jetson Orin) with low-latency vision algorithms, we can build affordable, localized smart farming tools for farmers globally.`,
    tags: ["AgTech", "Computer Vision", "OpenCV", "Python"],
    date: "2026-06-28",
    readTime: "4 min read",
    likes: 31,
    comments: [
      {
        id: "c3",
        author: "Dr. Ahmed Hassan",
        text: "Spot on analysis. Edge inference in rural agricultural settings with limited connectivity is the future.",
        createdAt: "2026-06-29 11:05",
        likes: 7
      }
    ],
    status: "published" as const,
    author: "Mahmoud Wehaiba"
  },
  {
    id: "clean-architecture-node-express",
    title: "Production Backend Architecture: Decoupling Domain Logic in Node.js & TypeScript",
    summary: "Key lessons from building high-concurrency learning platforms and healthcare cards with Express, JWT authentication, and MongoDB.",
    content: `When scaling web applications from quick prototypes to multi-role production systems, mixing database queries, business rules, and HTTP response handlers in route files quickly creates technical debt.

### Core Architectural Rules I Follow
1. **Domain-Driven Module Boundaries**: Group by domain feature (e.g. \`auth\`, \`courses\`, \`medical_cards\`), not by artifact type (\`controllers\`, \`models\`, \`views\`).
2. **Explicit Type Contracts**: Use strict TypeScript interfaces for request DTOs and internal service inputs. Never let untyped \`any\` leak into business logic.
3. **Centralized Error Middleware**: Catch domain exceptions at the top level and translate them to consistent JSON error responses with standard error codes.

\`\`\`ts
// Example cleanly decoupled service pattern
export async function createMedicalCard(dto: CreateCardDTO): Promise<MedicalCard> {
  validateCardPermissions(dto.role);
  const encryptedPayload = await encryptMedicalRecords(dto.records);
  return await MedicalCardRepository.save({ ...dto, records: encryptedPayload });
}
\`\`\`

Adopting these patterns early allowed the HealthMaster QR project to scale seamlessly across clinics, labs, and pharmacies with zero cross-tenant leaks.`,
    tags: ["Full-Stack", "Node.js", "TypeScript", "Backend"],
    date: "2026-05-10",
    readTime: "6 min read",
    likes: 18,
    comments: [],
    status: "published" as const,
    author: "Mahmoud Wehaiba"
  }
];

