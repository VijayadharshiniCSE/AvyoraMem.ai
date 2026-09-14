import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  type: 'star' | 'dot' | 'sparkle';
}

const LUXURY_PALETTE = [
  '#D4AF37', // Haute Gold
  '#FFF6D6', // Starlight Gold
  '#FFFFFF', // Diamond White
  '#F5DEB3', // Wheat Champagne
  '#E6CA7E', // Soft Radiant Gold
];

export const TwinkleCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check if device is touch-only
    const isTouchOnly = window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches;
    if (isTouchOnly) return;

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

    const particles: Particle[] = [];
    const maxParticles = 55;
    let lastX = 0;
    let lastY = 0;
    let isMoving = false;
    let moveTimeout: any = null;

    const createParticle = (x: number, y: number) => {
      if (particles.length >= maxParticles) return;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.8 + 0.4;
      const color = LUXURY_PALETTE[Math.floor(Math.random() * LUXURY_PALETTE.length)];
      const randType = Math.random();
      const type: 'star' | 'dot' | 'sparkle' = randType > 0.4 ? 'star' : randType > 0.2 ? 'sparkle' : 'dot';

      particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.2, // slight gravity drift
        size: Math.random() * 5 + 3,
        color,
        alpha: 1,
        decay: Math.random() * 0.025 + 0.02,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.1,
        type,
      });
    };

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const dist = Math.hypot(x - lastX, y - lastY);
      
      // Spawn particles based on movement distance
      if (dist > 4) {
        const count = Math.min(Math.floor(dist / 6) + 1, 4);
        for (let i = 0; i < count; i++) {
          createParticle(x, y);
        }
        lastX = x;
        lastY = y;
        isMoving = true;
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
          isMoving = false;
        }, 150);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Draw 4-pointed luxury star
    const drawStar = (c: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.beginPath();
      // 4-point sparkling cross star
      const inner = r * 0.25;
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        const aInner = a + Math.PI / 4;
        c.lineTo(Math.cos(aInner) * inner, Math.sin(aInner) * inner);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;
        p.size *= 0.98;

        if (p.alpha <= 0 || p.size <= 0.5) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, p.size, p.rotation);
        } else if (p.type === 'sparkle') {
          // Diamond glint
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Micro stardust
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      clearTimeout(moveTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
};
