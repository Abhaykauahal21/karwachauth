"use client";

import { motion } from "framer-motion";
import type { Beat } from "@/lib/timeline";

const EASE = [0.22, 0.61, 0.36, 1] as const;

const lineIn = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.6, ease: EASE } },
};

function Typewriter({ text, className }: { text: string; className: string }) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.095 } } }}
      aria-label={text}
    >
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          variants={{
            hidden: { opacity: 0, filter: "blur(6px)", y: 4 },
            show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.9, ease: EASE } },
          }}
          className="inline-block whitespace-pre"
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

function Letter({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.p
      className="font-serif text-[1.22rem] leading-[1.75] text-ivory/95 italic sm:text-[1.5rem] glow-text"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.075 } } }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 6, filter: "blur(6px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: EASE } },
          }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </motion.p>
  );
}

function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 22" className={`overflow-visible ${className}`} aria-hidden>
      <path d="M12 21 C 5 15.5 1 12 1 7 A5.5 5.5 0 0 1 12 4.2 A5.5 5.5 0 0 1 23 7 C 23 12 19 15.5 12 21 Z" fill="#c98b8b" />
    </svg>
  );
}

/**
 * Text as light — each line surfaces from a soft blur, the way a focus pull
 * brings something into frame.
 */
export default function CinematicText({
  beat,
  shown,
  speakerName,
  align = "center",
  quote = false,
}: {
  beat: Beat;
  shown: number;
  speakerName?: string;
  align?: "center" | "left" | "right";
  /** render as a spoken quote with a tail pointing to the speaker */
  quote?: boolean;
}) {
  const alignCls = align === "left" ? "text-left items-start" : align === "right" ? "text-right items-end" : "text-center items-center";
  const lines = beat.lines.slice(0, shown);

  if (beat.style === "letter") {
    return <div className="max-w-[34rem]">{shown > 0 && <Letter text={beat.lines[0]} />}</div>;
  }

  if (beat.style === "names") {
    const [h, w] = beat.lines[0].split("|");
    return (
      <motion.div variants={lineIn} initial="hidden" animate={shown > 0 ? "show" : "hidden"} className="flex items-center gap-4 sm:gap-6">
        <span className="font-script text-5xl text-gold-soft glow-gold sm:text-7xl">{h}</span>
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={shown > 0 ? { scale: [0.4, 1.15, 1], opacity: 1 } : {}}
          transition={{ duration: 1.6, delay: 0.8 }}
        >
          <Heart className="h-6 w-6 sm:h-8 sm:w-8" />
        </motion.span>
        <span className="font-script text-5xl text-gold-soft glow-gold sm:text-7xl">{w}</span>
      </motion.div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 sm:gap-3 ${alignCls}`}>
      {quote && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.55, y: 0 }}
          transition={{ duration: 1.2 }}
          className="-mb-5 h-10 font-serif text-6xl leading-none text-gold sm:-mb-6 sm:text-7xl"
        >
          “
        </motion.span>
      )}
      {speakerName && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ duration: 1.2 }}
          className="font-sans text-[0.62rem] tracking-[0.42em] text-gold uppercase sm:text-xs"
        >
          {speakerName}
        </motion.span>
      )}
      {lines.map((line, i) => {
        if (beat.typewriter) {
          return <Typewriter key={i} text={line} className="font-script text-[3.2rem] leading-tight text-moon glow-text sm:text-7xl" />;
        }
        const cls = (() => {
          switch (beat.style) {
            case "script":
              return "font-script text-[2.5rem] leading-[1.15] text-gold-soft glow-gold sm:text-6xl";
            case "display":
              return "font-serif text-[2.3rem] leading-[1.1] font-light tracking-wide text-moon glow-text sm:text-6xl";
            case "dialogue":
              return "font-serif text-[1.36rem] leading-snug italic text-ivory glow-text sm:text-[2.1rem]";
            case "signature":
              return i === 0
                ? "font-serif text-xl italic tracking-wide text-ivory/80 glow-text sm:text-2xl"
                : "font-script text-6xl text-gold-soft glow-gold sm:text-8xl";
            default:
              return "font-serif text-[1.6rem] leading-snug font-light text-ivory glow-text sm:text-[2.35rem]";
          }
        })();
        return (
          <motion.p key={i} variants={lineIn} initial="hidden" animate="show" className={`${cls} text-balance`}>
            {beat.style === "display" && beat.hearts && line === "Happy Karwa Chauth" ? (
              <>
                <span className="gold-gradient">Happy Karwa Chauth</span>{" "}
                <Heart className="ml-1 inline-block h-6 w-6 -translate-y-1 sm:h-9 sm:w-9" />
              </>
            ) : (
              line
            )}
          </motion.p>
        );
      })}
      {quote && (
        <motion.span
          aria-hidden
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.4, ease: EASE }}
          className={`mt-1 h-12 w-px origin-top bg-gradient-to-b from-gold/70 to-transparent sm:h-16 ${align === "right" ? "mr-10" : "ml-10"}`}
        />
      )}
    </div>
  );
}
