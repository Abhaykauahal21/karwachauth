"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StoryData } from "@/config/story";
import { buildTimeline } from "@/lib/timeline";
import { SCENES } from "@/lib/scenes";
import { createScore, type Score } from "@/lib/audio";
import { decodeShare } from "@/lib/share";
import { preloadPhotos } from "./ui/Photo";
import World from "./world/World";
import FloatingParticles, { burst } from "./world/FloatingParticles";
import SceneOverlay from "./scenes";
import Preloader from "./ui/Preloader";
import AudioController from "./ui/AudioController";
import SceneProgress from "./ui/SceneProgress";
import Letterbox from "./ui/Letterbox";

/**
 * A link can carry its own couple: ?d=… from the /create page,
 * or just names: ?w=Aarohi&h=Rohan
 */
function useStory(baseStory: StoryData): StoryData {
  // names are only rendered after the preloader, so reading the URL here is hydration-safe
  const [story] = useState<StoryData>(() => {
    if (typeof window === "undefined") return baseStory;
    const q = new URLSearchParams(window.location.search);
    const shared = decodeShare(q.get("d"));
    if (shared) return { ...baseStory, relationshipStartDate: "", ...shared };
    const w = q.get("w")?.trim();
    const h = q.get("h")?.trim();
    return { ...baseStory, wifeName: w || baseStory.wifeName, husbandName: h || baseStory.husbandName };
  });
  return story;
}

