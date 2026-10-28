"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MemoryVisual } from "@/config/story";
import BeatText from "@/components/ui/BeatText";
import { DreamPhoto } from "@/components/ui/Photo";
import type { SceneProps } from "./types";

/*
 * A short montage of memories, told as silhouettes — abstract, like
 * remembered moments rather than places. The same couple: her saree and
 * chunri, his kurta.
 */

const INK = "#04060d";

// ── silhouettes ────────────────────────────────────────────────

function WalkingMan({ groom = false }: { groom?: boolean }) {
  return (
    <g fill={INK}>
      <path className="stride" d="M-6 -64 L4 -64 L6 0 L-4 0 Z" />
      <path className="stride stride-alt" d="M-4 -64 L6 -64 L8 0 L-2 0 Z" opacity="0.85" />
      <circle cx="2" cy="-158" r="11" />
      {/* a pagdi with kalgi for the groom */}
      {groom && <path d="M-11 -160 Q-12 -176 2 -178 Q16 -177 15 -162 Q4 -166 -11 -160 Z M10 -178 q4 -10 1 -16 q-5 6 -3 16 Z" />}
      <path d="M-3 -148 L7 -148 L7 -140 L-3 -140 Z" />
      <path d="M-15 -142 Q0 -149 15 -142 L17 -60 L-17 -60 Z" />
    </g>
  );
}

function WalkingWoman() {
  return (
    <g fill={INK}>
      <path className="sway" d="M-7 -136 Q-28 -100 -34 -36 Q-24 -40 -15 -46 Q-12 -100 -1 -132 Z" opacity="0.92" />
      <circle cx="0" cy="-146" r="10" />
      <circle cx="-9" cy="-147" r="6" />
      <path d="M-11 -134 Q0 -140 11 -134 L10 -92 L-10 -92 Z" />
      <path d="M-10 -94 L10 -94 Q19 -40 21 0 L-19 0 Q-16 -40 -10 -94 Z" />
    </g>
  );
}

function BackMan({ sitting = false }: { sitting?: boolean }) {
  return sitting ? (
    <g fill={INK}>
      <circle cx="0" cy="-100" r="15" />
      <path d="M-8 -88 L8 -88 L9 -78 L-9 -78 Z" />
      <path d="M-27 0 Q-31 -50 -23 -78 Q0 -90 23 -78 Q31 -50 27 0 Z" />
    </g>
  ) : (
    <g fill={INK}>
      <circle cx="0" cy="-160" r="12" />
      <path d="M-20 -146 Q0 -155 20 -146 L22 -70 L-22 -70 Z" />
      <path d="M-18 -72 L-4 -72 L-6 0 L-16 0 Z" />
      <path d="M4 -72 L18 -72 L16 0 L6 0 Z" />
    </g>
  );
}

function BackWoman({ sitting = false }: { sitting?: boolean }) {
  return sitting ? (
    <g fill={INK}>
      <circle cx="0" cy="-84" r="13" />
      {/* chunri over the head, falling down her back */}
      <path d="M-15 -86 Q0 -104 15 -86 L22 0 L-22 0 Z" opacity="0.9" />
      <path d="M-20 0 Q-23 -42 -17 -64 Q0 -73 17 -64 Q23 -42 20 0 Z" />
    </g>
  ) : (
    <g fill={INK}>
      <circle cx="0" cy="-146" r="11" />
      <path d="M-3 -140 Q-6 -110 -2 -86 L3 -86 Q4 -112 3 -140 Z" />
      <path d="M-15 -134 Q0 -141 15 -134 L16 -92 L-16 -92 Z" />
      <path d="M-16 -94 L16 -94 Q22 -40 25 0 L-25 0 Q-22 -40 -16 -94 Z" />
    </g>
  );
}

// ── the four memories ──────────────────────────────────────────

function Lamp({ x, h = 200 }: { x: number; h?: number }) {
  return (
    <g>
      <circle cx={x} cy={520 - h} r="70" fill="url(#mem-lampglow)" />
      <rect x={x - 2} y={520 - h} width="4" height={h} fill={INK} />
      <rect x={x - 7} y={516 - h} width="14" height="9" rx="2" fill="#ffd18a" />
    </g>
  );
}

