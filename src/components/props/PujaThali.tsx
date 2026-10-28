import { DiyaShape } from "./Diya";

/**
 * The Karwa Chauth puja thali, drawn around (0,0) = plate centre.
 * Diya, roli, rice, laddoo, a little brass kalash and the channi leaning at the back.
 */
export default function PujaThali({ glow = 1, withChanni = true }: { glow?: number; withChanni?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id="thali-gold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f3dc9e" />
          <stop offset="45%" stopColor="#c99d4f" />
          <stop offset="100%" stopColor="#7c5a23" />
        </linearGradient>
        <linearGradient id="thali-brass" x1="0" x2="1">
          <stop offset="0%" stopColor="#8a6428" />
          <stop offset="50%" stopColor="#e8c983" />
          <stop offset="100%" stopColor="#8a6428" />
        </linearGradient>
        <pattern id="thali-mesh" width="3" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 0 L3 3 M3 0 L0 3" stroke="#e9d3a1" strokeWidth="0.35" opacity="0.7" />
        </pattern>
      </defs>

      {withChanni && (
        <g transform="translate(28 -24) rotate(14)">
          <ellipse rx="13" ry="16" fill="url(#thali-mesh)" />
          <ellipse rx="13" ry="16" fill="none" stroke="url(#thali-brass)" strokeWidth="2.6" />
          <ellipse rx="10.5" ry="13.4" fill="none" stroke="#7c5a23" strokeWidth="0.6" />
        </g>
      )}

      {/* plate */}
      <ellipse cy="3" rx="44" ry="12" fill="#3b2410" opacity="0.6" />
      <ellipse rx="44" ry="12" fill="url(#thali-gold)" />
      <ellipse rx="36" ry="9" fill="#7a1a2c" />
      <ellipse rx="36" ry="9" fill="none" stroke="#e9c97e" strokeWidth="0.8" strokeDasharray="1.5 2.5" />
      <ellipse rx="44" ry="12" fill="none" stroke="#fff1c9" strokeWidth="0.7" opacity="0.6" />

      {/* rice */}
      {[
        [-20, 2],
        [-17, 4],
        [-22, 5],
        [-14, 1],
        [-18, -1],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.1" ry="0.6" fill="#f6eedf" />
      ))}
      {/* roli bowl */}
      <ellipse cx="-27" cy="-1" rx="6" ry="2.6" fill="url(#thali-brass)" />
      <ellipse cx="-27" cy="-2" rx="4.6" ry="1.6" fill="#c41e2a" />
      {/* laddoos */}
      <circle cx="4" cy="0" r="3.4" fill="#e7a43b" />
      <circle cx="9" cy="1" r="3.4" fill="#d9952f" />
      <circle cx="6.5" cy="-3.6" r="3.2" fill="#f0b54a" />
      {/* brass kalash */}
      <g transform="translate(20 -1)">
        <path d="M-6 0 Q-9 -8 -4 -12 L-3 -15 L3 -15 L4 -12 Q9 -8 6 0 Z" fill="url(#thali-brass)" />
        <ellipse cy="-15" rx="4.4" ry="1.3" fill="#f3dc9e" />
      </g>
      {/* diya — the light of the scene */}
      <DiyaShape x={-10} y={-2} scale={0.5} glow={glow * 1.4} delay={0.4} />
    </g>
  );
}
