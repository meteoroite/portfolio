import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PROJECTS_DATA } from '../../data/profileData';
import { Project } from '../../types';
import { Planet3D, getPlanetTheme } from '../ui/Planet3D';
import { useLang } from '../../lib/language';
import { 
  FolderGit2, 
  ExternalLink, 
  Code2, 
  Sparkles, 
  Layers, 
  X,
  CheckCircle2,
  Terminal,
  Cpu,
  Globe,
  Radio,
  Zap,
  Rocket,
  Compass,
  LayoutGrid,
  Orbit,
  ArrowRight
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

export const ProjectUniverse: React.FC = () => {
  const { t } = useLang();
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS_DATA);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // View Modes: 'solar_system' | 'grid'
  const [viewMode, setViewMode] = useState<'solar_system' | 'grid'>('solar_system');

  // Currently active planet being hovered or selected
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);

  // Atmospheric Entry / Dive-In State
  const [divingProject, setDivingProject] = useState<Project | null>(null);
  const [isDiving, setIsDiving] = useState<boolean>(false);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const diveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Escape key to cancel diving animation or close modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDiving) {
          cancelDive();
        } else if (activeModalProject) {
          setActiveModalProject(null);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isDiving, activeModalProject]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjectsList(data);
      }
    } catch (err) {
      console.log("Fallback to profileData for projects");
    }
  };

  const categories = ['all', 'AI', 'Full-Stack', 'Client Work', 'Computer Vision', 'AgTech'];

  const filteredProjects = projectsList.filter(p => {
    if (selectedFilter === 'all') return true;
    return p.category === selectedFilter;
  });

  const handlePlanetClick = (project: Project) => {
    setDivingProject(project);
    setIsDiving(true);

    // Trigger warp entrance animation sequence
    diveTimerRef.current = setTimeout(() => {
      setIsDiving(false);
      setActiveModalProject(project);
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#06b6d4', '#3b82f6', '#a855f7', '#10b981']
      });
    }, 1400);
  };

  const cancelDive = () => {
    if (diveTimerRef.current) clearTimeout(diveTimerRef.current);
    setIsDiving(false);
    setDivingProject(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-950 text-emerald-300 border-emerald-500/50';
      case 'Completed': return 'bg-cyan-950 text-cyan-300 border-cyan-500/50';
      default: return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative" id="section-projects">
      
      {/* Header & Controls */}
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-4 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2">
              <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>{t.projectsPlanetaryHeader}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.projectsTitle}
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl font-sans">
              {t.projectsDesc}
            </p>
          </div>

          {/* View Mode & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Solar System vs Grid Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('solar_system')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  viewMode === 'solar_system'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Orbit className="w-3.5 h-3.5" />
                <span>{t.projectsOrbitalView}</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{t.projectsGridView}</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex overflow-x-auto max-w-full pb-1 gap-1.5 font-mono text-xs scrollbar-none flex-nowrap sm:flex-wrap scroll-touch">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap shrink-0 ${
                    selectedFilter === cat
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat === 'all' ? t.projectsAllPlanets : cat}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Atmospheric Entry Warp Transition Overlay */}
      <AnimatePresence>
        {isDiving && divingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-mono"
          >
            {/* Speed Streak Particles */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-blue-900/40 to-slate-950 animate-pulse" />
            
            {/* Hyper-Zooming Planet Target */}
            <motion.div
              initial={{ scale: 0.8, rotate: 0 }}
              animate={{ scale: 12, rotate: 180, opacity: [0.8, 1, 0.2] }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
              className="z-10"
            >
              <Planet3D
                id={divingProject.id}
                category={divingProject.category}
                size={140}
                isHovered={true}
              />
            </motion.div>

            {/* Re-Entry Telemetry Overlay */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-20 z-20 text-center space-y-2 bg-slate-950/80 p-6 rounded-2xl border border-cyan-500/50 backdrop-blur-md shadow-[0_0_50px_rgba(6,182,212,0.4)]"
            >
              <div className="flex items-center justify-center gap-2 text-xs text-cyan-400 font-bold tracking-widest uppercase animate-pulse">
                <Rocket className="w-4 h-4 animate-bounce" />
                <span>{t.projectsReentry}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {t.projectsDivingInto} {getPlanetTheme(divingProject.id, divingProject.category).name}
              </h3>
              <div className="text-xs text-slate-400">
                {t.projectsTargetSystem}: <span className="text-cyan-300 font-bold">{divingProject.title}</span>
              </div>
              <div className="text-[10px] text-emerald-400 pt-2 font-mono">
                [ SPEED: 14.2 km/s ] • [ SHIELD TEMP: 1840°C ] • [ LANDING IN 1.2s ]
              </div>
            </motion.div>

            {/* Cancel Button */}
            <button
              onClick={cancelDive}
              className="absolute top-6 right-6 z-30 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-mono rounded-xl border border-slate-700 hover:border-slate-600 transition-colors backdrop-blur-md"
            >
              ✕ Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW 1: INTERACTIVE ORBITAL SOLAR SYSTEM VIEW */}
      {viewMode === 'solar_system' && (
        <div className="relative min-h-[580px] sm:min-h-[640px] bg-slate-950/90 border border-cyan-500/30 rounded-3xl p-4 sm:p-8 flex flex-col items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          
          {/* Deep Space Starfield & Orbit Rings Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/30 via-slate-950 to-black pointer-events-none" />

          {/* Concentric Orbit Rings */}
          {[180, 290, 400, 510].map((radius, idx) => (
            <div
              key={idx}
              className="absolute rounded-full border border-cyan-500/15 pointer-events-none"
              style={{
                width: radius,
                height: radius,
              }}
            />
          ))}

          {/* Central Sun: MAHMOUD SYSTEM ARCHITECTURE CORE */}
          <div className="relative z-20 flex flex-col items-center justify-center group cursor-pointer mb-8 sm:mb-0">
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                boxShadow: [
                  '0 0 35px rgba(6,182,212,0.4)',
                  '0 0 65px rgba(59,130,246,0.7)',
                  '0 0 35px rgba(6,182,212,0.4)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-900 border-2 border-white/40 flex flex-col items-center justify-center text-center p-2 relative shadow-2xl"
            >
              <Cpu className="w-8 h-8 text-white animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-cyan-200 mt-1 uppercase tracking-tighter">
                {t.projectsCoreArch}
              </span>
            </motion.div>
            <div className="mt-2 bg-slate-950/90 border border-cyan-500/40 px-3 py-1 rounded-full text-[10px] font-mono text-cyan-300 font-bold shadow-md">
              {t.projectsMahmoudCore}
            </div>
          </div>

          {/* Orbiting / Floating Project Planets Container */}
          <div className="w-full max-w-5xl my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 z-20 items-center justify-center">
            {filteredProjects.map((project, idx) => {
              const theme = getPlanetTheme(project.id, project.category);
              const isHovered = hoveredPlanetId === project.id;

              return (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.05, y: -6 }}
                  onHoverStart={() => setHoveredPlanetId(project.id)}
                  onHoverEnd={() => setHoveredPlanetId(null)}
                  onClick={() => handlePlanetClick(project)}
                  className="flex flex-col items-center p-4 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-cyan-400/60 transition-all cursor-pointer group shadow-lg backdrop-blur-md relative"
                >
                  {/* Planet Visual */}
                  <Planet3D
                    id={project.id}
                    category={project.category}
                    size={70}
                    isHovered={isHovered}
                  />

                  {/* Planet Designation & Title */}
                  <div className="text-center mt-3 space-y-1">
                    <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 inline-block">
                      {theme.name}
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {project.title}
                    </h4>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {project.category}
                    </div>
                  </div>

                  {/* Dive In Hover Pill */}
                  <div className="mt-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-1.5 text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-xl shadow-[0_0_10px_rgba(6,182,212,0.3)] group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                      <Rocket className="w-3 h-3" />
                      <span>{t.projectsDiveIn}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center font-mono text-xs text-slate-400 pt-2 z-20 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{t.projectsSelectPlanet}</span>
          </div>

        </div>
      )}

      {/* VIEW 2: PLANET CARDS GRID VIEW */}
      {viewMode === 'grid' && (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              const theme = getPlanetTheme(project.id, project.category);
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  key={project.id}
                  className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 backdrop-blur-md space-y-4 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Header with Planet Graphic */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                          {theme.name}
                        </span>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {project.title}
                        </h3>
                        <div className="text-xs font-mono text-slate-400">
                          Role: {project.role}
                        </div>
                      </div>

                      {/* Small Planet Thumbnail */}
                      <div className="shrink-0">
                        <Planet3D
                          id={project.id}
                          category={project.category}
                          size={55}
                        />
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3">
                      {project.shortDesc}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[11px]">
                      {project.stack.slice(0, 5).map((tech, tIdx) => (
                        <span key={tIdx} className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 5 && (
                        <span className="text-slate-500 text-[10px] self-center">
                          +{project.stack.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions & Key Lesson */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-3 font-mono text-xs">
                    <div className="text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-cyan-400 font-semibold">{t.projectsKeyArchitecture} </span>
                      <span className="italic font-sans text-slate-300">{project.keyLesson}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => handlePlanetClick(project)}
                        className="flex items-center gap-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 px-3.5 py-2 rounded-xl border border-cyan-500/40 font-bold transition-all hover:scale-105"
                      >
                        <Rocket className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{t.projectsDiveIntoPlanet}</span>
                      </button>

                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                        >
                          <span>{t.projectsLiveDemo}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* PLANET LANDING CASE STUDY MODAL */}
      {activeModalProject && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-mono">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(6,182,212,0.2)] relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header with Planet Emblem */}
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <Planet3D
                  id={activeModalProject.id}
                  category={activeModalProject.category}
                  size={75}
                  isHovered={true}
                />
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-500/40">
                    {getPlanetTheme(activeModalProject.id, activeModalProject.category).name}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded border font-semibold ${getStatusBadge(activeModalProject.status)}`}>
                    {activeModalProject.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white truncate">
                  {activeModalProject.title}
                </h3>
                <div className="text-xs text-slate-400">
                  Architectural Lead: <span className="text-cyan-300 font-semibold">{activeModalProject.role}</span>
                </div>
              </div>
            </div>

            {/* Planetary Telemetry Data */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Planet Designation</div>
                <div className="text-slate-200 font-bold">{getPlanetTheme(activeModalProject.id, activeModalProject.category).name}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Classification</div>
                <div className="text-cyan-400 font-bold truncate">{getPlanetTheme(activeModalProject.id, activeModalProject.category).type}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Category Domain</div>
                <div className="text-emerald-400 font-bold">{activeModalProject.category}</div>
              </div>
            </div>

            {/* System Overview */}
            <div className="space-y-3 font-sans text-sm text-slate-200 leading-relaxed border-t border-b border-slate-800 py-4">
              <h4 className="font-mono font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>{t.projectsSurfaceArch}</span>
              </h4>
              <p>{activeModalProject.fullDesc}</p>
            </div>

            {/* Key Metrics */}
            {activeModalProject.metrics && activeModalProject.metrics.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-mono font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.projectsMetrics}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeModalProject.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2 text-slate-300">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Stack */}
            <div className="space-y-2">
              <h4 className="font-mono font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{t.projectsTechStack}</span>
              </h4>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {activeModalProject.stack.map((s, sIdx) => (
                  <span key={sIdx} className="bg-slate-950 text-cyan-300 px-3 py-1 rounded-lg border border-slate-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveModalProject(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono transition-colors"
              >
                {t.projectsCloseView}
              </button>

              {activeModalProject.demoUrl && (
                <a
                  href={activeModalProject.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  <span>{t.projectsEstablishConnection}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