function Walk() {
  return (
    <>
      <rect width="800" height="600" fill="url(#mem-dusk)" />
      <path d="M0 440 Q200 420 400 438 T800 430 L800 600 L0 600 Z" fill="#0a0d1c" />
      <path d="M0 470 L800 470 L800 600 L0 600 Z" fill="#070912" />
      <Lamp x={140} />
      <Lamp x={420} h={210} />
      <Lamp x={700} />
      <g style={{ animation: "walk-across 16s linear infinite alternate" }}>
        <g transform="translate(372 520)">
          <g className="bob">
            <WalkingMan />
          </g>
        </g>
        <g transform="translate(404 520)">
          <g className="bob" style={{ animationDelay: "-0.4s" }}>
            <WalkingWoman />
          </g>
        </g>
        {/* hands held between them */}
        <path d="M386 434 Q394 442 400 436" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </>
  );
}

function Sit() {
  return (
    <>
      <rect width="800" height="600" fill="url(#mem-night)" />
      <circle cx="470" cy="120" r="24" fill="#f7efda" />
      <circle cx="470" cy="120" r="80" fill="url(#mem-moonhalo)" />
      {/* far shore lights */}
      <path d="M0 360 L800 360 L800 372 L0 372 Z" fill="#0b1029" />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={10 + i * 20 + ((i * 7) % 11)} cy={358 - ((i * 13) % 9)} r="1.6" fill="#ffc979" opacity={0.4 + ((i * 17) % 10) / 20} />
      ))}
      {/* water with the moon's path */}
      <rect y="372" width="800" height="130" fill="#070b1d" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={452 - (i % 3) * 8} y={380 + i * 8} width={36 + (i % 4) * 8} height="1.6" fill="#f7efda" opacity={0.45 - i * 0.025} className="shimmer" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
      {/* stone ledge */}
      <path d="M0 500 L800 500 L800 600 L0 600 Z" fill={INK} />
      <g transform="translate(424 500)">
        <BackMan sitting />
      </g>
      <g transform="translate(378 500)">
        <g transform="rotate(16 0 -84) translate(6 0)">
          <BackWoman sitting />
        </g>
      </g>
    </>
  );
}

function Rain() {
  return (
    <>
      <rect width="800" height="600" fill="url(#mem-rain)" />
      <circle cx="470" cy="250" r="160" fill="url(#mem-lampglow)" />
      <rect x="468" y="250" width="5" height="270" fill={INK} />
      <path d="M455 248 L486 248 L478 258 L463 258 Z" fill="#ffd18a" />
      {/* light cone */}
      <path d="M463 258 L478 258 L560 520 L380 520 Z" fill="#ffcf8a" opacity="0.07" />
      <path d="M0 520 L800 520 L800 600 L0 600 Z" fill="#06080f" />
      {/* puddle reflections */}
      <ellipse cx="420" cy="540" rx="120" ry="6" fill="#ffcf8a" opacity="0.08" />
      <g transform="translate(386 520)">
        <BackMan />
      </g>
      <g transform="translate(414 520)">
        <BackWoman />
      </g>
      {/* umbrella */}
      <path d="M400 296 L398 430" stroke={INK} strokeWidth="3" />
      <g transform="translate(0 -50)">
      <path d="M320 382 Q400 300 480 382 Q470 376 460 382 Q450 374 440 382 Q430 374 420 382 Q410 374 400 382 Q390 374 380 382 Q370 374 360 382 Q350 374 340 382 Q330 376 320 382 Z" fill={INK} />
      <path d="M326 378 Q400 306 474 378" stroke="#ffd18a" strokeWidth="1.4" fill="none" opacity="0.35" />
      </g>
    </>
  );
}

