"use client";

/** Thin moonlit clouds drifting across the sky, very slowly. */
const CLOUDS = [
  { top: "6%", left: "-10%", w: 70, o: 0.32, dur: 70, delay: -10 },
  { top: "20%", left: "40%", w: 55, o: 0.22, dur: 90, delay: -40 },
  { top: "34%", left: "-20%", w: 80, o: 0.18, dur: 110, delay: -70 },
  { top: "44%", left: "30%", w: 60, o: 0.14, dur: 95, delay: -20 },
];

function CloudShape() {
  return (
    <svg viewBox="0 0 400 90" className="h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id="cloud-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#c9d1ef" />
          <stop offset="100%" stopColor="#4a5684" />
        </linearGradient>
        <filter id="cloud-blur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <g filter="url(#cloud-blur)" fill="url(#cloud-fill)">
        <ellipse cx="120" cy="52" rx="110" ry="16" />
        <ellipse cx="190" cy="40" rx="70" ry="20" />
        <ellipse cx="270" cy="50" rx="100" ry="14" />
        <ellipse cx="160" cy="58" rx="140" ry="9" />
      </g>
    </svg>
  );
}

export default function Clouds() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="drift absolute"
          style={{
            top: c.top,
            left: c.left,
            width: `${c.w}%`,
            minWidth: 320,
            opacity: c.o,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          <CloudShape />
        </div>
      ))}
    </div>
  );
}
