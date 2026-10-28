"use client";

import { useEffect, useRef } from "react";

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  decay: number;
  kind: "dust" | "spark" | "heart";
  hue: string;
};

export const BURST_EVENT = "kc-burst";

/** Fire a tiny golden burst from anywhere: burst(x, y) in client px. */
export function burst(x: number, y: number) {
  window.dispatchEvent(new CustomEvent(BURST_EVENT, { detail: { x, y } }));
}

function heartPath(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y, x - s * 0.5, y - s * 0.1, x - s * 0.5, y + s * 0.25);
  ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.75, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.75, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.25);
  ctx.bezierCurveTo(x + s * 0.5, y - s * 0.1, x, y, x, y + s * 0.3);
  ctx.fill();
}

/**
 * Golden dust drifting through the night, sparks from the aarti diya,
 * tap bursts — and, only at the emotional moments, a few soft hearts.
 */
export default function FloatingParticles({
  density = 1,
  hearts = false,
  sparks = false,
}: {
  density?: number;
  hearts?: boolean;
  sparks?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const opts = useRef({ density, hearts, sparks });

  useEffect(() => {
    opts.current = { density, hearts, sparks };
  }, [density, hearts, sparks]);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let heartClock = 0;
    let sparkClock = 0;
    const ps: P[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };

    const dust = (): P => ({
      x: Math.random() * w,
      y: h * (0.2 + Math.random() * 0.9),
      vx: (Math.random() - 0.5) * 0.12,
      vy: -0.05 - Math.random() * 0.14,
      r: 0.5 + Math.random() * 1.3,
      life: 0.01,
      decay: -(0.002 + Math.random() * 0.003),
      kind: "dust",
      hue: Math.random() < 0.7 ? "233,211,161" : "255,240,220",
    });

    const onBurst = (e: Event) => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      const rect = canvas.getBoundingClientRect();
      const n = reduced ? 4 : 14;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.4 + Math.random() * 1.4;
        ps.push({
          x: x - rect.left,
          y: y - rect.top,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.4,
          r: 0.6 + Math.random() * 1.4,
          life: 1,
          decay: 0.012 + Math.random() * 0.012,
          kind: "spark",
          hue: Math.random() < 0.5 ? "243,226,181" : "255,196,120",
        });
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(48, now - last) / 16.67;
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const o = opts.current;

      const targetDust = Math.round((reduced ? 10 : 34) * o.density * Math.min(1.4, w / 700 + 0.5));
      const dustCount = ps.filter((p) => p.kind === "dust").length;
      if (dustCount < targetDust && Math.random() < 0.3) ps.push(dust());

      if (o.hearts && !reduced) {
        heartClock -= dt;
        if (heartClock <= 0) {
          heartClock = 26 + Math.random() * 30;
          ps.push({
            x: w * (0.3 + Math.random() * 0.4),
            y: h * (0.75 + Math.random() * 0.15),
            vx: (Math.random() - 0.5) * 0.25,
            vy: -0.45 - Math.random() * 0.35,
            r: 6 + Math.random() * 7,
            life: 1,
            decay: 0.0042 + Math.random() * 0.002,
            kind: "heart",
            hue: Math.random() < 0.5 ? "214,150,150" : "233,200,150",
          });
        }
      }

      if (o.sparks && !reduced) {
        sparkClock -= dt;
        if (sparkClock <= 0) {
          sparkClock = 3 + Math.random() * 5;
          ps.push({
            x: w * 0.5 + (Math.random() - 0.5) * w * 0.12,
            y: h * 0.66,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -0.6 - Math.random() * 0.9,
            r: 0.6 + Math.random() * 1.1,
            life: 1,
            decay: 0.008 + Math.random() * 0.01,
            kind: "spark",
            hue: "255,190,110",
          });
        }
      }

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.x += p.vx * dt + (p.kind === "heart" ? Math.sin(now / 900 + p.r) * 0.25 : 0);
        p.y += p.vy * dt;
        if (p.kind === "spark") {
          p.vx *= 0.985;
          p.vy = p.vy * 0.985 - 0.004;
        }
        if (p.kind === "dust") {
          // fade in, then out
          p.life = Math.min(1, p.life - p.decay * dt);
          if (p.life >= 1) p.decay = 0.002 + Math.random() * 0.002;
        } else p.life -= p.decay * dt;
        if (p.life <= 0 || p.y < -30 || p.x < -30 || p.x > w + 30) {
          ps.splice(i, 1);
          continue;
        }
        const a = Math.max(0, Math.min(1, p.life));
        if (p.kind === "heart") {
          ctx.globalAlpha = a * 0.55;
          ctx.fillStyle = `rgba(${p.hue},1)`;
          ctx.shadowColor = `rgba(${p.hue},0.8)`;
          ctx.shadowBlur = 12;
          heartPath(ctx, p.x, p.y, p.r);
          ctx.shadowBlur = 0;
        } else {
          ctx.globalAlpha = a * (p.kind === "dust" ? 0.55 : 0.95);
          ctx.fillStyle = `rgb(${p.hue})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = a * 0.12;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener(BURST_EVENT, onBurst);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener(BURST_EVENT, onBurst);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}
