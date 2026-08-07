import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../lib/theme';

interface ParticleBackgroundProps {
  theme?: 'galaxy' | 'agriculture';
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme: contextTheme } = useTheme();
  const activeTheme = theme ?? contextTheme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const isAgri = activeTheme === 'agriculture';

    // Particle palette (theme-aware)
    const colors = isAgri
      ? ['rgba(92, 196, 119, ', 'rgba(227, 184, 61, ', 'rgba(163, 230, 152, ', 'rgba(233, 220, 138, ']
      : ['rgba(6, 182, 212, ', 'rgba(59, 130, 246, ', 'rgba(168, 85, 247, ', 'rgba(16, 185, 129, '];

    // Particle pool
    const particleCount = Math.min(Math.floor(window.innerWidth / 16), 85);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      twinkleSpeed: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: 0.005 + Math.random() * 0.015,
      });
    }

    // Shooting Stars / Meteors
    interface Meteor {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
      color: string;
      thickness: number;
    }

    const meteors: Meteor[] = [];

    const createMeteor = (): Meteor => {
      return {
        x: Math.random() * width * 1.2 - width * 0.2,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 12 + 8,
        angle: (Math.PI / 180) * (Math.random() * 20 + 35), // ~45 deg downward streak
        alpha: 1,
        color: isAgri ? '#e9b83d' : (Math.random() > 0.5 ? '#06b6d4' : '#3b82f6'),
        thickness: Math.random() * 1.5 + 1,
      };
    };

    // Spawn meteors periodically
    let lastMeteorSpawn = Date.now();

    // Floating Meteorites / Space Debris
    const spaceDebrisCount = 12;
    const spaceDebris: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      rotation: number;
      vRot: number;
    }> = [];

    for (let i = 0; i < spaceDebrisCount; i++) {
      spaceDebris.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
      });
    }

    // Mouse interaction
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      if (now - lastMeteorSpawn > 2200 + Math.random() * 1800) {
        meteors.push(createMeteor());
        lastMeteorSpawn = now;
      }

      // Draw Distant Glowing Sun / Light Halo in Top Right & Bottom Left
      ctx.save();
      const moonGrad = ctx.createRadialGradient(width * 0.85, height * 0.18, 5, width * 0.85, height * 0.18, 90);
      moonGrad.addColorStop(0, isAgri ? 'rgba(233, 184, 61, 0.14)' : 'rgba(6, 182, 212, 0.12)');
      moonGrad.addColorStop(0.5, isAgri ? 'rgba(92, 196, 119, 0.05)' : 'rgba(59, 130, 246, 0.05)');
      moonGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(width * 0.85, height * 0.18, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render & Update Particles (Stars)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        p1.alpha += Math.sin(now * p1.twinkleSpeed) * 0.01;
        if (p1.alpha < 0.1) p1.alpha = 0.1;
        if (p1.alpha > 0.8) p1.alpha = 0.8;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p1.color}${p1.alpha})`;
        ctx.fill();

        // Connect nearby stars
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isAgri ? `rgba(92, 196, 119, ${0.14 * (1 - dist / 110)})` : `rgba(56, 189, 248, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Connect with mouse
        const mdx = p1.x - mouseX;
        const mdy = p1.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = isAgri ? `rgba(233, 184, 61, ${0.3 * (1 - mdist / 140)})` : `rgba(6, 182, 212, ${0.28 * (1 - mdist / 140)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // Render Floating Space Debris / Meteorites
      spaceDebris.forEach((deb) => {
        deb.x += deb.vx;
        deb.y += deb.vy;
        deb.rotation += deb.vRot;

        if (deb.x < 0) deb.x = width;
        if (deb.x > width) deb.x = 0;
        if (deb.y < 0) deb.y = height;
        if (deb.y > height) deb.y = 0;

        ctx.save();
        ctx.translate(deb.x, deb.y);
        ctx.rotate(deb.rotation);
        ctx.fillStyle = isAgri ? 'rgba(124, 144, 126, 0.28)' : 'rgba(148, 163, 184, 0.25)';
        ctx.strokeStyle = isAgri ? 'rgba(92, 196, 119, 0.45)' : 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.rect(-deb.size / 2, -deb.size / 2, deb.size, deb.size);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // Render Active Shooting Stars / Meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        const endX = m.x + Math.cos(m.angle) * m.length;
        const endY = m.y + Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, endX, endY);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.7, m.color);
        grad.addColorStop(1, '#ffffff');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Advance meteor position
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.015;

        if (m.x > width + 100 || m.y > height + 100 || m.alpha <= 0) {
          meteors.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
