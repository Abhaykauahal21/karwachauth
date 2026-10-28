import { DiyaShape } from "@/components/props/Diya";

const ring = (n: number, r: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const round = (v: number) => Math.round(v * 100) / 100;
    return { x: round(Math.cos(a) * r), y: round(Math.sin(a) * r), deg: round((a * 180) / Math.PI) };
  });

/** A floor rangoli seen in perspective, ringed with four small diyas. */
export default function Rangoli({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <svg viewBox="-200 -80 400 160" className="h-auto w-full overflow-visible">
        <defs>
          <radialGradient id="rg-floorglow">
            <stop offset="0%" stopColor="#ffb760" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffb760" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform="scale(1 0.34)">
        <circle r="198" fill="url(#rg-floorglow)" />
        <circle r="170" fill="none" stroke="#d8b673" strokeOpacity="0.55" strokeWidth="5" strokeDasharray="2 9" strokeLinecap="round" />
        {ring(24, 150).map((p, i) => (
          <ellipse
            key={`o${i}`}
            cx={p.x}
            cy={p.y}
            rx="20"
            ry="9"
            transform={`rotate(${p.deg} ${p.x} ${p.y})`}
            fill={i % 2 ? "#a8434f" : "#c99a52"}
            opacity="0.85"
          />
        ))}
        <circle r="128" fill="#2a1a2a" opacity="0.6" />
        {ring(16, 104).map((p, i) => (
          <path
            key={`m${i}`}
            d="M0 -26 Q16 0 0 26 Q-16 0 0 -26 Z"
            transform={`translate(${p.x} ${p.y}) rotate(${p.deg + 90})`}
            fill={i % 2 ? "#e6c98d" : "#b3566a"}
            opacity="0.9"
          />
        ))}
        <circle r="74" fill="#5a1626" opacity="0.95" />
        {ring(12, 54).map((p, i) => (
          <path
            key={`i${i}`}
            d="M0 -16 Q10 0 0 16 Q-10 0 0 -16 Z"
            transform={`translate(${p.x} ${p.y}) rotate(${p.deg + 90})`}
            fill="#f2e3c2"
            opacity="0.85"
          />
        ))}
        <circle r="30" fill="#e2a24c" />
        <circle r="18" fill="#f8ecd2" />
        <circle r="8" fill="#a8434f" />
        {ring(36, 186).map((p, i) => (
          <circle key={`d${i}`} cx={p.x} cy={p.y} r="3" fill="#f6eedf" opacity="0.7" />
        ))}
        </g>
        {/* diyas placed in perspective around the rangoli */}
        <DiyaShape x={-150} y={6} scale={0.9} delay={0.2} />
        <DiyaShape x={150} y={6} scale={0.9} delay={0.9} />
        <DiyaShape x={-60} y={-42} scale={0.75} delay={0.5} />
        <DiyaShape x={60} y={52} scale={1.05} delay={1.3} />
      </svg>
    </div>
  );
}
