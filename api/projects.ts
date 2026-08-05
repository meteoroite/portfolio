import type { VercelRequest, VercelResponse } from '@vercel/node';

const PROJECTS = [
  {
    id: "course-platform", title: "Tornado E-Learning Platform", category: "Full-Stack",
    shortDesc: "High-concurrency online learning platform with real-time course rooms, authentication, and dockerized micro-services.",
    fullDesc: "Comprehensive online learning ecosystem supporting interactive video courses, real-time WebSocket notifications, JWT security, and structured progress tracking.",
    stack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Socket.IO", "Docker", "Tailwind CSS"],
    status: "Active", keyLesson: "Large-scale e-learning platforms thrive when backend domain modules are strictly separated from presentation logic.",
    featured: true, role: "Full-Stack Engineer & Architect",
    metrics: ["Real-Time WebSocket Sync", "Dockerized Container Stack", "JWT RBAC Security"]
  },
  {
    id: "jarvis-assistant", title: "JARVIS Local AI Workspace Assistant", category: "AI",
    shortDesc: "Autonomous local AI engine for developer productivity, task orchestration, and context-aware RAG search.",
    fullDesc: "Local-first AI assistant built for desktop automation, code parsing, and context memory. Leverages local LLMs via Ollama for complete data privacy.",
    stack: ["Python", "FastAPI", "Ollama", "Qdrant Vector DB", "LangChain", "Docker", "REST APIs"],
    status: "Active", keyLesson: "Build a rock-solid, testable execution core before layering complex agent memory or multi-modal tools.",
    featured: true, role: "Sole AI Architect & Developer",
    metrics: ["100% Local Privacy", "Sub-second RAG Vector Retrieval", "Async Task Engine"],
    repoUrl: "https://github.com/meteoroite/Jarvis2"
  },
  {
    id: "healthmaster", title: "HealthMaster Digital Medical Card", category: "Full-Stack",
    shortDesc: "Unified medical card ecosystem centralizing patient records via secure QR codes across clinics, labs, and pharmacies.",
    fullDesc: "Centralized healthcare card system that allows doctors, labs, and pharmacies to instantly query and upload encrypted patient health history using a quick QR scan.",
    stack: ["Node.js", "Express", "React", "MongoDB", "QR Engine", "JWT Auth", "REST API"],
    status: "Completed", keyLesson: "Designing domain-driven RBAC early prevents massive data refactoring when scaling to multiple user personas.",
    featured: true, role: "Backend & Systems Lead",
    metrics: ["Multi-Role Clinic Portals", "Instant QR Scan Decryption", "Zero Data Leaks"]
  },
  {
    id: "ai-agent-factory", title: "AI Agent Factory Engine", category: "AI",
    shortDesc: "Orchestration framework for dynamically instantiating, testing, and deploying specialized LLM agents.",
    fullDesc: "Modular platform enabling the creation of single-purpose and multi-agent teams with customizable system prompts, tool bindings, and vector memory instances.",
    stack: ["Python", "CrewAI", "LangChain", "FastAPI", "Ollama", "Docker"],
    status: "Paused", keyLesson: "Reusable abstractions and standard tool definitions are essential when scaling from 1 agent to 100.",
    featured: true, role: "AI Lead",
    metrics: ["Dynamic Tool Binding", "Multi-Agent Teams"]
  },
  {
    id: "dodo-mask", title: "Dodo Mask Client Web Application", category: "Client Work",
    shortDesc: "Production client application built and delivered as sole developer for real-world business operation.",
    fullDesc: "Custom web application engineered for client presentation, product showcase, and direct customer interactions with custom branding and swift page load optimizations.",
    stack: ["JavaScript (ES6+)", "HTML5", "CSS3 / Tailwind", "Vercel Pipeline"],
    status: "Completed", keyLesson: "Delivering software for real clients requires balancing technical elegance with hard business deadlines.",
    demoUrl: "https://dodo-mask.vercel.app/", featured: true, role: "Sole Developer & Consultant",
    metrics: ["100% Client Satisfaction", "Lighthouse 98 Performance Score"]
  },
  {
    id: "computer-vision-input", title: "Hand Gesture Keyboard & Eye Mouse", category: "Computer Vision",
    shortDesc: "Human-Computer Interaction (HCI) software mapping facial eye-tracking and hand gestures to OS input controls.",
    fullDesc: "Accessible HCI solutions utilizing OpenCV and MediaPipe to convert real-time camera feeds into precise mouse cursor movements and gesture-triggered virtual key strokes.",
    stack: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI", "NumPy"],
    status: "Completed", keyLesson: "Real-time computer vision requires aggressive frame-buffering and noise smoothing for usable UX.",
    featured: false, role: "CV Researcher & Developer",
    metrics: ["30 FPS Camera Pipeline", "Sub-50ms Input Latency"]
  },
  {
    id: "tornado-social", title: "Tornado Social Media Hub", category: "Full-Stack",
    shortDesc: "Pinterest-inspired visual discovery and social platform featuring Google OAuth and media storage.",
    fullDesc: "Mahmoud's first full-stack milestone project implementing end-to-end OAuth authentication, grid image rendering, comment threads, and user saved collections.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Google OAuth", "Tailwind CSS"],
    status: "Completed", keyLesson: "Completing a full-stack project end-to-end creates foundational confidence across authentication & databases.",
    featured: false, role: "Full-Stack Developer",
    metrics: ["Google OAuth 2.0", "Masonry Image Layout"]
  },
  {
    id: "holy-quran-app", title: "Holy Quran Media Reader & Audio Player", category: "Client Work",
    shortDesc: "Web application for reading recitations and listening to high-quality audio streams of the Holy Quran.",
    fullDesc: "Mobile-responsive web experience built with accessibility, low-latency audio buffering, dark/light themes, and chapter bookmarking.",
    stack: ["React", "JavaScript", "HTML5 Audio API", "Tailwind CSS"],
    status: "Completed", demoUrl: "https://holy-quran-pi.vercel.app",
    keyLesson: "Media-rich applications require robust state synchronization across page switches and audio buffers.",
    featured: false, role: "Sole Developer",
    metrics: ["Responsive Mobile Audio UX", "PWA Ready"],
    repoUrl: "https://github.com/meteoroite/holy-quran"
  }
];

