import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { PERSONAL_INFO, PROJECTS_DATA, SKILL_CATEGORIES, TIMELINE_DATA, CV_VARIANTS, INITIAL_POSTS_DATA } from "./src/data/profileData";
import { Project, BlogPost, Comment } from "./src/types";
import { logger } from "./src/lib/logger";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // In-memory databases for dynamic projects and blog posts
  let dynamicProjects: Project[] = [...PROJECTS_DATA];
  let dynamicPosts: BlogPost[] = JSON.parse(JSON.stringify(INITIAL_POSTS_DATA));

  // Admin secret key (fail-closed: no env var => no admin access)
  const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || null;

  // Helper middleware to check admin authorization
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!ADMIN_PASSKEY) {
      res.status(503).json({ success: false, error: "Admin access is not configured." });
      return;
    }
    const passkey = req.headers['x-admin-passkey'] || req.body?.passkey;
    if (passkey === ADMIN_PASSKEY) {
      next();
    } else {
      res.status(401).json({ success: false, error: "Unauthorized: Invalid Admin Passkey" });
    }
  };

  // Initialize Gemini AI client lazily/safely
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      system: "JARVIS Core API Server",
      timestamp: new Date().toISOString(),
      owner: PERSONAL_INFO.name,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      projectCount: dynamicProjects.length,
      postCount: dynamicPosts.length
    });
  });

  // Admin Verification
  app.post("/api/admin/verify", (req, res) => {
    const { passkey } = req.body;
    if (passkey === ADMIN_PASSKEY) {
      res.json({ success: true, message: "Admin access granted" });
    } else {
      res.status(401).json({ success: false, error: "Invalid Admin Passkey" });
    }
  });

  // --- PROJECTS API ROUTES ---
  app.get("/api/projects", (req, res) => {
    res.json(dynamicProjects);
  });

  app.post("/api/projects", requireAdmin, (req, res) => {
    const newProject: Project = req.body.project;
    if (!newProject || !newProject.title || !newProject.shortDesc) {
      res.status(400).json({ success: false, error: "Missing required project fields" });
      return;
    }
    newProject.id = newProject.id || `proj_${Date.now()}`;
    dynamicProjects.unshift(newProject);
    res.json({ success: true, project: newProject, projects: dynamicProjects });
  });

  app.put("/api/projects/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const updatedData: Partial<Project> = req.body.project;
    const index = dynamicProjects.findIndex(p => p.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }
    dynamicProjects[index] = { ...dynamicProjects[index], ...updatedData };
    res.json({ success: true, project: dynamicProjects[index], projects: dynamicProjects });
  });

  app.delete("/api/projects/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    dynamicProjects = dynamicProjects.filter(p => p.id !== id);
    res.json({ success: true, projects: dynamicProjects });
  });

  // --- BLOG POSTS API ROUTES ---
  app.get("/api/posts", (req, res) => {
    const isAdmin = req.headers['x-admin-passkey'] === ADMIN_PASSKEY;
    if (isAdmin) {
      res.json(dynamicPosts);
    } else {
      // Visitors only see published posts
      res.json(dynamicPosts.filter(p => p.status === 'published'));
    }
  });

  app.post("/api/posts", requireAdmin, (req, res) => {
    const newPost: BlogPost = req.body.post;
    if (!newPost || !newPost.title || !newPost.content) {
      res.status(400).json({ success: false, error: "Missing required blog post fields" });
      return;
    }
    const createdPost: BlogPost = {
      id: newPost.id || `post_${Date.now()}`,
      title: newPost.title,
      summary: newPost.summary || '',
      content: newPost.content,
      tags: newPost.tags || [],
      date: newPost.date || new Date().toISOString().split('T')[0],
      readTime: newPost.readTime || `${Math.max(1, Math.ceil(newPost.content.length / 500))} min read`,
      likes: newPost.likes || 0,
      comments: newPost.comments || [],
      status: newPost.status || 'published',
      author: newPost.author || PERSONAL_INFO.name
    };
    dynamicPosts.unshift(createdPost);
    res.json({ success: true, post: createdPost, posts: dynamicPosts });
  });

  app.put("/api/posts/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const updatedData: Partial<BlogPost> = req.body.post;
    const index = dynamicPosts.findIndex(p => p.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: "Blog post not found" });
      return;
    }
    dynamicPosts[index] = { ...dynamicPosts[index], ...updatedData };
    res.json({ success: true, post: dynamicPosts[index], posts: dynamicPosts });
  });

  app.delete("/api/posts/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    dynamicPosts = dynamicPosts.filter(p => p.id !== id);
    res.json({ success: true, posts: dynamicPosts });
  });

  // Visitor Post Interactions: Like
  app.post("/api/posts/:id/like", (req, res) => {
    const { id } = req.params;
    const post = dynamicPosts.find(p => p.id === id);
    if (!post) {
      res.status(404).json({ success: false, error: "Post not found" });
      return;
    }
    post.likes += 1;
    res.json({ success: true, likes: post.likes });
  });

  // Visitor Post Interactions: Comment
  app.post("/api/posts/:id/comments", (req, res) => {
    const { id } = req.params;
    const { author, text } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ success: false, error: "Comment text is required" });
      return;
    }
    const post = dynamicPosts.find(p => p.id === id);
    if (!post) {
      res.status(404).json({ success: false, error: "Post not found" });
      return;
    }
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      author: author && author.trim() ? author.trim() : "Anonymous Tech Visitor",
      text: text.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      likes: 0
    };
    post.comments.push(newComment);
    res.json({ success: true, comment: newComment, comments: post.comments });
  });

  // Contact Form Dispatch API Route
  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        error: "Name, email, and message are required fields."
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email format."
      });
      return;
    }

    logger.info('CONTACT', `New message received from ${name} (${email})`, { subject: subject || 'No Subject' });

    res.json({
      success: true,
      message: "Message successfully dispatched to Mahmoud Wehaiba's terminal queue.",
      details: {
        timestamp: new Date().toISOString(),
        recipient: PERSONAL_INFO.email,
        sender: `${name} <${email}>`
      }
    });
  });

  // JARVIS AI Assistant Grounded Chat Endpoint
  app.post("/api/jarvis", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;

      if (!message || typeof message !== "string") {
        res.status(400).json({ error: "Message string is required." });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        res.json({
          reply: `JARVIS Offline Mode: Hello! I am operating in local fallback mode because the Gemini API key is currently not active. However, here is what I can tell you about Mahmoud Wehaiba: He holds a B.Sc. in Agricultural Engineering from Tanta University (2024), completed military service (2025-2026), and specializes in full-stack web development (React/Node/FastAPI/C#) and local AI agent engineering (Ollama/Qdrant/LangChain). Feel free to explore the interactive tabs!`
        });
        return;
      }

      const systemPrompt = `You are JARVIS, an advanced, highly intelligent AI assistant embedded directly inside Mahmoud Wehaiba's personal engineering portfolio website.

      YOUR KNOWLEDGE BASE REGARDING MAHMOUD WEHAIBA:
      - Full Name: ${PERSONAL_INFO.name}
      - Title: ${PERSONAL_INFO.title}
      - Contact Email: ${PERSONAL_INFO.email}
      - Location: ${PERSONAL_INFO.location}
      - Status: ${PERSONAL_INFO.statusText}
      - Bio: ${PERSONAL_INFO.bio}
      - Education: B.Sc. in Agricultural Engineering (Tanta University, Graduated June 2024)
      - Military Service: Completed Mandatory Military Service (March 2025 - March 2026)
      - Core Values: ${PERSONAL_INFO.coreValues.join(", ")}
      
      TECHNICAL SKILLS:
      ${SKILL_CATEGORIES.map(cat => `${cat.name}: ${cat.skills.map(s => `${s.name} (${s.level}, ${s.note || ''})`).join(", ")}`).join("\n")}

      PROJECTS:
      ${dynamicProjects.map(p => `- ${p.title} (${p.category}, Status: ${p.status}): ${p.shortDesc}. Stack: ${p.stack.join(", ")}. Key Lesson: ${p.keyLesson}`).join("\n")}

      ARTICLES & BLOG POSTS:
      ${dynamicPosts.map(post => `- [${post.date}] "${post.title}" (${post.status}): ${post.summary}. Tags: ${post.tags.join(", ")}`).join("\n")}

      CAREER TIMELINE & MILESTONES:
      ${TIMELINE_DATA.map(t => `- [${t.period}] ${t.title} (${t.role}): ${t.description}`).join("\n")}

      CV VARIATIONS AVAILABLE:
      ${CV_VARIANTS.map(cv => `- ${cv.title}: ${cv.summary}`).join("\n")}

      YOUR PERSONALITY & TONE:
      - Crisp, technical, helpful, courteous, confident, and professional.
      - Speak as Mahmoud's trusted tech lead AI assistant.
      - Answer questions accurately using ONLY Mahmoud's verified profile data above.
      - If asked about contact info, provide Mahmoud's email (${PERSONAL_INFO.email}) or point to the Contact Terminal.
      - Keep responses focused, elegant, and nicely formatted with bullet points when listing details.`;

      const contents = [];
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        for (const msg of conversationHistory.slice(-6)) {
          contents.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "JARVIS received your query, but produced an empty response. Please rephrase your prompt.";

      res.json({ reply: replyText });
    } catch (err: any) {
      logger.error('JARVIS', 'API processing error', err);
      res.status(500).json({
        error: "JARVIS processing encountered an anomaly.",
        details: err?.message || String(err)
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    logger.info('SERVER', `Portfolio server started`, { port: PORT, url: `http://localhost:${PORT}` });
  });
}

startServer();
