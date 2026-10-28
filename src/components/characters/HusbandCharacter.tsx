import type { HusbandPose } from "@/lib/scenes";
import Pivot from "./Pivot";

/**
 * The husband — in profile facing left: ivory kurta with gold buttons,
 * a maroon stole with zari border (matching her saree), churidar and mojari.
 * Local coordinates: head top ≈ y 22, feet at y 572.
 *
 * Rendered in two parts so his near arm can pass in front of her:
 *   <HusbandBody/> behind the wife, <HusbandArm/> in front.
 */

const HEAD: Record<HusbandPose, number> = { away: 0, look: 0, bless: 7, together: 9 };
const UPPER: Record<HusbandPose, number> = { away: 0, look: 4, bless: 115, together: 46 };
const FORE: Record<HusbandPose, number> = { away: 0, look: -6, bless: 10, together: 14 };

export function HusbandDefs() {
  return (
    <defs>
      <linearGradient id="h-skin" x1="0" x2="1">
        <stop offset="0%" stopColor="#d29b77" />
        <stop offset="45%" stopColor="#ad7658" />
        <stop offset="100%" stopColor="#6e4535" />
      </linearGradient>
      <linearGradient id="h-kurta" x1="0" x2="1">
        <stop offset="0%" stopColor="#f3e9d4" />
        <stop offset="55%" stopColor="#cfc4ad" />
        <stop offset="100%" stopColor="#8d8573" />
      </linearGradient>
      <linearGradient id="h-churidar" x1="0" x2="1">
        <stop offset="0%" stopColor="#e2d7bf" />
        <stop offset="100%" stopColor="#857d6b" />
      </linearGradient>
      <linearGradient id="h-stole" x1="0" x2="1">
        <stop offset="0%" stopColor="#8a2234" />
        <stop offset="100%" stopColor="#3a0b16" />
      </linearGradient>
      <linearGradient id="h-gold" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#f4dea4" />
        <stop offset="50%" stopColor="#c99d4f" />
        <stop offset="100%" stopColor="#f0d48e" />
      </linearGradient>
    </defs>
  );
}

