import React from 'react';
import { motion } from 'motion/react';

interface PlantOrbProps {
  size?: number;
  isHovered?: boolean;
}

/**
 * Agriculture-theme replacement for Planet3D. Renders a stylized sprout that
 * "grows" (unfurls + gently sways) out of a soil mound, used everywhere the
 * galaxy theme would show a planet.
 */
export const PlantOrb: React.FC<PlantOrbProps> = ({ size = 80, isHovered = false }) => {
  const stalkW = Math.max(size * 0.1, 5);
  const stalkH = size * 0.62;
  const leafW = size * 0.24;
  const leafH = size * 0.13;

  return (
    <div
      className="relative flex items-end justify-center select-none"
      style={{ width: size * 1.5, height: size * 1.5 }}
    >
      {/* Warm sunlight halo behind plant */}
      <motion.div
        animate={{ scale: isHovered ? [1.1, 1.28, 1.1] : [1, 1.14, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute rounded-full blur-lg"
        style={{
          width: size,
          height: size,
          top: size * 0.02,
          background: 'radial-gradient(circle, rgba(233,184,61,0.35), rgba(255,221,138,0.12) 60%, transparent 70%)',
        }}
      />

      {/* Soil mound base */}
      <div
        className="absolute bottom-1 rounded-[50%] bg-gradient-to-br from-amber-800 to-amber-950 border border-amber-700/60 shadow-[inset_0_-6px_12px_rgba(0,0,0,0.5)]"
        style={{ width: size * 0.9, height: size * 0.22 }}
      />

      {/* Stalk growing up + gentle sway */}
      <motion.div
        className="absolute origin-bottom rounded-full"
        animate={{
          rotate: isHovered ? [-2.5, 2.5, -2.5] : [0, 0, 0],
        }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: stalkW,
          height: stalkH,
          bottom: size * 0.12,
          background: 'linear-gradient(180deg, #43ab5f, #2b7040)',
        }}
      />

      {/* Left leaf (unfurls on mount, then gently waves) */}
      <motion.div
        className="absolute rounded-[100%_0_100%_100%] border border-white/20"
        initial={{ scale: 0, rotate: -45, opacity: 0 }}
        animate={{
          scale: 1,
          rotate: isHovered ? [-18, -30, -18] : [-22, -30, -22],
          opacity: 1,
        }}
        transition={{
          scale: { duration: 0.6, ease: 'easeOut', delay: 0.2 },
          rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
          opacity: { duration: 0.4, delay: 0.2 },
        }}
        style={{
          width: leafW,
          height: leafH,
          bottom: size * 0.5,
          left: '50%',
          marginLeft: -leafW,
          background: 'linear-gradient(180deg, #6ee7b7, #34d399)',
        }}
      />

      {/* Right leaf */}
      <motion.div
        className="absolute rounded-[0_100%_100%_100%] border border-white/20"
        initial={{ scale: 0, rotate: 45, opacity: 0 }}
        animate={{
          scale: 1,
          rotate: isHovered ? [18, 30, 18] : [22, 30, 22],
          opacity: 1,
        }}
        transition={{
          scale: { duration: 0.6, ease: 'easeOut', delay: 0.3 },
          rotate: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 },
          opacity: { duration: 0.4, delay: 0.3 },
        }}
        style={{
          width: leafW,
          height: leafH,
          bottom: size * 0.46,
          left: '50%',
          background: 'linear-gradient(180deg, #a7f3d0, #34d399)',
        }}
      />

      {/* Sprout tip bud */}
      <motion.div
        className="absolute rounded-full"
        animate={{ scale: isHovered ? [1, 1.18, 1] : [1, 1.08, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: stalkW * 1.5,
          height: stalkW * 1.5,
          bottom: size * 0.12 + stalkH - stalkW * 0.3,
          left: '50%',
          marginLeft: -stalkW * 0.75,
          background: 'radial-gradient(circle at 35% 30%, #a7f3d0, #34d399 70%)',
          boxShadow: '0 0 12px rgba(52,211,153,0.6)',
        }}
      />
    </div>
  );
};