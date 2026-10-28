"use client";

import { motion } from "framer-motion";
import BeatText from "@/components/ui/BeatText";
import MoonPhase from "@/components/ui/MoonPhase";
import type { SceneProps } from "./types";

/** A clean moonlit page: their names, and what he wanted to say. */
export default function PersonalMessageScene({ beat, beatKey, shown }: SceneProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-start px-7 pt-[33vh] sm:pt-[31vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.6 } }}
      transition={{ duration: 2 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_50%,rgba(2,4,10,0.65),transparent)]" />
      <motion.div
        className="relative mb-6 flex items-center gap-3 opacity-70"
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={{ opacity: 0.7, scaleX: 1 }}
        transition={{ duration: 2.4, delay: 0.6 }}
      >
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70 sm:w-24" />
        <MoonPhase phase={1} size={14} />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70 sm:w-24" />
      </motion.div>
      <BeatText beat={beat} beatKey={beatKey} shown={shown} className="relative flex max-w-2xl items-start justify-center text-center" />
    </motion.div>
  );
}
