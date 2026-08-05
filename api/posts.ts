import type { VercelRequest, VercelResponse } from '@vercel/node';

const POSTS = [
  {
    id: "building-jarvis-local-llm",
    title: "Building JARVIS: Orchestrating Local LLMs with Ollama, Qdrant & FastAPI",
    summary: "How I designed a privacy-focused local AI workspace assistant with vector search RAG and sub-second execution latency.",
    content: "Local LLM execution has reached a tipping point. With model quantization (GGUF, Q4_K_M) and optimized inference engines like Ollama, developers can run capable 7B and 14B models directly on workstation hardware.\n\n### Why Local First?\nData privacy, deterministic latency, and zero token costs are critical for developer workspace tools.\n\n### Architecture Blueprint\n1. **Inference Layer**: Ollama serving Qwen2.5 / Llama3 models locally.\n2. **Vector Memory**: Qdrant vector database with \`bge-m3\` embeddings.\n3. **Execution Pipeline**: Async FastAPI server managing tool invocation and file parsing.\n\n### Key Learnings\n- Chunking strategy matters: overlapping recursive splitters produce dramatically better retrieval context.\n- Always decouple embedding generation from API response loops.",
    tags: ["AI", "Ollama", "Python", "FastAPI", "Vector DB"],
    date: "2026-07-15", readTime: "5 min read", likes: 24,
    comments: [
      { id: "c1", author: "Tarek Mansour", text: "Great breakdown! How did you handle context window degradation?", createdAt: "2026-07-16 14:20", likes: 3 },
      { id: "c2", author: "Elena Rostova", text: "The Qdrant + Ollama combination is brilliant for local RAG.", createdAt: "2026-07-18 09:12", likes: 5 }
    ],
    status: "published", author: "Mahmoud Wehaiba"
  },
  {
    id: "agtech-computer-vision-future",
    title: "Bridging Agricultural Engineering & Computer Vision: Smart Farming Automation",
    summary: "Reflections from my B.Sc. thesis at Tanta University on applying OpenCV, MediaPipe, and edge inference to precision agriculture.",
    content: "Agriculture is fundamentally an engineering domain of massive scale, biological variability, and spatial complexity.\n\n### Real-World Vision Pipelines in Agriculture\n- **Fruit & Crop Health Detection**: RGB-D cameras and YOLO models to detect early pest infestations.\n- **Automated Weed Discrimination**: Color-space segmentation and morphological contour analysis.\n- **HCI for Heavy Machinery**: Gesture tracking and eye movement detection for operators.\n\n### The Path Ahead\nCombining embedded edge hardware with low-latency vision algorithms for affordable smart farming tools.",
    tags: ["AgTech", "Computer Vision", "OpenCV", "Python"],
    date: "2026-06-28", readTime: "4 min read", likes: 31,
    comments: [
      { id: "c3", author: "Dr. Ahmed Hassan", text: "Spot on analysis. Edge inference in rural agricultural settings is the future.", createdAt: "2026-06-29 11:05", likes: 7 }
    ],
    status: "published", author: "Mahmoud Wehaiba"
  },
  {
    id: "clean-architecture-node-express",
    title: "Production Backend Architecture: Decoupling Domain Logic in Node.js & TypeScript",
    summary: "Key lessons from building high-concurrency learning platforms and healthcare cards with Express and MongoDB.",
    content: "When scaling web applications from quick prototypes to multi-role production systems, mixing database queries, business rules, and HTTP response handlers in route files creates technical debt.\n\n### Core Architectural Rules I Follow\n1. **Domain-Driven Module Boundaries**: Group by domain feature, not by artifact type.\n2. **Explicit Type Contracts**: Use strict TypeScript interfaces for request DTOs.\n3. **Centralized Error Middleware**: Catch domain exceptions and translate to consistent JSON error responses.\n\nAdopting these patterns allowed the HealthMaster QR project to scale seamlessly across clinics, labs, and pharmacies.",
    tags: ["Full-Stack", "Node.js", "TypeScript", "Backend"],
    date: "2026-05-10", readTime: "6 min read", likes: 18,
    comments: [],
    status: "published", author: "Mahmoud Wehaiba"
  }
];

function isAdmin(req: VercelRequest): boolean {
  const k = process.env.ADMIN_PASSKEY;
  if (!k) return false;
  const v = req.headers['x-admin-passkey'] || (req.body as Record<string, unknown>)?.passkey;
  return typeof v === 'string' && v === k;
}
function sanitize(v: unknown, max = 1000): string {
  if (typeof v !== 'string') return '';
  return v.replace(/<[^>]*>/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-passkey');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;

  // GET /api/posts
  if (req.method === 'GET') {
    const posts = isAdmin(req) ? POSTS : POSTS.filter(p => p.status === 'published');
    return res.status(200).json(posts);
  }

  // Admin: create/update/delete post (ephemeral)
  if (req.method === 'POST') {
    const np = body.post && typeof body.post === 'object' ? (body.post as Record<string, unknown>) : {};
    if (!np) return res.status(400).json({ success: false, error: 'Missing post data' });
    if (!sanitize(np.title) || !sanitize(np.content)) return res.status(400).json({ success: false, error: 'Missing required fields' });
    const c = { id: sanitize(np.id, 100) || `post_${Date.now()}`, title: sanitize(np.title, 200), summary: sanitize(np.summary, 500), content: sanitize(np.content, 10000), tags: (Array.isArray(np.tags) ? np.tags.map(t => sanitize(t, 40)).filter(Boolean) : []), date: sanitize(np.date, 20) || new Date().toISOString().split('T')[0], readTime: sanitize(np.readTime, 40) || '5 min read', likes: Number(np.likes) || 0, comments: Array.isArray(np.comments) ? np.comments : [], status: sanitize(np.status, 20) || 'published', author: sanitize(np.author, 100) || 'Mahmoud Wehaiba' };
    return res.status(200).json({ success: true, post: c, posts: isAdmin(req) ? POSTS : POSTS.filter(p => p.status === 'published') });
  }

  if (req.method === 'DELETE') {
    return res.status(200).json({ success: true, posts: isAdmin(req) ? POSTS : POSTS.filter(p => p.status === 'published') });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