function Lights() {
  const strings = [
    { y: 70, sag: 70 },
    { y: 130, sag: 60 },
    { y: 190, sag: 50 },
  ];
  return (
    <>
      <rect width="800" height="600" fill="url(#mem-night)" />
      {strings.map((s, k) => (
        <g key={k}>
          <path d={`M-20 ${s.y} Q400 ${s.y + s.sag * 2} 820 ${s.y}`} stroke="#1b1a24" strokeWidth="1.2" fill="none" />
          {Array.from({ length: 26 }, (_, i) => {
            const t = i / 25;
            const x = -20 + 840 * t;
            const y = (1 - t) * (1 - t) * s.y + 2 * (1 - t) * t * (s.y + s.sag * 2) + t * t * s.y;
            return (
              <g key={i} className="shimmer" style={{ animationDelay: `${(i * 0.37 + k) % 2.2}s` }}>
                <circle cx={x} cy={y + 4} r="9" fill="#ffbe6b" opacity="0.12" />
                <circle cx={x} cy={y + 4} r="2.6" fill="#ffe1a8" />
              </g>
            );
          })}
        </g>
      ))}
      {/* bokeh */}
      {[
        [90, 420, 34],
        [700, 380, 46],
        [620, 470, 26],
        [160, 300, 22],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#ffb760" opacity="0.08" />
      ))}
      <path d="M0 520 L800 520 L800 600 L0 600 Z" fill="#06070f" />
      <path d="M330 600 L370 520 L430 520 L470 600 Z" fill="#ffcf8a" opacity="0.05" />
      <motion.g initial={{ scale: 1 }} animate={{ scale: 0.9 }} transition={{ duration: 14, ease: "linear" }} style={{ originX: "400px", originY: "520px" }}>
        <g transform="translate(388 520)">
          <BackMan />
        </g>
        <g transform="translate(414 520)">
          <g transform="rotate(-8 0 -146)">
            <BackWoman />
          </g>
        </g>
      </motion.g>
    </>
  );
}

function Wedding() {
  return (
    <>
      <rect width="800" height="600" fill="url(#mem-dusk)" />
      <circle cx="400" cy="440" r="210" fill="url(#mem-fireglow)" />
      {/* mandap: pillars, scalloped canopy, marigold strings */}
      <rect x="262" y="214" width="9" height="306" fill={INK} />
      <rect x="529" y="214" width="9" height="306" fill={INK} />
      <path d={`M240 214 L560 214 L560 200 Q400 150 240 200 Z M240 214 ${"q10 14 20 0 ".repeat(16)}Z`} fill={INK} />
      {[300, 340, 380, 420, 460, 500].map((x, i) => (
        <g key={x} className="shimmer" style={{ animationDelay: `${i * 0.3}s` }}>
          {Array.from({ length: 6 + (i % 2) * 2 }, (_, k) => (
            <circle key={k} cx={x} cy={232 + k * 11} r="3.4" fill={k % 3 === 2 ? "#c7372e" : "#f0a63a"} opacity="0.85" />
          ))}
        </g>
      ))}
      <path d="M0 520 L800 520 L800 600 L0 600 Z" fill="#06070f" />
      {/* havan kund and the sacred fire */}
      <path d="M368 520 L432 520 L426 500 L374 500 Z" fill="#1a0f0c" />
      <path d="M372 500 L428 500" stroke="#c99d4f" strokeWidth="1.5" opacity="0.6" />
      <g transform="translate(400 500)">
        <g className="flame">
          <path d="M-22 0 C-26 -18 -12 -26 -14 -46 C-2 -34 0 -22 2 -12 C6 -24 4 -40 14 -54 C18 -34 26 -20 22 0 Z" fill="#ff8a2a" />
          <path d="M-12 0 C-14 -12 -4 -18 -4 -32 C4 -22 6 -14 6 -6 C10 -14 12 -22 12 -30 C18 -18 16 -8 12 0 Z" fill="#ffc35c" />
          <path d="M-4 0 C-5 -8 0 -12 1 -20 C5 -12 6 -6 4 0 Z" fill="#fff3cf" />
        </g>
      </g>
      {[
        [-10, 0],
        [8, 0.8],
        [2, 1.6],
      ].map(([dx, d], i) => (
        <circle key={i} cx={400 + dx} cy={440} r="1.6" fill="#ffcf7a" style={{ animation: `ember 2.4s ${d}s ease-out infinite` }} />
      ))}
      {/* the pheras: she leads, he follows, tied by the gathbandhan */}
      <g style={{ animation: "walk-across 18s ease-in-out infinite alternate" }}>
        <g transform="translate(300 520)">
          <g className="bob">
            <WalkingMan groom />
          </g>
        </g>
        <g transform="translate(340 520)">
          <g className="bob" style={{ animationDelay: "-0.4s" }}>
            <WalkingWoman />
          </g>
        </g>
        <path d="M312 432 Q318 468 330 452 Q336 444 334 476" stroke="#c7372e" strokeWidth="2.4" fill="none" opacity="0.9" />
      </g>
    </>
  );
}

