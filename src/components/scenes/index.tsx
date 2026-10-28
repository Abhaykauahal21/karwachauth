"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { SceneId } from "@/lib/scenes";
import type { SceneProps } from "./types";
import IntroScene from "./IntroScene";
import MoonScene from "./MoonScene";
import TerraceScene from "./TerraceScene";
import CoupleScene from "./CoupleScene";
import ChanniScene from "./ChanniScene";
import DialogueScene from "./DialogueScene";
import BlessingScene from "./BlessingScene";
import AartiScene from "./AartiScene";
import MemoryScene from "./MemoryScene";
import PersonalMessageScene from "./PersonalMessageScene";
import FinalScene, { EndScene } from "./FinalScene";

const SCENE_COMPONENTS: Record<Exclude<SceneId, "end">, (p: SceneProps) => React.ReactElement> = {
  intro: IntroScene,
  sky: MoonScene,
  terrace: TerraceScene,
  couple: CoupleScene,
  channi: ChanniScene,
  dialogue: DialogueScene,
  blessing: BlessingScene,
  aarti: AartiScene,
  memory: MemoryScene,
  message: PersonalMessageScene,
  final: FinalScene,
};

// scenes filmed on the terrace: whoever speaks, the words float on their side of the frame
const ON_TERRACE: SceneId[] = ["terrace", "couple", "dialogue", "blessing", "aarti", "final"];

/** Renders the overlay for the current scene; scenes cross-fade into each other. */
export default function SceneOverlay(props: SceneProps & { onReplay: () => void }) {
  const scene = props.beat.scene;
  return (
    <AnimatePresence>
      <motion.div key={scene} className="absolute inset-0" exit={{ opacity: 0, transition: { duration: 1.2 } }}>
        {scene === "end" ? (
          <EndScene {...props} />
        ) : (
          (() => {
            const Scene = props.beat.speaker && ON_TERRACE.includes(scene) ? DialogueScene : SCENE_COMPONENTS[scene];
            return <Scene {...props} />;
          })()
        )}
      </motion.div>
    </AnimatePresence>
  );
}
