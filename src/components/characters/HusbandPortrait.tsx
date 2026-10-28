/**
 * His face as she sees it through the channi: moon behind him, the diya in
 * her hands lighting him warmly from below. Kept soft — a focus pull, not a cartoon.
 */
export default function HusbandPortrait() {
  return (
    <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="hp-moonglow" cx="50%" cy="-8%" r="70%">
          <stop offset="0%" stopColor="#fbf6e9" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#9aa8dc" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#050914" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hp-skin" cx="50%" cy="95%" r="80%">
          <stop offset="0%" stopColor="#f0b98e" />
          <stop offset="45%" stopColor="#b97c5c" />
          <stop offset="100%" stopColor="#5b3a2e" />
        </radialGradient>
        <linearGradient id="hp-kurta" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#d9cfb9" />
          <stop offset="100%" stopColor="#f7dcb0" />
        </linearGradient>
        <radialGradient id="hp-warm" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#ffb766" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffb766" stopOpacity="0" />
        </radialGradient>
        <filter id="hp-soft">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>

      <rect width="300" height="300" fill="#060a18" />
      <rect width="300" height="300" fill="url(#hp-moonglow)" />

      <g filter="url(#hp-soft)">
        {/* shoulders, kurta, stole */}
        <path d="M24 300 C36 252 88 232 122 226 L178 226 C212 232 264 252 276 300 Z" fill="url(#hp-kurta)" />
        <path d="M58 300 C70 260 96 240 122 230 L134 236 C112 252 96 276 92 300 Z" fill="#6a1626" />
        <path d="M122 230 L134 236 C112 252 96 276 92 300" stroke="#d8b673" strokeWidth="3" fill="none" />
        <path d="M134 226 L150 246 L166 226" stroke="#c99d4f" strokeWidth="2" fill="none" />
        {/* neck */}
        <path d="M128 186 L172 186 L176 230 Q150 244 124 230 Z" fill="url(#hp-skin)" />
        {/* ears */}
        <ellipse cx="104" cy="140" rx="8" ry="15" fill="#8f5f48" />
        <ellipse cx="196" cy="140" rx="8" ry="15" fill="#8f5f48" />
        {/* face */}
        <path d="M150 70 C186 70 198 100 196 134 C194 170 176 200 150 204 C124 200 106 170 104 134 C102 100 114 70 150 70 Z" fill="url(#hp-skin)" />
        {/* beard shadow */}
        <path
          d="M108 150 C112 186 130 208 150 208 C170 208 188 186 192 150 C188 172 172 194 150 196 C128 194 112 172 108 150 Z"
          fill="#1a1216"
          opacity="0.5"
        />
        <path d="M134 168 Q150 160 166 168 Q150 165 134 168 Z" fill="#1a1216" opacity="0.75" />
        {/* soft smile */}
        <path d="M138 178 Q150 186 162 178" stroke="#5a2d28" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* nose */}
        <path d="M151 128 L147 156 Q151 160 156 157" stroke="#6e4535" strokeWidth="1.4" fill="none" opacity="0.7" strokeLinecap="round" />
        {/* eyes — looking at her */}
        <path d="M120 121 Q131 114 142 119" stroke="#141018" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M158 119 Q169 114 180 121" stroke="#141018" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <g className="blink">
          <path d="M123 133 Q132 127 141 133 Q132 138 123 133 Z" fill="#1a1014" />
          <path d="M159 133 Q168 127 177 133 Q168 138 159 133 Z" fill="#1a1014" />
          <circle cx="134" cy="132" r="1.1" fill="#fff" opacity="0.85" />
          <circle cx="170" cy="132" r="1.1" fill="#fff" opacity="0.85" />
        </g>
        {/* tilak */}
        <path d="M150 112 L150 100" stroke="#c8202a" strokeWidth="2.4" strokeLinecap="round" />
        {/* hair */}
        <path
          d="M104 128 C98 86 118 58 152 56 C186 58 204 86 196 128 C194 106 186 92 170 86 C150 94 128 92 112 100 C106 108 104 118 104 128 Z"
          fill="#141018"
        />
        {/* moonlight rim on hair and shoulders */}
        <path d="M108 96 C116 66 138 56 152 56 C170 57 188 68 194 92" stroke="#dfe6ff" strokeWidth="1.6" fill="none" opacity="0.55" />
        <path d="M40 270 C56 246 92 232 122 226" stroke="#dfe6ff" strokeWidth="1.4" fill="none" opacity="0.35" />
        <path d="M260 270 C244 246 208 232 178 226" stroke="#dfe6ff" strokeWidth="1.4" fill="none" opacity="0.35" />
      </g>
      <rect width="300" height="300" fill="url(#hp-warm)" />
    </svg>
  );
}
