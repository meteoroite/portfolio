import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { TypewriterText } from '../ui/TypewriterText';
import { PERSONAL_INFO } from '../../data/profileData';
import { BRAND_ASSETS } from '../../data/brandAssets';
import { 
  Orbit, 
  Sparkles, 
  Rocket, 
  Volume2, 
  VolumeX, 
  Terminal, 
  FolderGit2, 
  Layers, 
  Milestone, 
  FileText, 
  Send,
  Zap,
  Globe,
  Compass,
  ArrowRight
} from 'lucide-react';

interface GalaxyPortalLandingProps {
  onEnterGalaxy: (targetTab?: string) => void;
}

export const GalaxyPortalLanding: React.FC<GalaxyPortalLandingProps> = ({ onEnterGalaxy }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isWarping, setIsWarping] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<string>('bio');
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [jarvisSpeaking, setJarvisSpeaking] = useState(false);

  // JARVIS Welcome Script
  const jarvisWelcomeMessage = 
    `Greetings, Explorer. You have arrived at the event horizon of Mahmoud Wehaiba — Staff Architect & AI Engineer. Ahead lies a galaxy of autonomous multi-agent networks, real-time computer vision, and resilient full-stack systems. Prepare for full quantum immersion.`;

  // Handle Speech Synthesis
  useEffect(() => {
    if ('speechSynthesis' in window && speechEnabled) {
      // Speak greeting after short delay
      const timer = setTimeout(() => {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(
            "Greetings Explorer. You have arrived at the event horizon of Mahmoud Wehaiba. Prepare to witness autonomous AI networks and full-stack architecture."
          );
          utterance.rate = 1.0;
          utterance.pitch = 0.9;
          utterance.onstart = () => setJarvisSpeaking(true);
          utterance.onend = () => setJarvisSpeaking(false);
          utterance.onerror = () => setJarvisSpeaking(false);
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.log("Speech synthesis unavailable");
        }
      }, 1000);

      return () => {
        clearTimeout(timer);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, [speechEnabled]);

  // Spiral Galaxy Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Galaxy particle setup
    const starCount = 350;
    const stars: Array<{
      x: number;
      y: number;
      z: number;
      angle: number;
      distance: number;
      speed: number;
      radius: number;
      color: string;
    }> = [];

    const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff', '#10b981'];

    for (let i = 0; i < starCount; i++) {
      const distance = Math.pow(Math.random(), 1.8) * Math.min(width, height) * 0.45 + 20;
      const angle = Math.random() * Math.PI * 2;
      stars.push({
        x: 0,
        y: 0,
        z: Math.random() * 1000,
        angle,
        distance,
        speed: (0.002 + Math.random() * 0.003) * (distance < 100 ? 1.5 : 0.8),
        radius: Math.random() * 1.8 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let warpSpeed = 1;

    const render = () => {
      ctx.fillStyle = 'rgba(5, 6, 8, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Galaxy Core Glow
      const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, Math.min(width, height) * 0.35);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
      grad.addColorStop(0.3, 'rgba(59, 130, 246, 0.2)');
      grad.addColorStop(0.7, 'rgba(139, 92, 246, 0.08)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Update & Draw Stars
      stars.forEach((star) => {
        if (isWarping) {
          // Warp lines expanding outward
          star.distance += 18 * warpSpeed;
          warpSpeed += 0.05;
        } else {
          star.angle += star.speed;
        }

        const x = centerX + Math.cos(star.angle) * star.distance;
        const y = centerY + Math.sin(star.angle) * (star.distance * 0.55); // tilted oval galaxy

        ctx.beginPath();
        if (isWarping) {
          // Draw streak line
          const prevX = centerX + Math.cos(star.angle) * (star.distance - 25);
          const prevY = centerY + Math.sin(star.angle) * ((star.distance - 25) * 0.55);
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = star.color;
          ctx.lineWidth = star.radius * 1.5;
          ctx.stroke();
        } else {
          ctx.arc(x, y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isWarping]);

  const handleTriggerWarp = (tab: string = 'bio') => {
    setSelectedTarget(tab);
    setIsWarping(true);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#06b6d4', '#3b82f6', '#a855f7']
    });

    setTimeout(() => {
      onEnterGalaxy(tab);
    }, 1500);
  };

  const celestialDestinations = [
    { id: 'bio', label: 'Core Identity', desc: 'Staff Architect Protocol', icon: Orbit, planetColor: 'from-cyan-400 to-blue-600' },
    { id: 'projects', label: 'Project Planets', desc: 'Interactive AI & CRM Systems', icon: FolderGit2, planetColor: 'from-purple-400 to-indigo-700' },
    { id: 'capabilities', label: 'Skill Constellations', desc: 'Tech Stack & Framework Nodes', icon: Layers, planetColor: 'from-emerald-400 to-teal-700' },
    { id: 'timeline', label: 'Time Warp Logs', desc: 'University & Military Milestones', icon: Milestone, planetColor: 'from-amber-400 to-orange-600' },
    { id: 'cv', label: 'Holo Archive', desc: 'Executive & Technical CV Downloads', icon: FileText, planetColor: 'from-blue-400 to-cyan-700' },
    { id: 'contact', label: 'Sub-Space Link', desc: 'Direct Direct Transmission', icon: Send, planetColor: 'from-fuchsia-400 to-pink-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#050608] text-white font-mono flex flex-col justify-between overflow-y-auto overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Background Interactive Galaxy Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Top Bar Header */}
      <header className="relative z-20 max-w-7xl mx-auto w-full p-4 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950/90 border border-cyan-400/60 overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            {BRAND_ASSETS.systemIcon.navbarHome ? (
              <img src={BRAND_ASSETS.systemIcon.navbarHome} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="font-bold text-cyan-400">MW</span>
            )}
          </div>
          <div>
            <div className="font-bold text-sm tracking-wider text-white">MAHMOUD WEHAIBA GALAXY</div>
            <div className="text-[10px] text-cyan-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>COSMIC EVENT HORIZON v3.6</span>
            </div>
          </div>
        </div>

        {/* Audio Speech Toggle Button */}
        <button
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            setSpeechEnabled(!speechEnabled);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-xs transition-all shadow-md"
        >
          {speechEnabled ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          <span>{speechEnabled ? "JARVIS Audio: ON" : "JARVIS Audio: OFF"}</span>
        </button>
      </header>

      {/* Main Hero & JARVIS Hologram Centerpiece */}
      <main className="relative z-20 max-w-5xl mx-auto px-4 py-8 w-full flex flex-col items-center justify-center my-auto space-y-8 text-center">
        
        {/* JARVIS AI Avatar Core */}
        <div className="relative group cursor-pointer" onClick={() => handleTriggerWarp('bio')}>
          <motion.div
            animate={{
              scale: jarvisSpeaking ? [1, 1.12, 1] : [1, 1.05, 1],
              boxShadow: [
                '0 0 30px rgba(6,182,212,0.3)',
                '0 0 70px rgba(59,130,246,0.6)',
                '0 0 30px rgba(6,182,212,0.3)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center relative shadow-2xl z-10 overflow-hidden"
          >
            <img 
              src={BRAND_ASSETS.jarvisEye.galaxyPortal} 
              alt="JARVIS AI Core" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
            
            {/* Spinning Outer Orbit Ring */}
            <div className="absolute -inset-3 rounded-full border border-cyan-400/40 border-dashed animate-spin" style={{ animationDuration: '12s' }} />
            <div className="absolute -inset-6 rounded-full border border-blue-500/20 border-dotted animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
          </motion.div>

          {/* JARVIS Status Tag */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 text-[11px] font-bold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>JARVIS COSMIC WELCOMER</span>
          </div>
        </div>

        {/* Typing Speech Holographic Card */}
        <div className="max-w-2xl w-full bg-slate-950/80 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] relative space-y-4 text-left">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2 text-cyan-400 font-bold">
              <Terminal className="w-4 h-4" />
              <span>JARVIS TRANSMISSION #001</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/30">
              LIVE SIGNAL
            </span>
          </div>

          <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans min-h-[90px]">
            <TypewriterText text={jarvisWelcomeMessage} speed={30} delay={400} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <div className="text-slate-400 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Staff Architect • Tanta University '24 • AI Systems</span>
            </div>
            <button
              onClick={() => handleTriggerWarp('bio')}
              className="text-cyan-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Direct Core</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Big Action Hyper-Drive Button */}
        <div className="pt-2">
          <button
            onClick={() => handleTriggerWarp('bio')}
            disabled={isWarping}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105 active:scale-95"
          >
            <Rocket className="w-5 h-5 animate-bounce text-cyan-200" />
            <span>{isWarping ? "INITIATING HYPER-WARP DIVE..." : "ENTER THE GALAXY"}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Celestial Destinations Quick Orbit Launchpad */}
        <div className="pt-6 w-full max-w-4xl space-y-3">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Select Celestial Destination System</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {celestialDestinations.map((dest) => {
              const Icon = dest.icon;
              return (
                <motion.div
                  key={dest.id}
                  whileHover={{ y: -4, scale: 1.03 }}
                  onClick={() => handleTriggerWarp(dest.id)}
                  className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-400/60 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer group shadow-lg transition-all"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${dest.planetColor} flex items-center justify-center text-white mb-2 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate w-full">
                    {dest.label}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate w-full mt-0.5">
                    {dest.desc}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Footer System Status */}
      <footer className="relative z-20 max-w-7xl mx-auto w-full p-4 sm:p-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900">
        <div>
          Mahmoud Wehaiba © {new Date().getFullYear()} • Autonomous AI Architecture
        </div>
        <div className="flex items-center gap-3 text-[11px] text-cyan-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            GALAXY GRID ACTIVE
          </span>
          <span>•</span>
          <span>LATENCY: 12ms</span>
        </div>
      </footer>

    </div>
  );
};
