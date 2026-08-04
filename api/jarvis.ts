import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { PERSONAL_INFO, PROJECTS_DATA, SKILL_CATEGORIES, TIMELINE_DATA, CV_VARIANTS, INITIAL_POSTS_DATA } from '../src/data/profileData';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        reply: `JARVIS Offline Mode: Hello! I am operating in fallback mode because the Gemini API key is not configured. Here is what I can tell you about Mahmoud Wehaiba: He holds a B.Sc. in Agricultural Engineering from Tanta University (2024), completed military service (2025-2026), and specializes in full-stack web development (React/Node/FastAPI/C#) and local AI agent engineering (Ollama/Qdrant/LangChain). Feel free to explore the interactive tabs!`
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are JARVIS, an advanced AI assistant embedded inside Mahmoud Wehaiba's portfolio.

KNOWLEDGE BASE:
- Name: ${PERSONAL_INFO.name}
- Title: ${PERSONAL_INFO.title}
- Email: ${PERSONAL_INFO.email}
- Location: ${PERSONAL_INFO.location}
- Status: ${PERSONAL_INFO.statusText}
- Bio: ${PERSONAL_INFO.bio}
- Education: B.Sc. Agricultural Engineering (Tanta University, June 2024)
- Military Service: March 2025 - March 2026
- Core Values: ${PERSONAL_INFO.coreValues.join(", ")}

SKILLS:
${SKILL_CATEGORIES.map(cat => `${cat.name}: ${cat.skills.map(s => `${s.name} (${s.level})`).join(", ")}`).join("\n")}

PROJECTS:
${PROJECTS_DATA.map(p => `- ${p.title} (${p.category}): ${p.shortDesc}. Stack: ${p.stack.join(", ")}`).join("\n")}

ARTICLES:
${INITIAL_POSTS_DATA.map(post => `- "${post.title}": ${post.summary}`).join("\n")}

TIMELINE:
${TIMELINE_DATA.map(t => `- [${t.period}] ${t.title}: ${t.description}`).join("\n")}

CV VARIANTS:
${CV_VARIANTS.map(cv => `- ${cv.title}: ${cv.summary}`).join("\n")}

TONE: Crisp, technical, professional. Answer using ONLY the verified data above.`;

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      for (const msg of conversationHistory.slice(-6)) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const replyText = response.text || 'JARVIS received your query but produced an empty response.';

    return res.status(200).json({ reply: replyText });
  } catch (err: any) {
    console.error('[JARVIS ERROR]', err?.message || err);
    return res.status(500).json({
      error: 'JARVIS processing encountered an anomaly.',
      details: err?.message || String(err)
    });
  }
}
