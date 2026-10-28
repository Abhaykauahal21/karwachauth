"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useId, useRef } from "react";

/**
 * The storyteller of the film. A soft, slightly textured moon with an
 * atmospheric halo that warms when a finger comes near it.
 */
export default function Moon({ glow = 1, className = "" }: { glow?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const near = useMotionValue(0);
  const nearS = useSpring(near, { stiffness: 40, damping: 18 });
  const haloOpacity = useTransform(nearS, (v) => (0.75 + v * 0.25) * glow);
  const haloScale = useTransform(nearS, (v) => 1 + v * 0.06);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy);
        near.set(Math.max(0, 1 - d / (r.width * 2.2)));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [near]);

  return (
    <div ref={ref} className={`relative aspect-square ${className}`}>
      {/* wide atmospheric halo */}
      <motion.div
        className="pointer-events-none absolute -inset-[160%] rounded-full"
        style={{
          opacity: haloOpacity,
          scale: haloScale,
          background:
            "radial-gradient(circle, rgba(250,240,215,0.22) 0%, rgba(214,222,255,0.10) 22%, rgba(120,140,210,0.05) 42%, transparent 66%)",
        }}
      />
      {/* tight glow */}
      <div
        className="glow-pulse pointer-events-none absolute -inset-[38%] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,250,235,0.55) 30%, rgba(255,244,214,0.16) 52%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
      {/* the disc */}
      <motion.svg
        viewBox="0 0 200 200"
        className="relative h-full w-full"
        animate={{ rotate: [0, 3, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <radialGradient id={`moon-disc-${uid}`} cx="42%" cy="40%" r="62%">
            <stop offset="0%" stopColor="#fffdf6" />
            <stop offset="60%" stopColor="#f7efda" />
            <stop offset="88%" stopColor="#e9dcbc" />
            <stop offset="100%" stopColor="#d9c9a3" />
          </radialGradient>
          <filter id={`moon-soft-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
          <filter id={`moon-grain-${uid}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
            <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.42  0 0 0 0.18 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <clipPath id={`moon-clip-${uid}`}>
            <circle cx="100" cy="100" r="96" />
          </clipPath>
        </defs>
        <circle cx="100" cy="100" r="96" fill={`url(#moon-disc-${uid})`} />
        <g clipPath={`url(#moon-clip-${uid})`} filter={`url(#moon-soft-${uid})`} fill="#b9a983" opacity="0.32">
          <ellipse cx="72" cy="70" rx="26" ry="20" />
          <ellipse cx="108" cy="62" rx="18" ry="13" />
          <ellipse cx="128" cy="96" rx="22" ry="26" />
          <ellipse cx="86" cy="112" rx="16" ry="12" />
          <ellipse cx="110" cy="140" rx="12" ry="9" />
          <ellipse cx="58" cy="104" rx="9" ry="14" />
        </g>
        <g clipPath={`url(#moon-clip-${uid})`} fill="#a8977a" opacity="0.18">
          <circle cx="132" cy="150" r="5" />
          <circle cx="62" cy="142" r="3" />
          <circle cx="148" cy="70" r="3.5" />
        </g>
        <circle cx="100" cy="100" r="96" filter={`url(#moon-grain-${uid})`} fill="#fff" />
      </motion.svg>
    </div>
  );
}
