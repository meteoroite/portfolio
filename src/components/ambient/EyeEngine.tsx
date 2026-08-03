import React, { useEffect, useState, useRef } from 'react';
import { Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { BRAND_ASSETS } from '../../data/brandAssets';

interface EyeEngineProps {
  reducedMotion?: boolean;
  onEyeClick?: () => void;
  compact?: boolean;
}

export const EyeEngine: React.FC<EyeEngineProps> = ({ reducedMotion, onEyeClick, compact = false }) => {
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseWave, setPulseWave] = useState(false);
  const lastMouseMoveRef = useRef<number>(Date.now());

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseMoveRef.current = Date.now();
      if (isSleeping) setIsSleeping(false);

      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate normalized offsets (-1 to 1)
      const nx = (e.clientX - width / 2) / (width / 2);
      const ny = (e.clientY - height / 2) / (height / 2);

      // Max movement radius in pixels
      const maxOffset = compact ? 8 : 16;
      setPupilPos({
        x: Math.max(-maxOffset, Math.min(maxOffset, nx * maxOffset)),
        y: Math.max(-maxOffset, Math.min(maxOffset, ny * maxOffset))
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        lastMouseMoveRef.current = Date.now();
        if (isSleeping) setIsSleeping(false);
        const touch = e.touches[0];
        const width = window.innerWidth;
        const height = window.innerHeight;
        const nx = (touch.clientX - width / 2) / (width / 2);
        const ny = (touch.clientY - height / 2) / (height / 2);
        const maxOffset = compact ? 8 : 16;
        setPupilPos({
          x: Math.max(-maxOffset, Math.min(maxOffset, nx * maxOffset)),
          y: Math.max(-maxOffset, Math.min(maxOffset, ny * maxOffset))
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Random Blink Timer
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, 4500);

    // Sleep timer on inactivity (15 seconds)
    const idleCheck = setInterval(() => {
      if (Date.now() - lastMouseMoveRef.current > 15000) {
        setIsSleeping(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      clearInterval(blinkInterval);
      clearInterval(idleCheck);
    };
  }, [reducedMotion, isSleeping, compact]);

  const handleClick = () => {
    setPulseWave(true);
    setTimeout(() => setPulseWave(false), 600);
    if (onEyeClick) onEyeClick();
  };

  const containerSize = compact ? "w-28 h-28" : "w-48 h-48 md:w-56 md:h-56";

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Click Pulse Wave Ring */}
      {pulseWave && (
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75 pointer-events-none" />
      )}

      {/* Main Eye Container */}
      <div 
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative ${containerSize} flex items-center justify-center cursor-pointer group transition-transform duration-300 hover:scale-105`}
        title="JARVIS System Core Eye - Click to Wake AI Assistant"
        id="eye-engine-core"
      >
        {/* Outer Emissive Glow Ring */}
        <div className={`absolute inset-0 rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-emerald-500/20 blur-xl ${isHovered ? 'scale-125 opacity-90' : 'opacity-60'}`} />

        {/* Outer Cybernetic Ring with Rotational Dash Lines */}
        <div className={`absolute inset-0 rounded-full border border-cyan-500/30 ${!reducedMotion ? 'animate-[spin_20s_linear_infinite]' : ''}`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full blur-[1px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full blur-[1px]" />
        </div>

        {/* Secondary Inner Rotating Counter-Ring */}
        <div className={`absolute inset-2 rounded-full border border-dashed border-blue-400/25 ${!reducedMotion ? 'animate-[spin_12s_linear_infinite_reverse]' : ''}`} />

        {/* Eye Sclera Canvas / Base */}
        <div className={`relative w-4/5 h-4/5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] transition-all duration-300 ${isBlinking || isSleeping ? 'scale-y-[0.05]' : 'scale-y-100'}`}>
          
          {/* Cybernetic Grid inside Sclera */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Iris Element (Follows Cursor) */}
          <div 
            className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-transform duration-100 ease-out"
            style={{
              transform: reducedMotion ? 'none' : `translate(${pupilPos.x}px, ${pupilPos.y}px)`
            }}
          >
            {/* Iris Outer Radiant Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-emerald-400 opacity-80 blur-[2px] animate-pulse" />

            {/* Iris Inner Detail Ring */}
            <div className="absolute inset-1 rounded-full bg-slate-950 border border-cyan-300/40 flex items-center justify-center">
              
              {/* Pupil Core */}
              <div className={`w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center shadow-[0_0_15px_#38bdf8] transition-transform duration-300 ${isHovered ? 'scale-125 bg-white' : 'scale-100'} overflow-hidden`}>
                {BRAND_ASSETS.jarvisEye.eyeEngine ? (
                  <img 
                    src={BRAND_ASSETS.jarvisEye.eyeEngine} 
                    alt="JARVIS" 
                    className="w-5 h-5 object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-slate-950 border border-cyan-400" />
                )}
              </div>

              {/* Light Reflection Specks */}
              <div className="absolute top-2 left-3 w-2 h-2 bg-white rounded-full opacity-70 blur-[0.5px]" />
              <div className="absolute bottom-3 right-4 w-1 h-1 bg-cyan-200 rounded-full opacity-60" />
            </div>
          </div>
        </div>

        {/* Hover Cue Tag */}
        <div className="absolute -bottom-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] tracking-widest uppercase font-mono text-cyan-400 bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap">
          {isSleeping ? "SYSTEM SLEEPING // CLICK TO WAKE" : "JARVIS CORE // CLICK FOR AI"}
        </div>
      </div>
    </div>
  );
};
