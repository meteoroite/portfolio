<div align="center">

# Mahmoud Wehaiba — Interactive Portfolio & AI Platform

**Full-Stack & AI Systems Engineer | Agricultural Engineer | Computer Vision**

[![Portfolio](https://img.shields.io/badge/🚀_Live_Demo-metoroite.github.io-06b6d4?style=for-the-badge&logo=vercel)](https://github.com/meteoroite/portfolio)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0a66c2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/mahmoud-wehaiba-628a42221/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/meteoroite)

</div>

---

## 🌌 Overview

A cinematic, interactive portfolio platform featuring a **Galaxy Portal landing experience**, an **AI-powered JARVIS assistant** grounded on verified career data, an **ambient Eye Engine** with cursor tracking, and **8 mission-ready sections** — all built with React, TypeScript, and the Gemini API.

## ✨ Key Features

### 🪐 Galaxy Portal Landing
- Canvas-rendered spiral galaxy animation with 350+ procedural stars
- Hyper-warp transition effect with confetti and speech synthesis
- Quick-launch celestial destination grid

### 👁️ JARVIS AI Eye Engine
- Real-time cursor/touch tracking pupil animation
- Random blink cycles, idle sleep detection
- JARVIS AI Eye logo embedded in pupil core

### 🤖 JARVIS AI Assistant
- Server-side Gemini API proxy (`/api/jarvis`)
- Grounded strictly on verified knowledge base (skills, projects, timeline)
- Conversation history support with quick prompt suggestions

### 🔐 Observer Secret Eye
- Floating ambient riddle challenge game
- 3 cosmic riddles with progressive unlock mechanic
- Confetti rewards and achievement archive

### 📋 8 Interactive Sections
| Section | Description |
|---------|-------------|
| **Identity & Mission** | Bio, education, brand emblem, social links |
| **Capabilities** | Interactive skills constellation with experience levels |
| **Mission Log** | Career timeline from 2016 to present |
| **Project Universe** | 8 detailed project cards with case study modals |
| **Articles & Blog** | Tech articles with likes, comments, and tags |
| **Download Archive** | 3 role-targeted CV variants (Full-Stack, Backend, AgTech) |
| **Contact Terminal** | Interactive email dispatch with API backend |
| **Admin Portal** | Passkey-protected management dashboard |

### 🎯 Recruiter Fast View
- One-click toggle for reduced-motion, scannable resume format
- Respects `prefers-reduced-motion` OS setting

## 🏗️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React + TypeScript | 19.2.8 |
| **Build Tool** | Vite | 6.4.3 |
| **Styling** | Tailwind CSS | 4.3.3 |
| **Animation** | Motion (Framer Motion) | 12.43.0 |
| **Icons** | Lucide React | 1.28.0 |
| **Backend** | Express | 4.22.2 |
| **AI** | Google Gemini (`@google/genai`) | 2.15.0 |
| **Bundler** | esbuild | 0.28.1 |
| **Runtime** | Node.js | 24.x |

## 📁 Architecture

```
portfolio/
├── public/
│   ├── favicon.png                    # System Icon (Logo 1)
│   └── images/
│       ├── logo.png                   # JARVIS AI Eye (Logo 2)
│       ├── slogan-logo.png            # Official Brand Emblem (Logo 3)
│       └── profile.jpeg               # Profile Photo
├── src/
│   ├── components/
│   │   ├── ambient/                   # EyeEngine, BackgroundGrid, ParticleBackground, ObserverSecretEye
│   │   ├── ai/                        # JARVISDrawer
│   │   ├── hud/                       # Navbar, RecruiterBanner
│   │   ├── sections/                  # Bio, Skills, Timeline, Projects, Blog, CV, Contact, Admin, GalaxyPortal
│   │   └── ui/                        # TypewriterText, Planet3D
│   ├── data/
│   │   ├── brandAssets.ts             # 3-logo brand registry
│   │   └── profileData.ts             # Verified knowledge base
│   ├── lib/
│   │   └── logger.ts                  # Async non-blocking logger
│   ├── types.ts                       # TypeScript interfaces
│   ├── App.tsx                        # Main layout router
│   └── main.tsx                       # React root mount
├── server.ts                          # Express server + Gemini proxy
└── PROJECT_MAP.md                     # Full technical documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 24.x)
- **npm** or **Bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/meteoroite/portfolio.git
cd portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No | Google Gemini API key for JARVIS AI |
| `ADMIN_PASSKEY` | No | Admin portal access (default: `admin123`) |
| `LOG_LEVEL` | No | Logging level: `debug`, `info`, `warn`, `error` |

### Development

```bash
npm run dev
# Server runs at http://localhost:3000
```

### Production Build

```bash
npm run build    # Builds frontend + bundles server
npm run start    # Runs production server
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build (Vite + esbuild) |
| `npm run start` | Run production server |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type checking |
| `npm run clean` | Remove dist/ and generated files |

## 🎨 Brand Identity

| Logo | Name | Used In |
|------|------|---------|
| Logo 1 | System Icon | Favicon, Navbar Home, App Launcher |
| Logo 2 | JARVIS AI Eye | AI Drawer, Eye Engine, Galaxy Portal, Chat Avatars |
| Logo 3 | Official Brand Emblem | Bio Header, Footer, Social Covers |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | System health check |
| `POST` | `/api/jarvis` | JARVIS AI chat (Gemini proxy) |
| `POST` | `/api/contact` | Contact form dispatch |
| `GET` | `/api/projects` | List all projects |
| `POST` | `/api/projects` | Create project (admin) |
| `PUT` | `/api/projects/:id` | Update project (admin) |
| `DELETE` | `/api/projects/:id` | Delete project (admin) |
| `GET` | `/api/posts` | List blog posts |
| `POST` | `/api/posts` | Create blog post (admin) |
| `POST` | `/api/posts/:id/like` | Like a post |
| `POST` | `/api/posts/:id/comments` | Add comment to post |
| `POST` | `/api/admin/verify` | Verify admin passkey |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with 🧠 by [Mahmoud Wehaiba](https://github.com/meteoroite)**

*B.Sc. Agricultural Engineering (Tanta '24) • Full-Stack & AI Systems Developer*

</div>
