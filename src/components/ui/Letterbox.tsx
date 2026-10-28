"use client";

import { motion } from "framer-motion";

/** Cinema bars that slide in for the most intimate shots. */
export default function Letterbox({ on }: { on: boolean }) {
  const bar = "pointer-events-none fixed inset-x-0 z-30 h-[5vh] bg-black sm:h-[8vh]";
  const t = { duration: 2.2, ease: [0.45, 0.05, 0.2, 1] as const };
  return (
    <>
      <motion.div className={`${bar} top-0 origin-top`} initial={false} animate={{ scaleY: on ? 1 : 0 }} transition={t} />
      <motion.div className={`${bar} bottom-0 origin-bottom`} initial={false} animate={{ scaleY: on ? 1 : 0 }} transition={t} />
    </>
  );
}
