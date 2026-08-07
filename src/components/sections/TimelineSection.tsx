import React from 'react';
import { motion } from 'motion/react';
import { TIMELINE_DATA } from '../../data/profileData';
import { Planet3D } from '../ui/Planet3D';
import { useLang } from '../../lib/language';
import { useTheme } from '../../lib/theme';
import { PlantGrowTransition, VineWeave } from '../ui/PlantGrowTransition';
import { Leaf } from 'lucide-react';
import { 
  Milestone, 
  GraduationCap, 
  ShieldCheck, 
  Rocket, 
  Sparkles,
  CheckCircle2,
  Calendar,
  Orbit
} from 'lucide-react';

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
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.35 } 
  },
};

export const TimelineSection: React.FC = () => {
  const { t } = useLang();
  const { theme } = useTheme();
  const isAgri = theme === 'agriculture';
  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'education': return GraduationCap;
      case 'military': return ShieldCheck;
      case 'achievement': return Sparkles;
      case 'career': return Rocket;
      default: return Milestone;
    }
  };

  const getMilestoneBadge = (type: string) => {
    switch (type) {
      case 'education': return 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
      case 'military': return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'achievement': return 'bg-blue-950 text-blue-300 border-blue-500/40';
      case 'career': return 'bg-purple-950 text-purple-300 border-purple-500/40';
      default: return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8" 
      id="section-timeline"
    >
      
      {/* Header */}
      <motion.div variants={itemVariants} className="bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-2 shadow-[0_0_40px_rgba(6,182,212,0.1)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2">
            <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>{t.timelineCosmic}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.timelineTitle}
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-sans mt-1">
            {t.timelineDesc}
          </p>
        </div>

        <div className="shrink-0 hidden md:block">
          <Planet3D id="timeline-planet" category="AgTech" size={70} isHovered={true} />
        </div>
      </motion.div>

      {/* Timeline Steps — the spine becomes a growing vine in agriculture mode */}
      <div className={`relative border-l-2 ${isAgri ? 'border-emerald-500/40' : 'border-cyan-500/30'} ml-6 sm:ml-8 space-y-10 pl-6 sm:pl-10 my-6`}>
        <VineWeave
          d="M0,0 C 18,120 8,260 14,420 C 20,600 4,760 12,960"
          className={`absolute left-[-29px] top-0 h-full w-6 ${isAgri ? 'opacity-70' : 'hidden'}`}
        />
        {TIMELINE_DATA.map((item, idx) => {
          const IconComponent = getMilestoneIcon(item.type);
          return (
            <PlantGrowTransition
              key={idx}
              className={isAgri ? 'block' : 'contents'}
              leaves={
                isAgri
                  ? [
                      { style: { top: '0.5rem', right: '-0.25rem' }, size: 7 },
                      { style: { top: '1.4rem', right: '1.6rem' }, size: 5, colorClass: 'bg-emerald-400' },
                    ]
                  : undefined
              }
            >
            <motion.div variants={itemVariants} className="relative group">
              
              {/* Node Bullet Icon — leaf sprout in agriculture mode */}
              <div className={`absolute -left-[33px] sm:-left-[49px] top-1.5 w-10 h-10 rounded-full bg-slate-950 border-2 ${isAgri ? 'border-emerald-400 text-emerald-400' : 'border-cyan-400 text-cyan-400'} flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)] group-hover:scale-110 transition-transform z-10`}>
                {isAgri ? <Leaf className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
              </div>

              {/* Milestone Card */}
              <div className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 backdrop-blur-md space-y-4 transition-all hover:shadow-[0_8px_25px_rgba(6,182,212,0.12)]">
                
                {/* Header Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded border font-semibold ${getMilestoneBadge(item.type)}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {item.period}
                    </span>
                  </div>

                  {item.organization && (
                    <span className="text-xs font-semibold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      {item.organization}
                    </span>
                  )}
                </div>

                {/* Milestone Title */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400 mt-0.5">
                    Role: {item.role}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  {item.description}
                </p>

                {/* Highlights List */}
                {item.highlights.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                      {t.timelineAccomplishments}
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                      {item.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2 bg-slate-950/80 p-2 rounded border border-slate-850">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

            </motion.div>
            </PlantGrowTransition>
          );
        })}
      </div>

    </motion.div>
  );
};
