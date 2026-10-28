import type { HusbandPose, WifePose } from "@/lib/scenes";
import WifeCharacter from "./WifeCharacter";
import { HusbandArm, HusbandBody, HusbandDefs } from "./HusbandCharacter";

/** Where he stands on the terrace for each pose (stage units). */
const HX: Record<HusbandPose, number> = { away: 452, look: 250, bless: 205, together: 158 };

/**
 * The couple on one shared stage so every gesture lines up —
 * his blessing hand finds her head, his arm finds her shoulder.
 */
export default function CoupleStage({
  wife,
  husband,
  warmth,
}: {
  wife: WifePose;
  husband: HusbandPose;
  warmth: number;
}) {
  const hx = HX[husband];
  const walk = {
    transform: `translate(${hx}px, 20px)`,
    transition: "transform 4.2s cubic-bezier(0.4, 0.05, 0.2, 1), opacity 2s ease",
    opacity: husband === "away" ? 0.85 : 1,
  } as const;

  return (
    <svg viewBox="0 0 520 600" className="h-full w-full overflow-visible" aria-label="The couple on the terrace">
      <HusbandDefs />
      <defs>
        <radialGradient id="stage-warm">
          <stop offset="0%" stopColor="#ffb766" stopOpacity="0.32" />
          <stop offset="50%" stopColor="#ff9a3c" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ff9a3c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="stage-shadow">
          <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* contact shadows */}
      <ellipse cx="160" cy="592" rx="80" ry="10" fill="url(#stage-shadow)" />
      <g style={walk}>
        <ellipse cx="114" cy="572" rx="62" ry="9" fill="url(#stage-shadow)" />
      </g>

      <g style={walk}>
        <HusbandBody pose={husband} />
      </g>
      <g transform="translate(60 40)">
        <WifeCharacter pose={wife} warmth={warmth} />
      </g>
      <g style={walk}>
        <HusbandArm pose={husband} />
      </g>

      {/* warm diya wash over both of them */}
      <circle
        cx="245"
        cy="250"
        r="230"
        fill="url(#stage-warm)"
        style={{ opacity: warmth, transition: "opacity 3s ease" }}
        pointerEvents="none"
      />
    </svg>
  );
}
