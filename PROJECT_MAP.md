# PROJECT MAP // Mahmoud Wehaiba Interactive Portfolio & Platform

## [TECH_STACK]
- **Framework**: React 19.2.8 + TypeScript 5.8 + Vite 6.4.3
- **Styling & Animation**: Tailwind CSS v4.3.3, Motion (Framer Motion) v12.43.0, Lucide React v1.28.0
- **Backend & API**: Express v4.22.2 (Port 3000, 0.0.0.0), Node.js ESM/CJS (esbuild v0.28.1 / tsx)
- **AI Integration**: `@google/genai` v2.15.0 (Server-side Gemini proxy `/api/jarvis`)
- **Package Manager**: npm (Bun compatible)
- **Date Verification**: 2026-08-03 (Verified via system shell)

## [BRAND_IDENTITY]
| Logo | Name | Asset | Components |
|------|------|-------|------------|
| Logo 1 | System Icon (Favicon) | `favicon.png` | `index.html`, `Navbar.tsx` Home, App Launcher |
| Logo 2 | JARVIS AI Eye | `logo.png` | `JARVISDrawer.tsx`, `EyeEngine.tsx`, `GalaxyPortalLanding.tsx`, Chat Avatars |
| Logo 3 | Official Branding Emblem | `slogan-logo.png` | `BioSection.tsx` Header, Social Cover, `App.tsx` Footer |

Central registry: `src/data/brandAssets.ts`

## [SYSTEM_FLOW]
1. **Landing & Galaxy Portal**: User arrives → Canvas galaxy animation → JARVIS Audio greeting → Select destination or "Enter Galaxy"
2. **JARVIS AI Eye Ambient**: Secret Observer Eye tracks cursor, blinks, sleeps on idle → Click for riddle challenge
3. **Mission Control / Main HUD**:
   - Section 1: **Identity & Mission (Bio & Vision)** — Brand Emblem header
   - Section 2: **Capabilities (Interactive Skills Constellation)**
   - Section 3: **Mission Log (Career Timeline & Milestones)**
   - Section 4: **Project Universe (Selected Works & Demos)**
   - Section 5: **Articles & Blog (Interactive Tech Articles, Likes, Comments, Search & Tags)**
   - Section 6: **Download Archive (Role-Targeted CVs: Developer, AI, AgTech)**
   - Section 7: **Contact Terminal (Interactive Email Dispatch & API backend)**
   - Section 8: **Admin Portal (Passkey-Protected Management of Projects & Blog Articles)**
4. **JARVIS AI Drawer**: Server-proxied Gemini API endpoint (`/api/jarvis`) grounded on verified knowledge base
5. **Recruiter Fast View**: Reduced motion, single-page scannable resume format

## [ARCHITECTURE]
```
src/
├── components/
│   ├── ambient/        # EyeEngine, BackgroundGrid, ParticleBackground, ObserverSecretEye
│   ├── ai/             # JARVISDrawer
│   ├── hud/            # Navbar, RecruiterBanner
│   ├── sections/       # Bio, Skills, Timeline, Projects, Blog, CV, Contact, Admin, GalaxyPortal
│   └── ui/             # TypewriterText, Planet3D
├── data/               # profileData.ts (verified knowledge base), brandAssets.ts (logo registry)
├── lib/                # logger.ts (async non-blocking logger)
├── types.ts            # Global TypeScript interfaces
├── App.tsx             # Main Layout Router & State Orchestration
└── main.tsx            # React root mount
server.ts               # Express server with Gemini proxy & API routes
```

## [DEPENDENCY_MATRIX]
| Package | Installed | Latest Stable | Status |
|---------|-----------|---------------|--------|
| react | 19.2.8 | 19.2.8 | ✅ Current |
| react-dom | 19.2.8 | 19.2.8 | ✅ Current |
| vite | 6.4.3 | 8.2.0 | ⏸️ Stay 6.x (supported) |
| tailwindcss | 4.3.3 | 4.3.3 | ✅ Current |
| @tailwindcss/vite | 4.3.3 | 4.3.3 | ✅ Current |
| motion | 12.43.0 | 12.43.0 | ✅ Current |
| @google/genai | 2.15.0 | 2.15.0 | ✅ Current |
| lucide-react | 1.28.0 | 1.28.0 | ✅ Current |
| esbuild | 0.28.1 | 0.28.1 | ✅ Current |
| express | 4.22.2 | 5.2.1 | ⏸️ Stay 4.x (supported) |

## [LOGGING]
- Async non-blocking logger via `src/lib/logger.ts`
- Uses `queueMicrotask()` for zero main-thread impact
- Levels: `debug`, `info`, `warn`, `error`
- Configurable via `LOG_LEVEL` env var (default: `info`)
- Server.ts migrated: CONTACT, JARVIS, SERVER tags

## [ORPHANS & PENDING]
- [x] Initial PROJECT_MAP.md and technical specification
- [x] Modular structure setup (types, data, server)
- [x] Eye Engine, Galaxy Portal, all 8 sections
- [x] JARVIS AI integration with Gemini
- [x] Contact Terminal API, Blog with comments/likes
- [x] Admin Dashboard with passkey auth
- [x] Brand Identity System — 3-logo architecture implemented
- [x] Dependency upgrade to latest stable versions (Aug 2026)
- [x] Async logger implementation and server.ts migration
- [x] lucide-react 0.x → 1.x migration (Github/Linkedin → GitBranch/Globe)
- [x] Broken image references fixed (.jpg → .png/.jpeg)
- [ ] Zone.Identifier metadata files in src/assets/images/ (WSL artifact, harmless)
- [ ] Vite 6.x → 8.x migration (future milestone)
- [ ] Express 4.x → 5.x migration (future milestone)
- [ ] Database persistence (currently in-memory)
- [ ] Testing framework setup
- [ ] Deployment pipeline / CI/CD
- [ ] PWA / Service Worker
