"use client";

import { motion } from "framer-motion";
import MoonPhase from "./MoonPhase";

/** Story progress as the moon waxing — crescent at the start, full at the end. */
export default function SceneProgress({ progress, visible }: { progress: number; visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 0.85 : 0 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none fixed left-[max(1rem,env(safe-area-inset-left))] top-[max(1rem,env(safe-area-inset-top))] z-40 flex items-center gap-2"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Story progress"
    >
      <MoonPhase phase={0.06 + progress * 0.94} size={26} />
    </motion.div>
  );
}
