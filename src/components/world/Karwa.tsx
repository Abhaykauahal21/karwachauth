/** The karwa — a painted clay pot with a spout, mauli tied at its neck. */
export default function Karwa({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden>
      <defs>
        <radialGradient id="karwa-body" cx="62%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#c56a3c" />
          <stop offset="55%" stopColor="#7e3420" />
          <stop offset="100%" stopColor="#2c120b" />
        </radialGradient>
      </defs>
      <ellipse cx="58" cy="124" rx="40" ry="5" fill="#000" opacity="0.4" />
      {/* spout */}
      <path d="M86 62 Q104 52 112 34 L116 36 Q110 58 92 74 Z" fill="#6d2c1a" />
      {/* body */}
      <path d="M30 40 Q8 62 14 92 Q22 122 58 124 Q94 122 102 92 Q108 62 86 40 Z" fill="url(#karwa-body)" />
      {/* neck + rim */}
      <path d="M36 26 L80 26 L86 40 L30 40 Z" fill="#8a3b22" />
      <ellipse cx="58" cy="26" rx="25" ry="6" fill="#a24c2a" />
      <ellipse cx="58" cy="26" rx="19" ry="3.5" fill="#2a100a" />
      {/* lid with little diya */}
      <ellipse cx="58" cy="22" rx="22" ry="5" fill="#9b4626" />
      {/* painted band */}
      <path d="M17 72 Q58 84 99 72" stroke="#f1dfb8" strokeWidth="2.4" fill="none" opacity="0.85" />
      <path d="M19 84 Q58 96 98 84" stroke="#d8b673" strokeWidth="1.6" fill="none" opacity="0.8" />
      {[24, 36, 48, 60, 72, 84, 94].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? 79 : 78} r="2" fill="#f6eedf" opacity="0.85" />
      ))}
      <path d="M40 54 q6 -8 12 0 q6 8 12 0 q6 -8 12 0" stroke="#f1dfb8" strokeWidth="1.6" fill="none" opacity="0.7" />
      {/* mauli thread */}
      <path d="M32 40 Q58 46 85 40" stroke="#c8202a" strokeWidth="2.4" fill="none" />
      <path d="M33 42 Q58 48 84 42" stroke="#e7b23a" strokeWidth="1.2" fill="none" />
      <path d="M36 43 q-3 10 -1 16" stroke="#c8202a" strokeWidth="1.6" fill="none" />
      {/* moonlight on the rim */}
      <path d="M28 52 Q20 70 22 92" stroke="#cfd6f5" strokeWidth="2" fill="none" opacity="0.25" />
    </svg>
  );
}
