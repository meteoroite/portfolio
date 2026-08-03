import React, { useState } from 'react';
import { 
  User, 
  Layers, 
  Milestone, 
  FolderGit2, 
  FileText, 
  Send, 
  Bot, 
  ShieldCheck, 
  Menu, 
  X,
  BookOpen,
  Lock,
  Orbit
} from 'lucide-react';
import { PERSONAL_INFO } from '../../data/profileData';
import { BRAND_ASSETS } from '../../data/brandAssets';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'bio', label: 'Identity', icon: User },
    { id: 'capabilities', label: 'Capabilities', icon: Layers },
    { id: 'timeline', label: 'Mission Log', icon: Milestone },
    { id: 'projects', label: 'Project Universe', icon: FolderGit2 },
    { id: 'blog', label: 'Articles & Blog', icon: BookOpen },
    { id: 'cv', label: 'Download Archive', icon: FileText },
    { id: 'contact', label: 'Contact', icon: Send },
    { id: 'admin', label: 'Admin Portal', icon: Lock },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 text-slate-100 font-mono transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & System Status */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <button 
            onClick={() => setActiveTab('bio')}
            className="flex items-center gap-2 group text-left min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-cyan-500/40 overflow-hidden flex items-center justify-center group-hover:border-cyan-400 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0">
              {BRAND_ASSETS.systemIcon.navbarHome ? (
                <img 
                  src={BRAND_ASSETS.systemIcon.navbarHome} 
                  alt="Mahmoud Wehaiba Logo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="font-bold text-xs sm:text-sm tracking-tighter text-cyan-400">MW</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm tracking-wide text-slate-100 group-hover:text-cyan-400 transition-colors truncate">
                Mahmoud Wehaiba
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate max-w-[90px] xs:max-w-[130px] sm:max-w-xs">{PERSONAL_INFO.statusText.split('&')[0]}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
                id={`nav-item-${item.id}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Galaxy Portal, Recruiter Mode & JARVIS Orb */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Galaxy Portal Launch Button */}
          <button
            onClick={onOpenGalaxyPortal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all hover:scale-105"
            title="Return to Animated Galaxy Portal View"
          >
            <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="hidden sm:inline font-bold">Galaxy Map</span>
          </button>

          {/* Recruiter / Fast View Toggle Button */}
          <button
            onClick={() => setRecruiterMode(!recruiterMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              recruiterMode
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
            title="Toggle Recruiter Fast View (Cuts animations for immediate scannable reading)"
            id="recruiter-mode-toggle"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${recruiterMode ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline font-semibold">
              {recruiterMode ? 'Recruiter Mode ON' : 'Recruiter Mode'}
            </span>
            <span className="sm:hidden text-[10px]">Fast View</span>
          </button>

          {/* JARVIS AI Trigger */}
          <button
            onClick={onOpenJarvis}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:scale-105"
            title="Ask JARVIS AI Assistant about Mahmoud"
            id="jarvis-trigger-btn"
          >
            <Bot className="w-4 h-4 text-cyan-200 animate-pulse" />
            <span className="hidden sm:inline font-bold">Ask JARVIS AI</span>
            <span className="sm:hidden font-bold">JARVIS</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-4 space-y-3">
          
          {/* Mobile Quick System Control Actions */}
          <div className="grid grid-cols-3 gap-2 pb-2 border-b border-slate-800/80 font-mono text-xs">
            <button
              onClick={() => {
                onOpenGalaxyPortal();
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-center gap-1 active:scale-95 transition-transform min-h-[44px]"
            >
              <Orbit className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-[10px] font-bold">Galaxy Map</span>
            </button>

            <button
              onClick={() => {
                setRecruiterMode(!recruiterMode);
                setMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center gap-1 active:scale-95 transition-transform min-h-[44px] ${
                recruiterMode 
                  ? 'bg-emerald-950 border-emerald-500/60 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${recruiterMode ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-[10px] font-bold">{recruiterMode ? 'Fast View ON' : 'Fast View'}</span>
            </button>

            <button
              onClick={() => {
                onOpenJarvis();
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-center gap-1 active:scale-95 transition-transform min-h-[44px] font-bold"
            >
              <Bot className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span className="text-[10px]">Ask JARVIS</span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-colors text-left min-h-[44px] ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-900 active:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      )}
    </header>
  );
};
