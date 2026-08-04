import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SKILL_CATEGORIES } from '../../data/profileData';
import { SkillCategory } from '../../types';
import { Planet3D } from '../ui/Planet3D';
import { useLang } from '../../lib/language';
import { 
  Code2, 
  Server, 
  Cpu, 
  Layout, 
  Database, 
  Sparkles, 
  Layers,
  Search,
  CheckCircle2,
  Orbit,
  Zap,
  Star
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 } 
  },
};

export const SkillsConstellation: React.FC = () => {
  const { t } = useLang();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return Code2;
      case 'Server': return Server;
      case 'Cpu': return Cpu;
      case 'Layout': return Layout;
      case 'Database': return Database;
      default: return Layers;
    }
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-cyan-950 text-cyan-300 border-cyan-500/50';
      case 'Advanced': return 'bg-emerald-950 text-emerald-300 border-emerald-500/50';
      case 'Proficient': return 'bg-blue-950 text-blue-300 border-blue-500/50';
      default: return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  const filteredCategories = SKILL_CATEGORIES.filter(cat => {
    if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return cat.skills.some(s => s.name.toLowerCase().includes(q) || (s.note && s.note.toLowerCase().includes(q)));
    }
    return true;
  });

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8" 
      id="section-capabilities"
    >
      
      {/* Header Info with Celestial Planet Element */}
      <motion.div variants={itemVariants} className="bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-4 shadow-[0_0_40px_rgba(6,182,212,0.1)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="hidden sm:block shrink-0 pt-1">
              <Planet3D id="skills-constellation-planet" category="Computer Vision" size={65} isHovered={true} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2">
                <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span>{t.skillsCelestial}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t.skillsTitle}
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl font-sans">
                {t.skillsDescription}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative shrink-0 w-full md:w-64 font-mono">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.skillsSearchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex overflow-x-auto max-w-full pb-1 gap-2 pt-2 border-t border-slate-800/80 font-mono text-xs relative z-10 scrollbar-none flex-nowrap sm:flex-wrap scroll-touch">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {t.skillsAllCategories} ({SKILL_CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0)})
          </button>

          {SKILL_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Categories Grid */}
      <div className="space-y-6">
        {filteredCategories.map(cat => {
          const IconComp = getCategoryIcon(cat.iconName);
          const visibleSkills = searchQuery.trim()
            ? cat.skills.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.note && s.note.toLowerCase().includes(searchQuery.toLowerCase())))
            : cat.skills;

          if (visibleSkills.length === 0) return null;

          return (
            <motion.div variants={itemVariants} key={cat.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-sm font-bold border-b border-slate-800/80 pb-3">
                <IconComp className="w-5 h-5 text-cyan-400" />
                <span className="text-white text-base">{cat.name}</span>
                <span className="text-xs text-slate-500 font-normal font-mono">({visibleSkills.length} skills)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleSkills.map((skill, idx) => (
                  <motion.div 
                    whileHover={{ y: -3, scale: 1.01 }}
                    key={idx}
                    className="bg-slate-950/80 border border-slate-850 hover:border-cyan-500/40 rounded-xl p-4 space-y-2 transition-all hover:bg-slate-950 group"
                  >
                    <div className="flex items-center justify-between gap-2 font-mono">
                      <span className="font-bold text-slate-100 group-hover:text-cyan-300 text-sm transition-colors flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-cyan-400/70 opacity-80 group-hover:opacity-100" />
                        <span>{skill.name}</span>
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getLevelBadgeClass(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>

                    {skill.note && (
                      <p className="text-xs text-slate-400 font-sans leading-snug">
                        {skill.note}
                      </p>
                    )}

                    {skill.years && (
                      <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-900 flex items-center justify-between">
                        <span>{t.skillsExperience}</span>
                        <span className="text-slate-300">{skill.years}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

    </motion.div>
  );
};

