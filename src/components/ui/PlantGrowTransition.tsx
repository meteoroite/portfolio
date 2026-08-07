import React from 'react';
import { motion, type Variants } from 'motion/react';

/**
 * Shared "plant grow" transition variants (Track B — agriculture theme).
 * Stem scales up from its base, then leaves unfurl in a staggered cascade.
 * Respects calling components that gate via reducedMotion.
 */
export const stemGrow: Variants = {
  hidden: { scaleY: 0, opacity: 0, transformOrigin: 'bottom' },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const leafUnfurl: Variants = {
  hidden: { scale: 0, rotate: -15, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { delay: 0.15 + i * 0.08, duration: 0.35, ease: 'easeOut' },
  }),
};

/** Staggered-paren container that cascades child grow variants. */
export const growContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

/** A single leaf dot positioned along a stem — used inside PlantGrowTransition. */
export const LeafNode: React.FC<{ i: number; size?: number; colorClass?: string; style?: React.CSSProperties }> = ({
  i,
  size = 8,
  colorClass = 'bg-cyan-400',
  style,
}) => (
  <motion.span
    custom={i}
    variants={leafUnfurl}
    className={`absolute rounded-full ${colorClass}`}
    style={{ width: size, height: size, ...style }}
  />
);

/** Vine weave ambient path — a single growing SVG spline (pointer-events-none). */
export function VineWeave({ d, className }: { d: string; className?: string }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="var(--color-cyan-500)"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.4 }}
      transition={{ duration: 2.2, ease: 'easeInOut' }}
    />
  );
}

/**
 * Reusable stem-grow wrapper: renders children inside a growing "stem"
 * with `leafCount` leaves unfurling in a staggered cascade on enter.
 * Position leaves at absolute coords via the `stemLeaves` prop for placement.
 */
export const PlantGrowTransition: React.FC<{
  children: React.ReactNode;
  leafCount?: number;
  className?: string;
  leaves?: Array<{ style: React.CSSProperties; size?: number; colorClass?: string }>;
}> = ({ children, className, leaves }) => {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className={className}>
      <motion.div variants={stemGrow} className="relative">
        {children}
        {leaves?.map((leaf, i) => (
          <LeafNode key={i} i={i} size={leaf.size} colorClass={leaf.colorClass} style={leaf.style} />
        ))}
      </motion.div>
    </motion.div>
  );
};