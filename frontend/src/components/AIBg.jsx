import React, { useEffect, useRef } from 'react';
import './ai-background.css';

export default function AIBg({ particles = 26 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    let ctx = null;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const setSize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: 100, height: 100 };
      width = Math.max(100, Math.floor(rect.width));
      height = Math.max(100, Math.floor(rect.height));
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx = canvas.getContext ? canvas.getContext('2d') : null;
      if (ctx && typeof ctx.setTransform === 'function') {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const nodes = new Array(particles).fill(0).map(() => ({
      x: Math.random() * 1.0,
      y: Math.random() * 1.0,
      vx: (Math.random() - 0.5) * 0.0015,
      vy: (Math.random() - 0.5) * 0.0015,
      r: 1 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2
    }));

    const draw = (t) => {
      if (!ctx) {
        // If there's no drawing context (e.g., in some test environments), skip drawing but continue the RAF loop.
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // background subtle gradient
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, 'rgba(70,40,220,0.02)');
      g.addColorStop(1, 'rgba(50,120,220,0.02)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // move relative to parent size
        n.x += n.vx * width;
        n.y += n.vy * height;
        // bounce edges
        if (n.x < 0 || n.x > 1) { n.vx *= -1; }
        if (n.y < 0 || n.y > 1) { n.vy *= -1; }
        const px = n.x * width;
        const py = n.y * height;

        // connect to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const mx = m.x * width;
          const my = m.y * height;
          const dx = px - mx;
          const dy = py - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const max = Math.min(width, height) * 0.25;
          if (dist < max) {
            const alpha = 0.12 * (1 - dist / max);
            ctx.strokeStyle = `rgba(120,140,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(mx, my);
            ctx.stroke();
          }
        }

        // react slightly to mouse
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        if (mx >= 0 && my >= 0) {
          const mdx = px - mx;
          const mdy = py - my;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 120) {
            const push = (120 - md) * 0.00018;
            n.vx += (mdx / md) * push;
            n.vy += (mdy / md) * push;
          }
        }

        // node bloom
        const r = n.r + Math.sin((t / 1000) + n.phase) * 0.4;
        ctx.fillStyle = 'rgba(150,170,255,0.95)';
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouseRef.current.x = -9999; mouseRef.current.y = -9999; };

    setSize();
    window.addEventListener('resize', setSize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [particles]);

  return <canvas className="ai-bg-canvas" ref={canvasRef} />;
}
