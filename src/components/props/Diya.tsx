"use client";

import { useId } from "react";

/**
 * A clay diya as an SVG group, drawn around (0,0) = the base of the flame.
 * Usable inside any SVG (thali, rangoli) — see <Diya/> for standalone use.
 * The flame leans with `--wind`, which follows the viewer's pointer.
 */
export function DiyaShape({
  scale = 1,
  glow = 1,
  delay = 0,
  x = 0,
  y = 0,
}: {
  scale?: number;
  glow?: number;
  delay?: number;
  x?: number;
  y?: number;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <radialGradient id={`dg-${id}`}>
          <stop offset="0%" stopColor="#ffcf7a" stopOpacity={0.55 * glow} />
          <stop offset="35%" stopColor="#ff9f45" stopOpacity={0.2 * glow} />
          <stop offset="100%" stopColor="#ff8a30" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`dc-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#c0703f" />
          <stop offset="55%" stopColor="#7d3a1f" />
          <stop offset="100%" stopColor="#3b1a10" />
        </linearGradient>
        <linearGradient id={`df-${id}`} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor="#ff8a2a" />
          <stop offset="50%" stopColor="#ffc35c" />
          <stop offset="100%" stopColor="#fff3cf" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="-9" r="34"fill={`url(#dg-${id})`} />
      {/* clay bowl with a pinched spout */}
      <path d="M-14 0 Q-13 9 0 10 Q13 9 15 0 Q18 -1 20 -3 Q14 -1 10 -1 L-14 -1 Z" fill={`url(#dc-${id})`} />
      <path d="M-14 -0.5 Q0 2.5 14 -0.5" stroke="#e7a768" strokeWidth="0.8" fill="none" opacity="0.7" />
      <circle cx="-6" cy="5" r="0.9" fill="#f1c27d" opacity="0.6" />
      <circle cx="0" cy="6" r="0.9" fill="#f1c27d" opacity="0.6" />
      <circle cx="6" cy="5" r="0.9" fill="#f1c27d" opacity="0.6" />
      {/* wick + flame */}
      <g className="flame-wind">
        <g className="flame" style={{ animationDelay: `${delay}s` }}>
          <path d="M14 -2 C10 -6 9 -12 15 -22 C21 -12 19 -6 16 -2 Z" fill={`url(#df-${id})`} />
          <path d="M14.6 -2.5 C13 -5 13 -8 15 -13 C17 -8 17 -5 15.6 -2.5 Z" fill="#fffbe8" />
        </g>
      </g>
    </g>
  );
}

export default function Diya({
  size = 40,
  glow = 1,
  delay = 0,
  className = "",
  style,
}: {
  size?: number;
  glow?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="-40 -42 80 56"
      width={size}
      height={(size * 56) / 80}
      className={`overflow-visible ${className}`}
      style={style}
      aria-hidden
    >
      <DiyaShape glow={glow} delay={delay} />
    </svg>
  );
}
