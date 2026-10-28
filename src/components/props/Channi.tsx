"use client";

import { useId } from "react";

const r2 = (v: number) => Math.round(v * 100) / 100;

/**
 * The channi (sieve) through which she sees the moon — and then him.
 * Whatever is passed as children is seen *through* the mesh.
 */
export default function Channi({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`relative aspect-square ${className}`}>
      {/* the view through the sieve */}
      <div className="absolute inset-[9%] overflow-hidden rounded-full bg-[#050914]">{children}</div>

      {/* mesh + rim */}
      <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id={`mesh-${id}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0 H7 M0 0 V7" stroke="#e9d3a1" strokeWidth="0.55" />
          </pattern>
          <radialGradient id={`meshfade-${id}`}>
            <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
            <stop offset="85%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.85" />
          </radialGradient>
          <mask id={`meshmask-${id}`}>
            <circle cx="200" cy="200" r="164" fill={`url(#meshfade-${id})`} />
          </mask>
          <linearGradient id={`rim-${id}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f6e2a8" />
            <stop offset="35%" stopColor="#b88a3e" />
            <stop offset="60%" stopColor="#f1d595" />
            <stop offset="100%" stopColor="#6e4e1c" />
          </linearGradient>
          <radialGradient id={`vignette-${id}`}>
            <stop offset="70%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="164" fill={`url(#vignette-${id})`} />
        <circle cx="200" cy="200" r="164" fill={`url(#mesh-${id})`} mask={`url(#meshmask-${id})`} />
        {/* rim */}
        <circle cx="200" cy="200" r="176" fill="none" stroke={`url(#rim-${id})`} strokeWidth="22" />
        <circle cx="200" cy="200" r="187" fill="none" stroke="#f3dfa9" strokeWidth="1.4" opacity="0.8" />
        <circle cx="200" cy="200" r="165" fill="none" stroke="#5b3f15" strokeWidth="2" />
        {/* engraved dots & a red-gold mauli wrap */}
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * Math.PI * 2;
          return (
            <circle key={i} cx={r2(200 + Math.cos(a) * 176)} cy={r2(200 + Math.sin(a) * 176)} r="2.2" fill="#fff4d0" opacity="0.75" />
          );
        })}
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M ${r2(200 + Math.cos(2.1 + i * 0.05) * 160)} ${r2(200 + Math.sin(2.1 + i * 0.05) * 160)} L ${r2(200 + Math.cos(2.1 + i * 0.05) * 192)} ${r2(200 + Math.sin(2.1 + i * 0.05) * 192)}`}
            stroke={i % 2 ? "#e7b23a" : "#c8202a"}
            strokeWidth="3"
          />
        ))}
        {/* specular */}
        <path d="M74 120 A150 150 0 0 1 150 44" stroke="#fffbe9" strokeWidth="3" fill="none" opacity="0.55" strokeLinecap="round" />
      </svg>
    </div>
  );
}
