import React from 'react';

interface BackgroundGridProps {
  reducedMotion?: boolean;
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({ reducedMotion }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[var(--bg-root)]">
      {/* Radial Atmospheric Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-950/20 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-blue-950/20 rounded-full blur-[120px]" />
      <div className="absolute top-2/3 left-10 w-[450px] h-[450px] bg-emerald-950/15 rounded-full blur-[120px]" />

      {/* Cybernetic Tech Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Subtle Scanline Overlay */}
      {!reducedMotion && (
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_51%)] bg-[length:100%_4px] opacity-30 pointer-events-none" />
      )}
    </div>
  );
};