export function HusbandBody({ pose }: { pose: HusbandPose }) {
  return (
    <g>
      {/* legs — churidar gathered at the ankle, gold mojari */}
      <path d="M96 388 L118 388 L116 556 L102 556 Z" fill="url(#h-churidar)" />
      <path d="M122 388 L144 388 L140 558 L126 558 Z" fill="url(#h-churidar)" opacity="0.85" />
      {[520, 528, 536, 544].map((y) => (
        <path key={y} d={`M102 ${y} q7 3 14 0`} stroke="#9a917d" strokeWidth="0.8" fill="none" />
      ))}
      <path d="M100 556 L118 556 L118 570 L88 570 Q80 568 76 562 Q86 562 100 556 Z" fill="#a37d3c" />
      <path d="M124 558 L142 558 L142 572 L112 572 Q104 570 102 565 Q112 565 124 558 Z" fill="#7e5f2c" />
      <path d="M84 566 L116 566" stroke="#f0d48e" strokeWidth="1" opacity="0.7" />

      {/* kurta (breathes) */}
      <g className="breathe">
        <path
          d="M98 130 C88 138 84 160 84 200 L86 300 C86 340 84 370 82 394 L152 396 C152 360 150 320 148 280 L150 200 C152 170 150 146 138 132 Z"
          fill="url(#h-kurta)"
        />
        {/* side slit + hem embroidery */}
        <path d="M82 394 L152 396" stroke="url(#h-gold)" strokeWidth="2.4" />
        <path d="M84 386 L151 388" stroke="#c99d4f" strokeWidth="0.8" strokeDasharray="2 2" />
        <path d="M128 330 L130 396" stroke="#8d8573" strokeWidth="1" />
        {/* placket with buttons */}
        <path d="M95 134 L90 214" stroke="#d8c8a6" strokeWidth="5" />
        {[146, 162, 178, 194].map((y, i) => (
          <circle key={y} cx={94 - i * 0.9} cy={y} r="1.7" fill="url(#h-gold)" />
        ))}
        {/* collar */}
        <path d="M96 128 L120 130 L118 138 L94 136 Z" fill="#e8dcc0" />
        <path d="M94 136 L118 138" stroke="url(#h-gold)" strokeWidth="1.2" />
        {/* stole draped over the shoulder */}
        <path d="M112 130 C130 128 142 134 146 146 L150 330 L128 336 L124 160 C120 146 116 138 112 130 Z" fill="url(#h-stole)" />
        <path d="M128 336 L150 330" stroke="url(#h-gold)" strokeWidth="4" />
        <path d="M124 160 L128 336" stroke="url(#h-gold)" strokeWidth="2.2" />
        <path d="M146 146 L150 330" stroke="url(#h-gold)" strokeWidth="1.4" opacity="0.7" />
        {[132, 138, 144].map((x) => (
          <line key={x} x1={x} y1={336} x2={x + 1} y2={346} stroke="#e9c97e" strokeWidth="1.2" />
        ))}
        {/* back arm, mostly hidden */}
        <path d="M144 150 L150 250 L146 300" stroke="#a9a08f" strokeWidth="15" strokeLinecap="round" fill="none" />
      </g>

      {/* head */}
      <Pivot x={104} y={124} rotate={HEAD[pose]} dur={2.6}>
        <path
          d="M112 30 C98 30 90 38 88 50 C87 55 88 58 86 61 C83 66 80 71 78 75 C77 77 79 79 82 79 C82 81 81 82 82 84 C83 85 84 85 83 86.5 C82 88 83 90 85 91 C85 95 85 98 88 101 C92 105 100 106 106 104 L104 118 C104 124 102 128 98 132 L126 134 C124 122 124 112 128 104 C134 92 136 70 132 54 C128 38 120 30 112 30 Z"
          fill="url(#h-skin)"
        />
        {/* trimmed beard + moustache */}
        <path
          d="M114 80 C112 90 106 100 96 102 C90 102 87 99 86 94 C88 96 92 97 96 96 C104 93 108 86 110 78 Z"
          fill="#1a1216"
          opacity="0.55"
        />
        <path d="M80.5 80.5 Q83 79.5 86 81.5" stroke="#1a1216" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.8" />
        {/* a slight smile */}
        <path d="M82.5 85.6 Q84.6 86.2 86.4 84.8" stroke="#5a2d28" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        {/* hair */}
        <path
          d="M88 48 C88 34 102 22 118 23 C134 25 141 42 139 60 C138 76 134 90 128 100 L122 98 C124 88 122 78 118 72 L114 73 L112 58 C104 54 96 51 88 52 Z"
          fill="#141018"
        />
        <path d="M92 40 C100 30 112 27 124 30" stroke="#3b3442" strokeWidth="1.2" fill="none" opacity="0.6" />
        {/* ear */}
        <path d="M118 68 C124 68 125 80 119 84 C117 80 116 74 118 68 Z" fill="#9c6a52" />
        {/* brow + eye (blinks) */}
        <path d="M96 54 Q90 52 86.5 55" stroke="#141018" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <g className="blink blink-late">
          <path d="M94 61 Q90.5 59 87 61 Q90.5 63 94 61 Z" fill="#141018" />
          <circle cx="89.5" cy="61" r="0.5" fill="#fff" opacity="0.7" />
        </g>
        {/* tilak */}
        <path d="M87.6 52 L87.4 47" stroke="#c8202a" strokeWidth="1.6" strokeLinecap="round" />
      </Pivot>
    </g>
  );
}

/** His near arm, two joints, drawn in front of her so it can bless and hold. */
export function HusbandArm({ pose }: { pose: HusbandPose }) {
  return (
    <Pivot x={102} y={146} rotate={UPPER[pose]} dur={2.8}>
      <path d="M102 146 L98 230" stroke="url(#h-kurta)" strokeWidth="19" strokeLinecap="round" />
      <Pivot x={98} y={230} rotate={FORE[pose]} dur={2.8}>
        <path d="M98 230 L96 296" stroke="url(#h-kurta)" strokeWidth="16" strokeLinecap="round" />
        <path d="M89 292 L104 293" stroke="url(#h-gold)" strokeWidth="1.6" />
        {/* kalava on the wrist */}
        <path d="M90 299 L103 300" stroke="#c8202a" strokeWidth="1.6" />
        <path d="M89 300 Q96 324 100 300 Z" fill="url(#h-skin)" />
        <ellipse cx="96" cy="310" rx="6.5" ry="12" fill="url(#h-skin)" />
      </Pivot>
    </Pivot>
  );
}
