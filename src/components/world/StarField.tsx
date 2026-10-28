"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
  ph: number;
  born: number;
  warm: boolean;
};

type Shooter = { x: number; y: number; vx: number; vy: number; life: number };

/**
 * Canvas star field. Stars are "born" one by one when the film begins,
 * twinkle on their own clock, and lean gently toward the viewer's finger.
 */
export default function StarField({
  brightness,
  shootKey,
  started,
}: {
  brightness: number;
  /** change this value to send one shooting star across the sky */
  shootKey?: number;
  started: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bright = useRef(brightness);
  const startedAt = useRef<number | null>(null);
  const shooters = useRef<Shooter[]>([]);

  useEffect(() => {
    bright.current = brightness;
  }, [brightness]);

  useEffect(() => {
    if (started && startedAt.current === null) startedAt.current = performance.now();
  }, [started]);

  useEffect(() => {
    if (!shootKey) return;
    shooters.current.push({
      x: 0.25 + Math.random() * 0.35,
      y: 0.05 + Math.random() * 0.15,
      vx: 0.0085,
      vy: 0.0032,
      life: 1,
    });
  }, [shootKey]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let raf = 0;
    let shown = 0;
    const pointer = { x: -9999, y: -9999 };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const count = Math.round(Math.min(340, (w * h) / 5200));
      stars = Array.from({ length: count }, () => {
        const r = Math.pow(Math.random(), 3.2) * 1.5 + 0.25;
        return {
          x: Math.random(),
          y: Math.pow(Math.random(), 1.35), // denser toward the top
          r,
          a: 0.35 + Math.random() * 0.65,
          tw: 0.4 + Math.random() * 1.6,
          ph: Math.random() * Math.PI * 2,
          born: Math.random() * 7000 + (r > 1.2 ? 0 : 1200),
          warm: Math.random() < 0.18,
        };
      });
      // the brightest few appear first, like the first stars of the evening
      stars.sort((a, b) => b.r - a.r).forEach((s, i) => (s.born = i < 12 ? 400 + i * 380 : s.born + 2600));
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      shown += (bright.current - shown) * 0.03;
      const t0 = startedAt.current;
      const age = t0 === null ? -1 : now - t0;
      if (age < 0 && !reduced) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const t = now / 1000;
      for (const s of stars) {
        const birth = reduced ? 1 : Math.min(1, Math.max(0, (age - s.born) / 1600));
        if (birth <= 0) continue;
        const tw = reduced ? 1 : 0.62 + 0.38 * Math.sin(t * s.tw + s.ph);
        let x = s.x * w;
        let y = s.y * h;
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const d2 = dx * dx + dy * dy;
        let boost = 0;
        if (d2 < 22000) {
          const k = 1 - d2 / 22000;
          boost = k * 0.6;
          x += (dx / 60) * k;
          y += (dy / 60) * k;
        }
        const alpha = Math.min(1, s.a * tw * birth * shown + boost * birth);
        if (alpha < 0.01) continue;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.warm ? "#ffe9c2" : "#eef2ff";
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.25) {
          ctx.globalAlpha = alpha * 0.18;
          ctx.beginPath();
          ctx.arc(x, y, s.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const sh of shooters.current) {
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= 0.012;
        const x = sh.x * w;
        const y = sh.y * h;
        const grad = ctx.createLinearGradient(x, y, x - sh.vx * w * 18, y - sh.vy * h * 18);
        grad.addColorStop(0, `rgba(255,248,230,${0.9 * sh.life})`);
        grad.addColorStop(1, "rgba(255,248,230,0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - sh.vx * w * 18, y - sh.vy * h * 18);
        ctx.stroke();
      }
      shooters.current = shooters.current.filter((s) => s.life > 0);
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    build();
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
