import type { VercelRequest, VercelResponse } from '@vercel/node';

const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(req: VercelRequest): boolean {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || e.resetAt <= now) { hits.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  e.count += 1;
  return e.count <= 15;
}
function sanitize(v: unknown, max = 2000): string {
  if (typeof v !== 'string') return '';
  return v.replace(/<[^>]*>/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

const SYSTEM_PROMPT = `You are JARVIS, an advanced AI assistant embedded inside Mahmoud Wehaiba's portfolio.

KNOWLEDGE BASE:
- Name: Mahmoud Wehaiba
- Title: Agricultural Engineer // Full-Stack & AI Systems Developer
- Email: mahmoudwheba22@gmail.com
- Location: Egypt (Remote / Global)
- Status: OPEN FOR FULL-TIME ROLES & HIGH-IMPACT FREELANCE / PRODUCT CONSULTING
- Bio: Agricultural Engineering graduate from Tanta University (2024) with a strong self-taught transition into software engineering and AI systems development. Specializes in building production-oriented full-stack web applications, async backend microservices, and orchestrating local/cloud LLM agents.
- Education: B.Sc. Agricultural Engineering (Tanta University, June 2024)
- Military Service: March 2025 - March 2026
- Core Values: Craftsmanship & Architectural Rigor, Curiosity & Continuous Systems Learning, Simplicity & Pragmatic Engineering First, Independence & Full-Project Ownership

SKILLS:
Core Languages: JavaScript ES6+ (Expert, 8+ yrs), TypeScript (Advanced, 4+ yrs), Python (Advanced, 5+ yrs), C# (Proficient, 2+ yrs), SQL (Proficient, 3+ yrs)
Backend: Node.js/Express (Expert, 5+ yrs), FastAPI (Advanced, 3+ yrs), ASP.NET Core (Proficient, 2+ yrs), WebSockets/Socket.IO (Advanced, 3+ yrs), REST API Design (Expert, 6+ yrs)
AI: Ollama/Local LLMs (Expert, 2+ yrs), RAG & Vector Search (Advanced, 2+ yrs), LangChain & CrewAI (Advanced, 2+ yrs), Prompt Engineering (Expert, 3+ yrs), Gemini API (Advanced, 2+ yrs)
Frontend: React 18/19 (Expert, 6+ yrs), Next.js (Advanced, 3+ yrs), Tailwind CSS (Expert, 5+ yrs), React Native/Expo (Proficient, 2+ yrs)
DevOps: MongoDB (Advanced, 5+ yrs), PostgreSQL (Proficient, 2+ yrs), Docker (Advanced, 3+ yrs), Git & Linux/WSL (Expert, 8+ yrs)

PROJECTS:
- Tornado E-Learning Platform (Full-Stack): High-concurrency online learning platform with real-time course rooms, authentication, and dockerized micro-services. Stack: React, TypeScript, Node.js, Express, MongoDB, Socket.IO, Docker. Role: Full-Stack Engineer & Architect. Status: Active.
- JARVIS Local AI Workspace Assistant (AI): Autonomous local AI engine for developer productivity, task orchestration, and context-aware RAG search. Stack: Python, FastAPI, Ollama, Qdrant Vector DB, LangChain, Docker. Role: Sole AI Architect & Developer. Status: Active.
- HealthMaster Digital Medical Card (Full-Stack): Unified medical card ecosystem centralizing patient records via secure QR codes. Stack: Node.js, Express, React, MongoDB, QR Engine, JWT Auth. Role: Backend & Systems Lead. Status: Completed.
- AI Agent Factory Engine (AI): Orchestration framework for dynamically instantiating, testing, and deploying specialized LLM agents. Stack: Python, CrewAI, LangChain, FastAPI, Ollama, Docker. Role: AI Lead. Status: Paused.
- Dodo Mask Client Web Application (Client Work): Production client application built as sole developer. Stack: JavaScript, HTML5, CSS3/Tailwind, Vercel. Role: Sole Developer & Consultant. Status: Completed. Demo: https://dodo-mask.vercel.app/
- Hand Gesture Keyboard & Eye Mouse (Computer Vision): HCI software mapping facial eye-tracking and hand gestures to OS input controls. Stack: Python, OpenCV, MediaPipe, PyAutoGUI, NumPy. Role: CV Researcher & Developer. Status: Completed.
- Tornado Social Media Hub (Full-Stack): Pinterest-inspired visual discovery and social platform. Stack: React, Node.js, Express, MongoDB, Google OAuth, Tailwind CSS. Role: Full-Stack Developer. Status: Completed.
- Holy Quran Media Reader & Audio Player (Client Work): Web application for reading recitations and listening to audio. Stack: React, JavaScript, HTML5 Audio API, Tailwind CSS. Role: Sole Developer. Status: Completed. Demo: https://holy-quran-pi.vercel.app

CV VARIANTS:
- Full-Stack & AI Systems Engineer
- Backend & Systems Engineer
- Agricultural Engineering & AgTech Innovator

TONE: Crisp, technical, professional. Answer using ONLY the verified data above. Be concise (2-3 sentences max). If asked about something not in the knowledge base, politely say you only have information about Mahmoud's verified profile.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!rateLimited(req)) return res.status(429).json({ reply: 'JARVIS is receiving too many transmissions. Please wait a moment and try again.' });

  try {
    const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
    const message = sanitize(body.message, 2000);
    const conversationHistory = Array.isArray(body.conversationHistory) ? body.conversationHistory : [];

    if (!message) return res.status(400).json({ error: 'Message string is required.' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        reply: `JARVIS Offline Mode: Hello! I am operating in fallback mode because the Gemini API key is not configured. Mahmoud Wehaiba holds a B.Sc. in Agricultural Engineering from Tanta University (2024), completed military service (2025-2026), and specializes in full-stack web development (React/Node/FastAPI/C#) and local AI agent engineering (Ollama/Qdrant/LangChain). Feel free to explore the interactive tabs!`
      });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    if (conversationHistory.length > 0) {
      for (const msg of conversationHistory.slice(-6)) {
        contents.push({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] });
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: { systemInstruction: SYSTEM_PROMPT, temperature: 0.7 }
    });

    const replyText = response.text || 'JARVIS received your query but produced an empty response.';
    return res.status(200).json({ reply: replyText });
  } catch (err: any) {
    console.error('[JARVIS ERROR]', err?.message || err);
    return res.status(200).json({
      reply: `I apologize — JARVIS encountered a processing issue (${err?.message || 'unknown error'}). Please try again or explore the portfolio sections directly.`
    });
  }
}
