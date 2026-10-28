"use client";

import { AnimatePresence, motion } from "framer-motion";
import CinematicText from "./CinematicText";
import type { SceneProps } from "@/components/scenes/types";

/** One beat's text, dissolving out before the next one surfaces. */
export default function BeatText({
  beat,
  beatKey,
  shown,
  className = "",
  align,
  speakerName,
  quote,
}: Omit<SceneProps, "story"> & {
  className?: string;
  align?: "center" | "left" | "right";
  speakerName?: string;
  quote?: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={beatKey}
        className={className}
        exit={{ opacity: 0, filter: "blur(10px)", y: -8, transition: { duration: 0.9, ease: "easeIn" } }}
      >
        <CinematicText beat={beat} shown={shown} align={align} speakerName={speakerName} quote={quote} />
      </motion.div>
    </AnimatePresence>
  );
}