function isAdmin(req: VercelRequest): boolean {
  const k = process.env.ADMIN_PASSKEY;
  if (!k) return false;
  const v = req.headers['x-admin-passkey'] || (req.body as Record<string, unknown>)?.passkey;
  return typeof v === 'string' && v === k;
}
function sanitize(v: unknown, max = 500): string {
  if (typeof v !== 'string') return '';
  return v.replace(/<[^>]*>/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && ['https://mahmoud-wehaiba-portfolio.vercel.app', 'http://localhost:5173', 'http://localhost:4173'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-passkey');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') return res.status(200).json(PROJECTS);

  if (!process.env.ADMIN_PASSKEY) return res.status(503).json({ success: false, error: 'Admin access is not configured.' });
  if (!isAdmin(req)) return res.status(401).json({ success: false, error: 'Unauthorized' });

  if (req.method === 'POST') {
    const raw = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
    const p = raw.project && typeof raw.project === 'object' ? (raw.project as Record<string, unknown>) : {};
    if (!sanitize(p.title) || !sanitize(p.shortDesc)) return res.status(400).json({ success: false, error: 'Missing required fields' });
    p.id = sanitize(p.id, 100) || `proj_${Date.now()}`;
    return res.status(200).json({ success: true, project: p });
  }
  if (req.method === 'PUT') return res.status(200).json({ success: true, message: 'Project updated (ephemeral)' });
  if (req.method === 'DELETE') return res.status(200).json({ success: true, message: 'Project deleted (ephemeral)' });
  return res.status(405).json({ error: 'Method not allowed' });
}
