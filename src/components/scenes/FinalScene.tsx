"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import BeatText from "@/components/ui/BeatText";
import ReplayButton from "@/components/ui/ReplayButton";
import type { SceneProps } from "./types";
import { UPPER } from "./placement";

/** Back on the terrace, together. The camera slowly pulls away. */
export default function FinalScene({ beat, beatKey, shown }: SceneProps) {
  const signature = beat.style === "signature";
  return (
    <BeatText
      beat={beat}
      beatKey={beatKey}
      shown={shown}
      className={signature ? "absolute inset-x-0 top-[27%] flex justify-center px-7 sm:top-[26%]" : UPPER}
    />
  );
}

/** Darkness. One star stays. */
export function EndScene({ story, onReplay }: SceneProps & { onReplay: () => void }) {
  const reply = encodeURIComponent(`Happy Karwa Chauth, ${story.husbandName} ❤️ I watched our story… I love you.`);
  const wa = `https://wa.me/${story.husbandWhatsApp ?? ""}?text=${reply}`;
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-7 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, delay: 2.5 }}
    >
      {/* the last star */}
      <motion.div
        className="relative h-2 w-2 rounded-full bg-moon"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1, 0.85, 1], opacity: 1 }}
        transition={{ duration: 4, delay: 3 }}
        style={{ boxShadow: "0 0 18px 6px rgba(251,246,233,0.55), 0 0 70px 24px rgba(216,182,115,0.18)" }}
      />
      <motion.div
        className="flex flex-col items-center gap-7"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.4, delay: 6.5 }}
      >
        <p className="font-serif text-lg font-light italic text-ivory/60">
          Made with love by {story.husbandName}, only for {story.wifeName}.
        </p>
        {story.karwaChauthDate && (
          <p className="-mt-4 font-sans text-[0.62rem] tracking-[0.4em] text-gold/60 uppercase">Karwa Chauth · {story.karwaChauthDate}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            data-ui
            href={wa}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#b98f4a] via-[#e9d3a1] to-[#b98f4a] px-6 font-sans text-xs font-medium tracking-[0.25em] text-[#1a1020] uppercase shadow-[0_0_30px_rgba(216,182,115,0.25)] transition-transform hover:scale-[1.03]"
          >
            <Heart size={14} strokeWidth={2} fill="currentColor" />
            Send your love
          </a>
          <ReplayButton onReplay={onReplay} />
        </div>
      </motion.div>
    </motion.div>
  );
}
