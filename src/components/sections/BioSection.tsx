import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../../data/profileData';
import { BRAND_ASSETS } from '../../data/brandAssets';
import { useLang } from '../../lib/language';
import { EyeEngine } from '../ambient/EyeEngine';
import { TypewriterText } from '../ui/TypewriterText';
import { Planet3D } from '../ui/Planet3D';
import { 
  GraduationCap, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  GitBranch,
  Mail,
  Zap,
  Activity,
  Layers,
  Award,
  Orbit
} from 'lucide-react';

interface BioSectionProps {
  reducedMotion?: boolean;
  onNavigate: (tab: string) => void;
  onOpenJarvis: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.35 } 
  },
};

export const BioSection: React.FC<BioSectionProps> = ({
  reducedMotion,
  onNavigate,
  onOpenJarvis
}) => {
  const { t } = useLang();
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10" 
      id="section-bio"
    >
      
      {/* Hero Banner Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        
        {/* Ambient Glowing Background Effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Sector Planet Badge */}
        <div className="absolute top-4 right-6 hidden md:block opacity-80 pointer-events-none z-0">
          <Planet3D id="bio-header-planet" category="Full-Stack Engineering" size={80} isHovered={true} />
        </div>

        {/* Big Slogan Logo Masthead */}
        {BRAND_ASSETS.brandEmblem.bioHeader && (
          <motion.div variants={itemVariants} className="lg:col-span-12 flex justify-center pt-1">
            <img
              src={BRAND_ASSETS.brandEmblem.bioHeader}
              alt={t.bioBrandLogo}
              className="w-40 sm:w-48 lg:w-60 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-[0_0_45px_rgba(6,182,212,0.35)] hover:scale-105 hover:border-cyan-400/70 transition-all"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}

        {/* Left Column: Title, Staff Protocol Badges, Typing Subtitle & Mission */}
        <div className="lg:col-span-7 space-y-6 z-10">
          
          <div className="flex flex-wrap items-center gap-2">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.25)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-bold tracking-wider uppercase">{t.bioProtocol}</span>
            </motion.div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.bioActiveSystem}</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-sans">
              {PERSONAL_INFO.name}
            </h1>
            <div className="text-base sm:text-xl font-mono text-cyan-400 font-semibold min-h-[28px] flex items-center">
              <TypewriterText text={PERSONAL_INFO.title} speed={40} delay={300} />
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-2xl">
            {PERSONAL_INFO.bio}
          </p>

          {/* Key Milestone Quick Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
            <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5 hover:border-cyan-500/40 transition-colors">
              <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-slate-200 font-bold">{t.bioTanta}</div>
                <div className="text-slate-400 text-[11px]">{t.bioAgriEng}</div>
              </div>
            </div>

            <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5 hover:border-cyan-500/40 transition-colors">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-slate-200 font-bold">{t.bioMilitary}</div>
                <div className="text-slate-400 text-[11px]">{t.bioMilitaryDate}</div>
              </div>
            </div>

            <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5 hover:border-cyan-500/40 transition-colors">
              <Cpu className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-slate-200 font-bold">{t.bioFullstackAI}</div>
                <div className="text-slate-400 text-[11px]">{t.bioFullstackTech}</div>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('projects')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold px-5 py-3 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-105 min-h-[44px]"
            >
              <Zap className="w-4 h-4" />
              <span>{t.bioExploreProjects}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('capabilities')}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs px-4 py-3 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all min-h-[44px]"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{t.bioSkillsTechStack}</span>
            </button>

            <button
              onClick={onOpenJarvis}
              className="flex items-center justify-center gap-2 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 font-mono text-xs px-4 py-3 rounded-xl border border-cyan-500/50 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] min-h-[44px]"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>{t.bioAskJarvis}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Prominent Staff Architect Photo & Interactive AI Observer */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 bg-slate-950/80 rounded-2xl border border-cyan-500/30 relative space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          
          {/* Futuristic Profile Photo Card */}
          <div className="relative group w-full flex justify-center">
            
            {/* Outer Cyber Grid Frame */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-cyan-500/60 shadow-[0_0_35px_rgba(6,182,212,0.4)] z-10 transition-all duration-500 group-hover:border-cyan-400 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] group-hover:scale-[1.02]">
              <img
                src={PERSONAL_INFO.avatarUrl}
                alt={PERSONAL_INFO.name}
                className="w-full h-full object-cover object-top filter brightness-105 contrast-105 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Scanline Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-slate-950/80 pointer-events-none" />
              
              {/* Corner Tech Brackets */}
              <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
              <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

              {/* Verified Identity Badge Overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 border border-cyan-500/40 backdrop-blur-md rounded-xl p-2 flex items-center justify-between text-xs font-mono z-20">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-white font-bold text-[11px] truncate">Mahmoud Wehaiba</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                  {t.bioStaffArchitect}
                </span>
              </div>
            </div>

          </div>

          {/* Observer Sub-Panel */}
          <div className="pt-2 border-t border-slate-800/80 w-full flex flex-col items-center">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>{t.bioAiObserver}</span>
            </div>
            <EyeEngine reducedMotion={reducedMotion} onEyeClick={onOpenJarvis} />
          </div>
        </div>
      </motion.div>

      {/* Philosophy & Core Values Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Values Card */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 font-mono space-y-4 backdrop-blur-md shadow-lg"
        >
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.bioCoreEngValues}</span>
          </div>

          <ul className="space-y-3">
            {PERSONAL_INFO.coreValues.map((value, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors">
                <span className="text-cyan-400 font-bold">0{idx + 1}.</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Vision & Long-Term Roadmap Card */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 font-mono space-y-4 flex flex-col justify-between backdrop-blur-md shadow-lg"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>{t.bioVision}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Driven to engineer intelligent software platforms that combine high-performance backend architecture with practical AI tools. Focused on establishing multiple high-value products across e-learning, developer tools, and AgTech SaaS.
            </p>
          </div>

          {/* Social Profiles & Quick Contact Links */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <a 
                href={PERSONAL_INFO.github} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                <span>GitHub</span>
              </a>

              <a 
                href={PERSONAL_INFO.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>

            <button
              onClick={() => onNavigate('contact')}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{t.bioSendMessage}</span>
            </button>
          </div>
        </motion.div>

      </motion.div>

    </motion.div>
  );
};

