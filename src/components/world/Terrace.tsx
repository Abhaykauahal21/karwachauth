import Diya from "@/components/props/Diya";
import Rangoli from "./Rangoli";
import Karwa from "./Karwa";

/**
 * The rooftop: a stone parapet with jaali cut-outs, diyas along its ledge,
 * marigold garlands on the pillars, a rangoli on the floor and the karwa.
 * Vertical anchors (% of the layer): parapet top 61, floor 68.
 */

const LEDGE_DIYAS = [6, 15, 24, 33, 67, 76, 85, 94];

function Marigold({ className = "", length = 9 }: { className?: string; length?: number }) {
  return (
    <svg viewBox={`0 0 20 ${length * 12 + 10}`} className={className} aria-hidden>
      <line x1="10" y1="0" x2="10" y2={length * 12} stroke="#5d3a16" strokeWidth="1" />
      {Array.from({ length }, (_, i) => (
        <g key={i}>
          <circle cx="10" cy={6 + i * 12} r="6" fill={i % 3 === 2 ? "#c7372e" : i % 2 ? "#e7962c" : "#f0b43a"} />
          <circle cx="10" cy={6 + i * 12} r="2.5" fill="#000" opacity="0.18" />
        </g>
      ))}
      <path d={`M10 ${length * 12} l-4 8 h8 z`} fill="#3d7a3a" />
    </svg>
  );
}

export default function Terrace() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* floor */}
      <div
        className="absolute inset-x-0 bottom-0 top-[67%]"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 10%, rgba(140,160,220,0.14), transparent 70%), radial-gradient(40% 50% at 50% 70%, rgba(255,160,80,0.12), transparent 70%), linear-gradient(#171c33, #0b0e1c 60%, #06070f)",
        }}
      />
      {/* floor tiles in perspective */}
      <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 top-[67%] h-[33%] w-full opacity-[0.12]">
        {Array.from({ length: 21 }, (_, i) => (
          <line key={i} x1={500 + (i - 10) * 30} y1="0" x2={500 + (i - 10) * 150} y2="300" stroke="#c9d1ef" strokeWidth="1" />
        ))}
        {[20, 55, 100, 160, 240].map((y) => (
          <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#c9d1ef" strokeWidth="1" />
        ))}
      </svg>

      {/* parapet wall with jaali */}
      <div className="absolute inset-x-0 top-[61%] h-[7%]">
        <div className="absolute inset-x-0 top-0 h-[16%] bg-gradient-to-b from-[#6d7598] to-[#2c3352] shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
        <div className="absolute inset-x-0 bottom-0 top-[16%] bg-gradient-to-b from-[#232a47] to-[#121628]">
          <svg className="absolute inset-0 h-full w-full opacity-70">
            <defs>
              <pattern id="jaali" width="34" height="34" patternUnits="userSpaceOnUse" y="6">
                <path
                  d="M17 4 Q24 10 17 17 Q10 10 17 4 Z M17 17 Q24 24 17 30 Q10 24 17 17 Z M4 17 Q10 10 17 17 Q10 24 4 17 Z M17 17 Q24 10 30 17 Q24 24 17 17 Z"
                  fill="#070912"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#jaali)" />
          </svg>
        </div>
      </div>

      {/* pillars with garlands (seen on wider screens) */}
      {[3, 97].map((left) => (
        <div key={left} className="absolute top-[47%] h-[21%] w-[3.4%] min-w-[26px] -translate-x-1/2" style={{ left: `${left}%` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#3a4266] via-[#262d4b] to-[#141831]" />
          <div className="absolute -inset-x-[18%] -top-[6%] h-[7%] bg-[#4d5578]" />
          <Marigold className="absolute left-1/2 top-[2%] h-[46%] w-auto -translate-x-1/2" />
        </div>
      ))}

      {/* diyas along the ledge */}
      {LEDGE_DIYAS.map((x, i) => (
        <div key={x} className="absolute top-[61%] -translate-x-1/2 -translate-y-[78%]" style={{ left: `${x}%` }}>
          <Diya size={34} delay={i * 0.37} glow={0.9} />
        </div>
      ))}

      {/* rangoli behind the couple, karwa beside her */}
      <Rangoli className="absolute left-1/2 top-[70%] w-[min(86vw,620px)] -translate-x-1/2" />
      <Karwa className="absolute bottom-[5%] left-[calc(50%-min(43vw,300px))] w-[min(13vw,82px)]" />
    </div>
  );
}
