import type { WifePose } from "@/lib/scenes";
import PujaThali from "@/components/props/PujaThali";
import Pivot from "./Pivot";

/**
 * The wife — the heroine of the film. Drawn in profile facing right, in a
 * maroon saree with a gold zari border, a red chunri over her head, jhumkas,
 * nath, maang tikka, mangalsutra, a stack of bangles and mehendi.
 * Local coordinates: head top ≈ y 32, feet at y 552.
 */

const HEAD: Record<WifePose, number> = { moon: -14, husband: 0, aarti: -3, blessed: 12, lean: 9 };
const ARM: Record<WifePose, number> = { moon: 0, husband: 0, aarti: 0, blessed: 18, lean: 30 };

// bangles along the forearm (elbow 110,204 → wrist 150,218)
const BANGLES = [0.6, 0.66, 0.72, 0.78, 0.84, 0.9].map((t, i) => {
  const ex = 110,
    ey = 204,
    wx = 150,
    wy = 218;
  const x = ex + (wx - ex) * t;
  const y = ey + (wy - ey) * t;
  const len = Math.hypot(wx - ex, wy - ey);
  const px = -(wy - ey) / len;
  const py = (wx - ex) / len;
  const r = 7.2;
  const k = (v: number) => Math.round(v * 100) / 100;
  return { x1: k(x - px * r), y1: k(y - py * r), x2: k(x + px * r), y2: k(y + py * r), c: i % 3 === 1 ? "#e8c26a" : "#b3122a" };
});