const VISUALS: Record<MemoryVisual, () => React.ReactElement> = {
  walk: Walk,
  sit: Sit,
  rain: Rain,
  lights: Lights,
  wedding: Wedding,
};

function Defs() {
  return (
    <defs>
      <linearGradient id="mem-dusk" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#060a1c" />
        <stop offset="55%" stopColor="#1d1d40" />
        <stop offset="78%" stopColor="#4a2b45" />
        <stop offset="100%" stopColor="#6b3a3e" />
      </linearGradient>
      <linearGradient id="mem-night" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#03050e" />
        <stop offset="70%" stopColor="#0d1533" />
        <stop offset="100%" stopColor="#1b1d3c" />
      </linearGradient>
      <linearGradient id="mem-rain" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#05070f" />
        <stop offset="100%" stopColor="#161a30" />
      </linearGradient>
      <radialGradient id="mem-lampglow">
        <stop offset="0%" stopColor="#ffcf8a" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ffcf8a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="mem-fireglow">
        <stop offset="0%" stopColor="#ff9a3c" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#ff9a3c" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="mem-moonhalo">
        <stop offset="0%" stopColor="#fbf6e9" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#fbf6e9" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

export default function MemoryScene({ beat, beatKey, shown }: SceneProps) {
  const visual = (beat.sub as MemoryVisual) ?? "walk";
  const Visual = VISUALS[visual];
  return (
    <motion.div
      className="absolute inset-0 bg-[#02040a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2 } }}
      transition={{ duration: 2 }}
    >
      <AnimatePresence>
        <motion.div
          key={visual}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: beat.photo ? 0.4 : 1, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.8 } }}
          transition={{ opacity: { duration: 2 }, scale: { duration: 12, ease: "linear" } }}
        >
          <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
            <Defs />
            <Visual />
          </svg>
          {visual === "rain" && (
            <div
              className="pointer-events-none absolute -inset-[20%] opacity-40"
              style={{
                backgroundImage: "repeating-linear-gradient(100deg, transparent 0 9px, rgba(200,210,240,0.35) 9px 10px, transparent 10px 23px)",
                animation: "rain 0.7s linear infinite",
                maskImage: "linear-gradient(to bottom, transparent, #000 30%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 30%)",
              }}
            />
          )}
          {/* film grain-ish vignette to make it feel remembered */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(110% 80% at 50% 55%, transparent 50%, rgba(2,4,10,0.85))" }} />
        </motion.div>
      </AnimatePresence>

      {/* the real moment, up in the sky like a dream; the words sit beneath it */}
      <AnimatePresence>
        {beat.photo && (
          <DreamPhoto
            key={beat.photo}
            src={beat.photo}
            className="absolute left-1/2 top-[6%] h-[38%] w-[min(92vw,560px)] -translate-x-1/2 sm:top-[5%] sm:h-[42%]"
          />
        )}
      </AnimatePresence>

      <BeatText
        beat={beat}
        beatKey={beatKey}
        shown={shown}
        className={`absolute inset-x-0 mx-auto flex max-w-xl justify-center px-7 ${
          beat.photo ? "top-[47%] sm:top-[50%]" : "top-[15%] sm:top-[13%]"
        }`}
      />
    </motion.div>
  );
}
