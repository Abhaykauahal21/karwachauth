/**
 * Distant neighbourhood rooftops on a festival night — water tanks,
 * a temple shikhara, a chhatri, lit windows and diyas on other terraces.
 * Generated deterministically so server and client agree.
 */

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Building = { x: number; w: number; h: number; tank: boolean };

function buildRow(seed: number, base: number, minH: number, maxH: number) {
  const r = rng(seed);
  const out: Building[] = [];
  let x = -20;
  while (x < 1620) {
    const w = 60 + r() * 120;
    out.push({ x, w, h: minH + r() * (maxH - minH), tank: r() < 0.45 });
    x += w + (r() < 0.25 ? 10 + r() * 30 : 0);
  }
  return { out, r, base };
}

const far = buildRow(7, 240, 40, 110);
const near = buildRow(21, 240, 26, 80);

function windows(row: ReturnType<typeof buildRow>, seed: number) {
  const r = rng(seed);
  const ws: { x: number; y: number; o: number }[] = [];
  for (const b of row.out) {
    const cols = Math.floor(b.w / 26);
    const rows = Math.floor(b.h / 24);
    for (let c = 0; c < cols; c++)
      for (let k = 0; k < rows; k++)
        if (r() < 0.16) ws.push({ x: b.x + 10 + c * 26, y: row.base - b.h + 12 + k * 24, o: 0.35 + r() * 0.6 });
  }
  return ws;
}

const farWin = windows(far, 3);
const nearWin = windows(near, 9);

function lightStrings(row: ReturnType<typeof buildRow>, seed: number) {
  const r = rng(seed);
  const dots: { x: number; y: number; c: string; d: number }[] = [];
  const colors = ["#ffcf7a", "#ffb35c", "#f7e7c0", "#ff9e7a"];
  row.out.forEach((b) => {
    if (r() < 0.38) {
      const top = row.base - b.h;
      for (let x = b.x + 4; x < b.x + b.w - 4; x += 7) {
        const sag = Math.sin(((x - b.x) / b.w) * Math.PI) * 5;
        dots.push({ x, y: top + 3 + sag, c: colors[Math.floor(r() * colors.length)], d: r() * 2 });
      }
    }
  });
  return dots;
}

const nearLights = lightStrings(near, 13);

export default function Skyline() {
  return (
    <svg
      viewBox="0 0 1600 240"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="sky-far" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1b2550" />
          <stop offset="100%" stopColor="#111833" />
        </linearGradient>
        <linearGradient id="sky-near" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0f1631" />
          <stop offset="100%" stopColor="#090d1e" />
        </linearGradient>
        <linearGradient id="haze" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2a3566" stopOpacity="0" />
          <stop offset="100%" stopColor="#2a3566" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* far row + landmarks */}
      <g fill="url(#sky-far)">
        {far.out.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={240 - b.h} width={b.w} height={b.h} />
            {b.tank && <rect x={b.x + b.w * 0.6} y={240 - b.h - 12} width={16} height={12} rx={2} />}
          </g>
        ))}
        {/* temple shikhara with kalash */}
        <path d="M1150 240 L1150 120 Q1160 112 1166 96 Q1176 60 1188 44 Q1200 60 1210 96 Q1216 112 1226 120 L1226 240 Z" />
        <rect x="1185" y="30" width="6" height="16" rx="3" />
        <path d="M1188 30 L1188 14 L1202 19 L1188 23" fill="#d8b673" opacity="0.6" />
        {/* chhatri dome */}
        <path d="M360 240 L360 150 L372 150 Q380 116 404 112 Q428 116 436 150 L448 150 L448 240 Z" />
        <rect x="401" y="100" width="6" height="14" rx="3" />
        {/* neem trees */}
        <circle cx="610" cy="168" r="26" />
        <circle cx="632" cy="158" r="22" />
        <circle cx="590" cy="160" r="18" />
        <circle cx="1460" cy="170" r="24" />
        <circle cx="1484" cy="162" r="20" />
      </g>
      <rect x="0" y="0" width="1600" height="240" fill="url(#haze)" />
      <g fill="#ffc979">
        {farWin.map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width="7" height="9" opacity={w.o * 0.55} />
        ))}
        <circle cx="1188" cy="128" r="3" opacity="0.8" />
      </g>

      {/* near row */}
      <g fill="url(#sky-near)">
        {near.out.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={240 - b.h} width={b.w} height={b.h} />
            {b.tank && <rect x={b.x + b.w * 0.2} y={240 - b.h - 14} width={20} height={14} rx={3} />}
          </g>
        ))}
      </g>
      <g fill="#ffbe6b">
        {nearWin.map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width="8" height="10" opacity={w.o * 0.75} />
        ))}
      </g>
      {[0, 1, 2].map((g) => (
        <g key={g} className="shimmer" style={{ animationDelay: `${g * 0.7}s` }}>
          {nearLights
            .filter((_, i) => i % 3 === g)
            .map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r="1.6" fill={d.c} />
            ))}
        </g>
      ))}
    </svg>
  );
}