/** Diya flames lean with the speed of the viewer's finger or cursor. */
function useWind() {
  useEffect(() => {
    let last = 0;
    let lastX = 0;
    let wind = 0;
    let raf = 0;
    const root = document.documentElement;
    const decay = () => {
      wind *= 0.92;
      root.style.setProperty("--wind", wind.toFixed(2));
      if (Math.abs(wind) > 0.05) raf = requestAnimationFrame(decay);
      else root.style.setProperty("--wind", "0");
    };
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (last) {
        const v = (e.clientX - lastX) / Math.max(8, now - last);
        wind = Math.max(-14, Math.min(14, wind * 0.6 + -v * 9));
      }
      last = now;
      lastX = e.clientX;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(decay);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
}

export default function KarwaChauthExperience({ story: initialStory }: { story: StoryData }) {
  const story = useStory(initialStory);
  const beats = useMemo(() => buildTimeline(story), [story]);
  const [phase, setPhase] = useState<"loading" | "playing">("loading");
  const [index, setIndex] = useState(0);
  // which lines of the current beat are visible; keyed so a new beat starts empty
  const [reveal, setReveal] = useState({ key: -1, shown: 0, done: false });
  const [muted, setMuted] = useState(false);
  const [shootKey, setShootKey] = useState(0);
  const [touched, setTouched] = useState(false);
  const score = useRef<Score | null>(null);
  const lockUntil = useRef(0);

  useWind();

  const beat = beats[Math.min(index, beats.length - 1)];
  const shown = reveal.key === index ? reveal.shown : 0;
  const canContinue = reveal.key === index && reveal.done;
  const scene = beat.scene;
  const def = SCENES[scene];
  const playing = phase === "playing";

  // ── navigation ──────────────────────────────────────────────
  const go = useCallback(
    (dir: 1 | -1) => {
      const now = performance.now();
      if (now < lockUntil.current) return;
      lockUntil.current = now + 700;
      setIndex((i) => Math.max(0, Math.min(beats.length - 1, i + dir)));
    },
    [beats.length],
  );

  const advance = useCallback(() => {
    if (!playing) return;
    setTouched(true);
    // first tap reveals the rest of the beat, the next one moves on
    if (shown < beat.lines.length) {
      setReveal((r) => ({ key: index, shown: beat.lines.length, done: r.key === index && r.done }));
      return;
    }
    if (index < beats.length - 1) go(1);
  }, [playing, shown, beat.lines.length, index, beats.length, go]);

  // reveal lines on their timings, then auto-advance like a film
  useEffect(() => {
    if (!playing) return;
    const timers = beat.delays.map((d, i) =>
      window.setTimeout(
        () =>
          setReveal((r) => {
            const same = r.key === index;
            return { key: index, shown: Math.max(same ? r.shown : 0, i + 1), done: same && r.done };
          }),
        d,
      ),
    );
    if (beat.hold) {
      timers.push(
        window.setTimeout(
          () => setReveal((r) => ({ key: index, shown: r.key === index ? r.shown : beat.lines.length, done: true })),
          beat.duration,
        ),
      );
    } else {
      timers.push(window.setTimeout(() => setIndex((i) => Math.min(beats.length - 1, i + 1)), beat.duration));
    }
    return () => timers.forEach(clearTimeout);
  }, [playing, beat, index, beats.length]);

  // the score follows the scene's mood
  useEffect(() => {
    score.current?.setMood(def.mood);
  }, [def.mood]);

  // a shooting star for the sky and for the very end of the night
  useEffect(() => {
    if (!playing || (scene !== "sky" && scene !== "final")) return;
    const t = window.setTimeout(() => setShootKey((k) => k + 1), scene === "sky" ? 3200 : 9000);
    return () => clearTimeout(t);
  }, [scene, playing]);

  // ── input: tap, swipe, wheel, keys ──────────────────────────
  const down = useRef<{ x: number; y: number; t: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-ui]")) return;
    down.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = down.current;
    down.current = null;
    if (!d || !playing) return;
    const dy = e.clientY - d.y;
    if (Math.abs(dy) > 50 && Math.abs(dy) > Math.abs(e.clientX - d.x)) {
      setTouched(true);
      if (dy < 0) advance();
      else go(-1);
      return;
    }
    burst(e.clientX, e.clientY);
    advance();
  };

  useEffect(() => {
    if (!playing) return;
    let acc = 0;
    let timer = 0;
    const onWheel = (e: WheelEvent) => {
      acc += e.deltaY;
      clearTimeout(timer);
      timer = window.setTimeout(() => (acc = 0), 220);
      if (acc > 70) {
        acc = 0;
        advance();
      } else if (acc < -70) {
        acc = 0;
        go(-1);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", " ", "Enter", "PageDown"].includes(e.key)) {
        e.preventDefault();
        advance();
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, [playing, advance, go]);

  useEffect(() => () => score.current?.dispose(), []);

  // ── controls ────────────────────────────────────────────────
  const begin = useCallback(async () => {
    // preview helper: ?scene=channi starts the film at that scene
    const jump = new URLSearchParams(window.location.search).get("scene");
    const at = jump ? beats.findIndex((b) => b.scene === jump) : -1;
    if (at > 0) setIndex(at);
    setPhase("playing");
    preloadPhotos([story.photos?.husband, story.photos?.couple, ...(story.photos?.memories ?? [])]);
    if (!score.current) {
      score.current = createScore(story.musicUrl);
      await score.current.start();
      score.current.setMood(SCENES[beats[Math.max(0, at)].scene].mood);
    }
  }, [beats, story.musicUrl, story.photos]);

  // preview helper: ?auto=1 skips the preloader (music stays off without a tap)
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("auto")) return;
    const t = window.setTimeout(() => begin(), 100);
    return () => clearTimeout(t);
  }, [begin]);

  const toggleMute = () => {
    setMuted((m) => {
      score.current?.setMuted(!m);
      return !m;
    });
  };

  const replay = () => {
    lockUntil.current = 0;
    setIndex(0);
  };

  const progress = index / (beats.length - 1);
  const hintVisible = playing && ((canContinue && beat.hold && scene !== "end") || (!touched && index === 0 && shown > 0));

  return (
    <MotionConfig reducedMotion="user">
      <main
        className="fixed inset-0 touch-none select-none overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        aria-live="polite"
      >
        <World scene={scene} started={playing} shootKey={shootKey} />

        <FloatingParticles
          density={scene === "end" ? 0 : scene === "intro" ? 0.5 : 1}
          hearts={!!beat.hearts}
          sparks={scene === "aarti"}
        />

        {/* black curtain at the very start; the stars come out of it */}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[#02040a]"
          initial={{ opacity: 1 }}
          animate={{ opacity: playing ? 0 : 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />

        {/* the end: the whole night fades to dark */}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[#010207]"
          initial={false}
          animate={{ opacity: scene === "end" ? 0.94 : 0 }}
          transition={{ duration: 5, ease: "easeInOut" }}
        />

        {playing && <SceneOverlay beat={beat} beatKey={index} shown={shown} story={story} onReplay={replay} />}

        <Letterbox on={playing && def.letterbox} />

        <AnimatePresence>
          {hintVisible && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: 1.5 }}
              className="pointer-events-none fixed inset-x-0 bottom-[max(1.6rem,env(safe-area-inset-bottom))] z-40 text-center"
            >
              <span className="hint inline-block font-sans text-[0.62rem] tracking-[0.4em] text-gold-soft/80 uppercase">
                Tap to continue
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </main>

      <SceneProgress progress={progress} visible={playing && scene !== "end"} />
      <AudioController muted={muted} onToggle={toggleMute} visible={playing} />

      <AnimatePresence>{phase === "loading" && <Preloader wifeName={story.wifeName} date={story.karwaChauthDate} onBegin={begin} />}</AnimatePresence>
    </MotionConfig>
  );
}
