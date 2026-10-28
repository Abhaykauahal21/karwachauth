"use client";

import { motion } from "framer-motion";
import Channi from "@/components/props/Channi";
import Moon from "@/components/world/Moon";
import HusbandPortrait from "@/components/characters/HusbandPortrait";
import BeatText from "@/components/ui/BeatText";
import type { SceneProps } from "./types";

const EASE = [0.45, 0.05, 0.2, 1] as const;

/** Her hands, bangles and mehendi, holding the channi's rim. */
function Hands() {
  const bangle = (x: number, y: number, a: number, key: string, c: string) => (
    <ellipse key={key} cx={x} cy={y} rx="22" ry="5.5" transform={`rotate(${a} ${x} ${y})`} fill="none" stroke={c} strokeWidth="4" />
  );
  return (
    <svg
      viewBox="0 0 400 520"
      className="pointer-events-none absolute inset-x-0 top-0 h-auto w-full overflow-visible"
      style={{ maskImage: "linear-gradient(to bottom, #000 70%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, #000 70%, transparent 100%)" }}
      aria-hidden
    >
      {/* left */}
      <path d="M30 520 L72 360" stroke="#b47d5e" strokeWidth="38" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => bangle(48 - i * 3.5, 432 + i * 13, -14, `l${i}`, i % 2 ? "#e8c26a" : "#b3122a"))}
      <path d="M58 372 Q60 338 82 328 Q100 324 104 340 Q96 352 84 360 Q74 378 58 372 Z" fill="#c48a69" />
      <path d="M72 344 q6 -6 12 0 M70 354 q6 -4 12 0" stroke="#7a2a12" strokeWidth="1.4" fill="none" opacity="0.8" />
      {/* right */}
      <path d="M370 520 L328 360" stroke="#a06c50" strokeWidth="38" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => bangle(352 + i * 3.5, 432 + i * 13, 14, `r${i}`, i % 2 ? "#e8c26a" : "#b3122a"))}
      <path d="M342 372 Q340 338 318 328 Q300 324 296 340 Q304 352 316 360 Q326 378 342 372 Z" fill="#b47d5e" />
      <path d="M316 344 q6 -6 12 0 M318 354 q6 -4 12 0" stroke="#7a2a12" strokeWidth="1.4" fill="none" opacity="0.8" />
    </svg>
  );
}

/**
 * The climax. She raises the channi: first the moon through its mesh —
 * then the camera tilts down, and it is his face.
 */
export default function ChanniScene({ beat, beatKey, shown }: SceneProps) {
  const him = beat.sub === "him";
  return (
    <>
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_38%,rgba(2,4,10,0.35),rgba(2,4,10,0.88))]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 2 } }}
        transition={{ duration: 2.5 }}
      />
      <div className="absolute inset-0 flex items-start justify-center pt-[12vh] sm:pt-[13vh]">
        <motion.div
          className="relative w-[min(78vw,50vh)]"
          initial={{ y: "18vh", opacity: 0, scale: 0.9 }}
          animate={{ y: him ? "1vh" : "0vh", opacity: 1, scale: 1, rotate: him ? -2 : 0 }}
          exit={{ y: "26vh", opacity: 0, scale: 0.94, transition: { duration: 2, ease: EASE } }}
          transition={{ duration: 3.2, ease: EASE }}
        >
          <Channi>
            <motion.div
              className="absolute inset-x-0 top-0 h-[200%]"
              initial={false}
              animate={{ y: him ? "-50%" : "0%" }}
              transition={{ duration: 5, ease: EASE }}
            >
              <div className="relative h-1/2" style={{ background: "radial-gradient(circle at 50% 50%, #18234a, #050914 70%)" }}>
                <div className="absolute left-1/2 top-1/2 w-[44%] -translate-x-1/2 -translate-y-1/2">
                  <Moon glow={1.2} />
                </div>
              </div>
              <motion.div
                className="relative h-1/2"
                initial={false}
                animate={{ filter: him ? "blur(0px)" : "blur(6px)" }}
                transition={{ duration: 4, delay: him ? 2.2 : 0 }}
              >
                <HusbandPortrait />
              </motion.div>
            </motion.div>
          </Channi>
          <Hands />
        </motion.div>
      </div>

      <BeatText
        beat={beat}
        beatKey={beatKey}
        shown={shown}
        className="absolute inset-x-0 bottom-[8vh] flex justify-center px-6 sm:bottom-[11vh]"
      />
    </>
  );
}
