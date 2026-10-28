/** A waxing moon: 0 = new, 1 = full. Used for loading and story progress. */
export default function MoonPhase({ phase, size = 28, className = "" }: { phase: number; size?: number; className?: string }) {
  const f = Math.max(0.001, Math.min(1, phase));
  const r = 10;
  const rx = Math.abs(1 - 2 * f) * r;
  const sweep = f < 0.5 ? 0 : 1;
  return (
    <svg viewBox="-12 -12 24 24" width={size} height={size} className={className} aria-hidden>
      <circle r={r} fill="#1a2140" stroke="#e9d3a1" strokeOpacity="0.25" strokeWidth="0.6" />
      <path d={`M0 ${-r} A${r} ${r} 0 0 1 0 ${r} A${rx} ${r} 0 0 ${sweep} 0 ${-r} Z`} fill="#f7efda" style={{ filter: "drop-shadow(0 0 3px rgba(251,246,233,0.6))" }} />
    </svg>
  );
}
