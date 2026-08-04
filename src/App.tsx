import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundGrid } from './components/ambient/BackgroundGrid';
import { ParticleBackground } from './components/ambient/ParticleBackground';
import { ObserverSecretEye } from './components/ambient/ObserverSecretEye';
import { Navbar } from './components/hud/Navbar';
import { RecruiterBanner } from './components/hud/RecruiterBanner';
import { GalaxyPortalLanding } from './components/sections/GalaxyPortalLanding';
import { BioSection } from './components/sections/BioSection';
import { SkillsConstellation } from './components/sections/SkillsConstellation';
import { TimelineSection } from './components/sections/TimelineSection';
import { ProjectUniverse } from './components/sections/ProjectUniverse';
import { GitHubReposSection } from './components/sections/GitHubReposSection';
import { CVArchiveSection } from './components/sections/CVArchiveSection';
import { ContactTerminal } from './components/sections/ContactTerminal';
import { BlogSection } from './components/sections/BlogSection';
import { AdminDashboard } from './components/sections/AdminDashboard';
import { JARVISDrawer } from './components/ai/JARVISDrawer';
import { LanguageProvider, useLang } from './lib/language';
import { PERSONAL_INFO } from './data/profileData';
import { BRAND_ASSETS } from './data/brandAssets';
import { ShieldCheck, Bot, Sparkles, Terminal, Mail, Heart } from 'lucide-react';

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}

function AppInner() {
  const [showGalaxyPortal, setShowGalaxyPortal] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('bio');
  const [recruiterMode, setRecruiterMode] = useState<boolean>(false);
  const [isJarvisOpen, setIsJarvisOpen] = useState<boolean>(false);
  const [systemReducedMotion, setSystemReducedMotion] = useState<boolean>(false);
  const { t } = useLang();

  useEffect(() => {
    // Detect OS prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const effectiveReducedMotion = systemReducedMotion || recruiterMode;

  // Smooth seamless navigation: always start each tab at the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative flex flex-col justify-between overflow-x-hidden">
      
      {/* Animated Galaxy Portal Landing View */}
      {showGalaxyPortal && (
        <GalaxyPortalLanding
          onEnterGalaxy={(targetTab) => {
            setShowGalaxyPortal(false);
            if (targetTab) setActiveTab(targetTab);
          }}
        />
      )}

      {/* Secret Observer Eye AI Guide — hidden during Galaxy Portal */}
      {!showGalaxyPortal && <ObserverSecretEye />}

      {/* Ambient Background Grid */}
      <BackgroundGrid reducedMotion={effectiveReducedMotion} />

      {/* Interactive Particle Canvas Background */}
      {!effectiveReducedMotion && <ParticleBackground />}

      {/* Recruiter / Fast View Notification Banner */}
      {recruiterMode && (
        <RecruiterBanner onDisableRecruiterMode={() => setRecruiterMode(false)} />
      )}

      {/* Primary Sticky HUD Navigation Bar — hidden during Galaxy Portal */}
      {!showGalaxyPortal && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          recruiterMode={recruiterMode}
          setRecruiterMode={setRecruiterMode}
          onOpenJarvis={() => setIsJarvisOpen(true)}
          onOpenGalaxyPortal={() => setShowGalaxyPortal(true)}
        />
      )}

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 w-full flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {activeTab === 'bio' && (
              <BioSection
                reducedMotion={effectiveReducedMotion}
                onNavigate={setActiveTab}
                onOpenJarvis={() => setIsJarvisOpen(true)}
              />
            )}

            {activeTab === 'capabilities' && <SkillsConstellation />}

            {activeTab === 'timeline' && <TimelineSection />}

            {activeTab === 'projects' && <ProjectUniverse />}

            {activeTab === 'github' && <GitHubReposSection />}

            {activeTab === 'blog' && <BlogSection />}

            {activeTab === 'cv' && <CVArchiveSection />}

            {activeTab === 'contact' && <ContactTerminal />}

            {activeTab === 'admin' && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 px-4 font-mono text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img 
              src={BRAND_ASSETS.brandEmblem.footer} 
              alt="Brand Emblem" 
              className="w-5 h-5 rounded object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{t.footerEngine}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span>{t.footerAgri}</span>
            <span>•</span>
            <span>{t.footerFullstack}</span>
            <span>•</span>
            <span>{t.footerMilitary}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsJarvisOpen(true)}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{t.footerAskJarvis}</span>
            </button>

            <span>|</span>

            <button
              onClick={() => setActiveTab('contact')}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t.footerContact}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* JARVIS AI Assistant Drawer */}
      <JARVISDrawer
        isOpen={isJarvisOpen}
        onClose={() => setIsJarvisOpen(false)}
        onNavigateToTab={setActiveTab}
      />

    </div>
  );
}