export default function WifeCharacter({ pose, warmth = 0.6 }: { pose: WifePose; warmth?: number }) {
  return (
    <g>
      <defs>
        <linearGradient id="w-skin" x1="0" x2="1">
          <stop offset="0%" stopColor="#7d5040" />
          <stop offset="60%" stopColor="#b98062" />
          <stop offset="100%" stopColor="#dca581" />
        </linearGradient>
        <linearGradient id="w-saree" x1="0" x2="1">
          <stop offset="0%" stopColor="#3a0b16" />
          <stop offset="55%" stopColor="#651526" />
          <stop offset="100%" stopColor="#8a2234" />
        </linearGradient>
        <linearGradient id="w-chunri" x1="0" x2="1">
          <stop offset="0%" stopColor="#4a0d18" />
          <stop offset="100%" stopColor="#9a2433" />
        </linearGradient>
        <linearGradient id="w-gold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f4dea4" />
          <stop offset="50%" stopColor="#c99d4f" />
          <stop offset="100%" stopColor="#f0d48e" />
        </linearGradient>
        <pattern id="w-booti" width="14" height="16" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.1" fill="#e9c97e" opacity="0.7" />
          <circle cx="11" cy="12" r="0.9" fill="#e9c97e" opacity="0.55" />
        </pattern>
        <radialGradient id="w-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb766" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#ff9a3c" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ff9a3c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── chunri falling down her back — sways in the night wind ── */}
      <g className="sway">
        <path
          d="M66 60 C58 100 50 150 46 220 C42 300 36 360 32 432 C48 442 66 440 80 432 C82 360 86 290 92 200 C94 160 92 140 90 120 Z"
          fill="url(#w-chunri)"
        />
        <path
          d="M66 60 C58 100 50 150 46 220 C42 300 36 360 32 432 C48 442 66 440 80 432 C82 360 86 290 92 200 C94 160 92 140 90 120 Z"
          fill="url(#w-booti)"
        />
        <path
          d="M66 60 C58 100 50 150 46 220 C42 300 36 360 32 432 C48 442 66 440 80 432"
          stroke="url(#w-gold)"
          strokeWidth="4"
          fill="none"
        />
        {/* tassels */}
        {[38, 50, 62, 74].map((x, i) => (
          <line key={x} x1={x} y1={436 + (i % 2)} x2={x - 1} y2={448} stroke="#e9c97e" strokeWidth="1.4" className="swing" />
        ))}
      </g>

      {/* ── saree skirt with pleats and zari hem ── */}
      <path d="M80 234 L132 234 C140 300 150 420 160 552 L46 552 C56 420 70 300 80 234 Z" fill="url(#w-saree)" />
      {[
        [116, 248, 128, 552],
        [124, 246, 142, 552],
        [132, 246, 154, 552],
      ].map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M${x1} ${y1} Q${(x1 + x2) / 2 + 2} ${(y1 + y2) / 2} ${x2} ${y2}`} stroke="#e1b968" strokeOpacity="0.5" strokeWidth="1" fill="none" />
      ))}
      <path d="M48 530 L159 530 L160 552 L46 552 Z" fill="url(#w-gold)" opacity="0.9" />
      <path d="M50 520 L158 520" stroke="#e1b968" strokeWidth="1.6" opacity="0.7" />
      <path d="M48 536 L159 536" stroke="#7a1a2c" strokeWidth="1.4" strokeDasharray="3 3" />
      {/* feet with alta and payal */}
      <path d="M140 552 Q152 546 166 551 Q166 555 140 555 Z" fill="url(#w-skin)" />
      <path d="M140 554.5 L166 554" stroke="#b3122a" strokeWidth="1.4" />

      {/* ── torso (breathes) ── */}
      <g className="breathe">
        <path d="M86 204 L122 202 C124 214 126 226 130 238 L82 238 C82 226 84 214 86 204 Z" fill="url(#w-skin)" />
        <path d="M86 134 C98 128 110 130 116 134 C126 142 132 160 132 176 C132 190 126 198 122 204 L86 206 C82 180 82 156 86 134 Z" fill="#4e0f1d" />
        <path d="M86 206 L122 204" stroke="url(#w-gold)" strokeWidth="2" />
        {/* pallu across the chest */}
        <path d="M84 132 C96 127 104 131 110 136 C118 170 128 210 142 248 L112 252 C104 214 92 176 84 132 Z" fill="url(#w-saree)" />
        <path d="M110 136 C118 170 128 210 142 248" stroke="url(#w-gold)" strokeWidth="3.2" fill="none" />
        <path d="M84 132 C92 176 104 214 112 252" stroke="url(#w-gold)" strokeWidth="1.6" fill="none" opacity="0.8" />
        <path d="M84 132 C96 127 104 131 110 136 C118 170 128 210 142 248 L112 252 C104 214 92 176 84 132 Z" fill="url(#w-booti)" />
        {/* mangalsutra */}
        <path d="M100 128 Q104 146 116 150" stroke="#121016" strokeWidth="1.6" fill="none" strokeDasharray="1.4 1.2" />
        <path d="M113 149 l3 -2 l3 2 l-3 5 z" fill="#e8c26a" />
      </g>

      {/* ── head and neck ── */}
      <Pivot x={98} y={124} rotate={HEAD[pose]} dur={2.6}>
        {/* neck + face */}
        <path
          d="M96 46 C108 44 117 50 119 60 C120 64 119 66 121 69 C123 73 125 77 127 80 C128 82 126 84 123 84 C123 86 124 87 123.5 88.5 C122.5 89.5 121 89.5 122 91 C123 93 121 95 119.5 95.5 C119.5 98 119 101 116 103 C112 106 106 106 103 105 L104 118 C104 124 106 128 110 133 L86 135 C88 124 88 116 86 108 C80 100 78 80 82 62 C86 50 90 47 96 46 Z"
          fill="url(#w-skin)"
        />
        {/* soft cheek light from the diya */}
        <ellipse cx="114" cy="86" rx="8" ry="6" fill="#ffb380" opacity={0.18 + warmth * 0.15} />
        {/* lips */}
        <path d="M123.5 88.6 C122.5 89.6 121.4 89.8 122 91 C123 93 121.4 94.8 119.8 95.2 C120.6 93.4 120.4 90.4 123.5 88.6 Z" fill="#8f2f3a" opacity="0.8" />
        {/* hair at the parting, sindoor */}
        <path d="M96 46 C106 44 114 47 118 52 C110 50 100 50 92 54 Z" fill="#120d12" />
        <path d="M104 46.5 L110 47.5" stroke="#d01e2e" strokeWidth="2" strokeLinecap="round" />
        {/* brow, eye (blinks), bindi */}
        <path d="M108 63.5 Q113 60.8 119 62.8" stroke="#1a1014" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <g className="blink">
          <path d="M110 69.5 Q113.5 67.2 117.4 69.4 Q113.5 71.6 110 69.5 Z" fill="#1a1014" />
          <path d="M108.6 69 Q112 66 117.8 68.6" stroke="#0d0a0c" strokeWidth="1" fill="none" />
          <circle cx="115" cy="69.3" r="0.5" fill="#fff" opacity="0.8" />
        </g>
        <circle cx="119.6" cy="62.2" r="1.5" fill="#b3122a" />
        {/* nath */}
        <circle cx="123.4" cy="86" r="4.2" fill="none" stroke="url(#w-gold)" strokeWidth="1" />
        <circle cx="121" cy="90" r="0.9" fill="#f6eedf" />

        {/* chunri over the head */}
        <path
          d="M118 50 C116 40 104 30 90 32 C74 34 66 48 66 66 C66 84 62 104 58 126 L96 136 C90 118 89 100 92 84 C95 70 104 58 118 50 Z"
          fill="url(#w-chunri)"
        />
        <path
          d="M118 50 C116 40 104 30 90 32 C74 34 66 48 66 66 C66 84 62 104 58 126 L96 136 C90 118 89 100 92 84 C95 70 104 58 118 50 Z"
          fill="url(#w-booti)"
        />
        <path d="M118 50 C104 58 95 70 92 84 C89 100 90 118 96 136" stroke="url(#w-gold)" strokeWidth="3.4" fill="none" />
        <path d="M114 49 C102 57 93 70 90 84" stroke="#f6e0a8" strokeWidth="0.8" fill="none" opacity="0.7" />
        {/* maang tikka peeking below the chunri */}
        <path d="M112 49 L113 54" stroke="#e8c26a" strokeWidth="0.8" />
        <circle cx="113.2" cy="55.5" r="2" fill="url(#w-gold)" />
        <circle cx="113.2" cy="55.5" r="0.8" fill="#b3122a" />
        {/* jhumka */}
        <g transform="translate(94 96)">
          <g className="swing">
            <path d="M0 0 L0 3" stroke="#e8c26a" strokeWidth="1" />
            <path d="M-5 9 Q0 1 5 9 Z" fill="url(#w-gold)" />
            {[-4, -2, 0, 2, 4].map((x) => (
              <circle key={x} cx={x} cy={10.6} r="0.9" fill="#f6e0a8" />
            ))}
          </g>
        </g>
      </Pivot>

      {/* ── near arm holding the thali ── */}
      <Pivot x={104} y={142} rotate={ARM[pose]} dur={2.4} className={pose === "aarti" ? "aarti-circle" : undefined}>
        <path d="M104 142 L110 204" stroke="url(#w-skin)" strokeWidth="14" strokeLinecap="round" />
        <path d="M104 140 L106 166" stroke="#4e0f1d" strokeWidth="17" strokeLinecap="round" />
        <path d="M98 166 L114 166" stroke="url(#w-gold)" strokeWidth="2" />
        <path d="M110 204 L150 218" stroke="#c48a69" strokeWidth="11" strokeLinecap="round" />
        {BANGLES.map((b, i) => (
          <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke={b.c} strokeWidth="2.6" strokeLinecap="round" />
        ))}
        <line x1={BANGLES[2].x1} y1={BANGLES[2].y1} x2={BANGLES[2].x2} y2={BANGLES[2].y2} stroke="#fff1c9" strokeWidth="0.6" className="shimmer" />
        {/* thali */}
        <g transform="translate(180 212)">
          <PujaThali glow={warmth} />
        </g>
        {/* hand under the rim, with mehendi */}
        <path d="M146 214 Q156 210 164 216 Q160 224 148 224 Z" fill="#c48a69" />
        <path d="M150 218 q3 -2 6 0 M151 221 q3 -1.6 6 0" stroke="#7a2a12" strokeWidth="0.7" fill="none" opacity="0.8" />
        {/* far hand at the back rim */}
        <path d="M206 206 Q214 203 220 208 Q216 212 208 211 Z" fill="#9c6a52" />
        {/* the diya light on her face and hands */}
        <circle cx="172" cy="206" r="70" fill="url(#w-warm)" opacity={warmth} pointerEvents="none" />
      </Pivot>
    </g>
  );
}
