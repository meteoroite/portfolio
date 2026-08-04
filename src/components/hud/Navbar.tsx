import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Layers, 
  Milestone, 
  FolderGit2, 
  FileText, 
  Send, 
  Bot, 
  ShieldCheck, 
  X,
  BookOpen,
  Lock,
  Orbit,
  Globe,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { PERSONAL_INFO } from '../../data/profileData';
import { BRAND_ASSETS } from '../../data/brandAssets';
import { useLang } from '../../lib/language';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  recruiterMode: boolean;
  setRecruiterMode: (mode: boolean) => void;
  onOpenJarvis: () => void;
  onOpenGalaxyPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  recruiterMode,
  setRecruiterMode,
  onOpenJarvis,
  onOpenGalaxyPortal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const { t, toggleLang, isArabic } = useLang();

  // Secret admin access: press Ctrl+Shift+A
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setAdminUnlocked(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close sidebar on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const navItems = [
    { id: 'bio', label: t.navIdentity, icon: User },
    { id: 'capabilities', label: t.navCapabilities, icon: Layers },
    { id: 'timeline', label: t.navTimeline, icon: Milestone },
    { id: 'projects', label: t.navProjects, icon: FolderGit2 },
    { id: 'blog', label: t.navBlog, icon: BookOpen },
    { id: 'cv', label: t.navCV, icon: FileText },
    { id: 'contact', label: t.navContact, icon: Send },
    ...(adminUnlocked ? [{ id: 'admin', label: t.navAdmin, icon: Lock }] : []),
  ];

  return (
    <>
      {/* Floating Nexus Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 -translate-y-1/2 z-[60] group"
        animate={{ 
          left: isOpen ? 'min(280px, 75vw)' : '0px',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        whileHover={{ x: 4 }}
        aria-label="Toggle navigation"
      >
        <div className={`flex flex-col items-center justify-center gap-1 w-9 h-20 rounded-r-xl border border-l-0 transition-all duration-300 ${
          isOpen 
            ? 'bg-slate-900/95 border-slate-700 text-slate-400' 
            : 'bg-slate-900/90 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.35)]'
        } backdrop-blur-xl`}>
          {isOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <>
              <Menu className="w-4 h-4" />
              <span className="text-[8px] font-bold tracking-widest">{t.navMenuLabel}</span>
            </>
          )}
        </div>
      </motion.button>

      {/* Overlay backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[55] lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-[60] h-full w-[min(280px,75vw)] bg-[#050608]/98 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col font-mono overflow-y-auto"
            style={{ 
              boxShadow: '4px 0 40px rgba(6, 182, 212, 0.08), 0 0 80px rgba(0, 0, 0, 0.5)' 
            }}
          >
            {/* Brand Header */}
            <div className="p-5 border-b border-slate-800/60">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { setActiveTab('bio'); setIsOpen(false); }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-500/40 overflow-hidden flex items-center justify-center group-hover:border-cyan-400 transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                    {BRAND_ASSETS.systemIcon.navbarHome ? (
                      <img 
                        src={BRAND_ASSETS.systemIcon.navbarHome} 
                        alt="Logo" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="font-bold text-sm tracking-tighter text-cyan-400">MW</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm tracking-wide text-slate-100 group-hover:text-cyan-400 transition-colors truncate">
                      Mahmoud Wehaiba
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="truncate">{PERSONAL_INFO.statusText.split('&')[0]}</span>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-3 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-3 py-2">
                {t.navSection}
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left min-h-[44px] ${
                      isActive
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                        : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Action Controls */}
            <div className="p-3 border-t border-slate-800/60 space-y-2">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-3 py-2">
                {t.navControls}
              </div>

              {/* Language Toggle */}
              <button
                onClick={toggleLang}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 transition-all border border-transparent hover:border-slate-800 min-h-[44px]"
              >
                <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-medium">{isArabic ? 'English' : 'العربية'}</span>
              </button>

              {/* Galaxy Portal */}
              <button
                onClick={() => { onOpenGalaxyPortal(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cyan-400 hover:bg-cyan-950/40 transition-all border border-transparent hover:border-cyan-500/30 min-h-[44px]"
              >
                <Orbit className="w-4 h-4 animate-spin shrink-0" style={{ animationDuration: '8s' }} />
                <span className="font-medium">{t.navGalaxyMap}</span>
              </button>

              {/* Recruiter Mode */}
              <button
                onClick={() => setRecruiterMode(!recruiterMode)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all border min-h-[44px] ${
                  recruiterMode
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border-transparent hover:border-slate-800'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 shrink-0 ${recruiterMode ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="font-medium">{recruiterMode ? t.navRecruiterModeOn : t.navRecruiterMode}</span>
              </button>

              {/* JARVIS AI */}
              <button
                onClick={() => { onOpenJarvis(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] min-h-[44px]"
              >
                <Bot className="w-4 h-4 text-cyan-200 animate-pulse shrink-0" />
                <span>{t.navAskJarvis}</span>
              </button>
            </div>

            {/* Footer Status */}
            <div className="p-4 border-t border-slate-800/60">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>SYS: OPERATIONAL</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
