import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../lib/theme';
import { PlantOrb } from './PlantOrb';

interface Planet3DProps {
  id: string;
  category: string;
  size?: number; // size in px
  isHovered?: boolean;
  className?: string;
}

// Map categories or IDs to celestial themes
const getPlanetTheme = (id: string, category: string) => {
  if (id.includes('autocrm') || category === 'AI') {
    return {
      name: 'CRONOS-AI IX',
      type: 'Quantum Gas Giant',
      primaryGlow: 'rgba(6, 182, 212, 0.6)',
      ringColor: 'border-cyan-400/60',
      gradient: 'from-cyan-400 via-blue-600 to-indigo-950',
      hasRings: true,
      atmosphere: 'rgba(56, 189, 248, 0.4)',
    };
  }
  if (id.includes('medqr') || category === 'Full-Stack') {
    return {
      name: 'HELIOS-MED IV',
      type: 'Bio-Luminescent Tech World',
      primaryGlow: 'rgba(16, 185, 129, 0.6)',
      ringColor: 'border-emerald-400/60',
      gradient: 'from-emerald-400 via-teal-600 to-slate-950',
      hasRings: false,
      atmosphere: 'rgba(52, 211, 153, 0.4)',
    };
  }
  if (id.includes('handson') || category === 'Computer Vision') {
    return {
      name: 'NEBULA-VISION I',
      type: 'Neural Arc Energy Planet',
      primaryGlow: 'rgba(168, 85, 247, 0.6)',
      ringColor: 'border-purple-400/60',
      gradient: 'from-purple-400 via-fuchsia-600 to-slate-950',
      hasRings: true,
      atmosphere: 'rgba(192, 132, 252, 0.4)',
    };
  }
  if (category === 'AgTech') {
    return {
      name: 'TERRA-AGRI VI',
      type: 'Hydro-Agricultural Sphere',
      primaryGlow: 'rgba(234, 179, 8, 0.6)',
      ringColor: 'border-amber-400/60',
      gradient: 'from-amber-400 via-emerald-600 to-slate-950',
      hasRings: false,
      atmosphere: 'rgba(250, 204, 21, 0.4)',
    };
  }
  return {
    name: 'TITAN-CORE III',
    type: 'Crystalline Architecture World',
    primaryGlow: 'rgba(59, 130, 246, 0.6)',
    ringColor: 'border-blue-400/60',
    gradient: 'from-blue-400 via-indigo-700 to-slate-950',
    hasRings: true,
    atmosphere: 'rgba(96, 165, 250, 0.4)',
  };
};

export const Planet3D: React.FC<Planet3DProps> = ({
  id,
  category,
  size = 80,
  isHovered = false,
  className = '',
}) => {
  const { theme } = useTheme();
  const isAgri = theme === 'agriculture';

  if (isAgri) {
    return <PlantOrb size={size} isHovered={isHovered} />;
  }

  const themeInfo = getPlanetTheme(id, category);

  return (
    <div
      className={`relative flex items-center justify-center cursor-pointer select-none ${className}`}
      style={{ width: size * 1.5, height: size * 1.5 }}
    >
      {/* Atmosphere Glow Ring */}
      <motion.div
        animate={{
          scale: isHovered ? [1.1, 1.25, 1.1] : [1, 1.1, 1],
          opacity: isHovered ? 0.9 : 0.5,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute rounded-full blur-md"
        style={{
          width: size,
          height: size,
          backgroundColor: themeInfo.atmosphere,
          boxShadow: `0 0 35px ${themeInfo.primaryGlow}`,
        }}
      />

      {/* Planetary Orbit Ring (If applies) */}
      {themeInfo.hasRings && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className={`absolute rounded-[100%] border-2 ${themeInfo.ringColor} pointer-events-none`}
          style={{
            width: size * 1.5,
            height: size * 0.5,
            transform: 'rotateX(70deg) rotateY(-15deg)',
            boxShadow: `0 0 15px ${themeInfo.primaryGlow}`,
          }}
        />
      )}

      {/* The Core Planet Sphere */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: isHovered ? 1.15 : 1,
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
          scale: { duration: 0.3 },
        }}
        className={`rounded-full bg-gradient-to-tr ${themeInfo.gradient} relative overflow-hidden shadow-2xl z-10 border border-white/20`}
        style={{
          width: size,
          height: size,
        }}
      >
        {/* Surface Craters / Cloud Swirl Overlay */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 via-transparent to-black/60" />
        
        {/* Swirling Continent / Cloud Bands */}
        <div className="absolute top-2 left-2 w-3/4 h-3/4 rounded-full border-t border-l border-white/30 filter blur-[1px]" />
        <div className="absolute bottom-3 right-3 w-1/2 h-1/2 rounded-full border-b border-r border-black/50 filter blur-[1px]" />
      </motion.div>

      {/* Surface Light Reflection Spot */}
      <div
        className="absolute rounded-full bg-white/40 blur-[2px] pointer-events-none z-20"
        style={{
          width: size * 0.25,
          height: size * 0.25,
          top: size * 0.35,
          left: size * 0.35,
        }}
      />
    </div>
  );
};

export { getPlanetTheme };
