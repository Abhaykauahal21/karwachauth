"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

/** 🔊 Music on / off — the only control visible during the film. */
export default function AudioController({
  muted,
  onToggle,
  visible,
}: {
  muted: boolean;
  onToggle: () => void;
  visible: boolean;
}) {
  return (
    <motion.button
      type="button"
      data-ui
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1.5 }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={muted ? "Turn music on" : "Turn music off"}
      className="fixed right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] z-40 grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-[#060b1a]/40 text-gold-soft backdrop-blur-sm transition-colors hover:border-gold/60"
    >
      {muted ? <VolumeX size={18} strokeWidth={1.5} /> : <Volume2 size={18} strokeWidth={1.5} />}
    </motion.button>
  );
}
