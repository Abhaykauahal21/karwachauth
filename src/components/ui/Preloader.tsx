"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import MoonPhase from "./MoonPhase";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * Dark screen, a tiny moon filling up, then "Ready?".
 * The button is also the user gesture that lets the music begin.
 */
export default function Preloader({ wifeName, date, onBegin }: { wifeName: string; date: string; onBegin: () => void }) {
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // a timer rather than rAF, so it never stalls in low-power or background tabs
    let fontsDone = false;
    let readyTimer = 0;
    const t0 = performance.now();
    const MIN = 2600;
    document.fonts?.ready.then(() => (fontsDone = true));
    const tick = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - t0) / MIN);
      const eased = 1 - Math.pow(1 - t, 2.2);
      const p = Math.round((fontsDone ? eased : Math.min(eased, 0.9)) * 100);
      setPct(p);
      if (p >= 100) {
        window.clearInterval(tick);
        readyTimer = window.setTimeout(() => setReady(true), 500);
      }
    }, 50);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(readyTimer);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#02040a] px-6 text-center"
      exit={{ opacity: 0, transition: { duration: 1.8, ease: "easeInOut" } }}
    >
      <AnimatePresence>
        {!ready ? (
          <motion.div
            key="loading"
            className="absolute inset-x-0 flex flex-col items-center gap-7 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.9 } }}
            transition={{ duration: 1.4 }}
          >
            <MoonPhase phase={0.04 + (pct / 100) * 0.96} size={44} />
            <p className="font-serif text-xl font-light italic text-ivory/85 sm:text-2xl">Preparing a little surprise for you…</p>
            <p className="font-sans text-[0.68rem] tracking-[0.45em] text-gold/70 tabular-nums">{pct}%</p>
          </motion.div>
        ) : (
          <motion.div
            key="ready"
            className="absolute inset-x-0 flex flex-col items-center gap-9 px-6"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, delay: 0.6, ease: EASE }}
          >
            <MoonPhase phase={1} size={44} />
            <div className="space-y-3">
              <p className="font-sans text-[0.65rem] tracking-[0.5em] text-gold/70 uppercase">For {wifeName}</p>
              <h1 className="font-serif text-5xl font-light text-moon glow-text sm:text-6xl">Ready?</h1>
              {date && <p className="font-serif text-base italic text-ivory/55">Karwa Chauth · {date}</p>}
            </div>
            <button
              type="button"
              onClick={onBegin}
              className="group relative overflow-hidden rounded-full border border-gold/40 px-9 py-4 font-serif text-xl text-gold-soft transition-all duration-700 hover:border-gold hover:shadow-[0_0_40px_rgba(216,182,115,0.25)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              Begin the story ✨
            </button>
            <p className="font-sans text-[0.62rem] tracking-[0.3em] text-ivory/40 uppercase">Sound on · Tap to continue</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
