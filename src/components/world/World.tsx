"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect } from "react";
import { SCENES, type SceneId } from "@/lib/scenes";
import CoupleStage from "@/components/characters/CoupleStage";
import StarField from "./StarField";
import Moon from "./Moon";
import Clouds from "./Clouds";
import Skyline from "./Skyline";
import Terrace from "./Terrace";
import Diya from "@/components/props/Diya";

const EASE = [0.45, 0.05, 0.2, 1] as const;

/**
 * One continuous moonlit world, filmed by a virtual camera.
 * Every layer has a depth: the camera's pan/tilt/zoom moves near layers more
 * than far ones, which is what makes it feel like a lens and not a slideshow.
 */
function Layer({
  depth,
  scene,
  pointer,
  className = "",
  children,
}: {
  depth: number;
  scene: SceneId;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  className?: string;
  children: React.ReactNode;
}) {
  const def = SCENES[scene];
  const cam = def.camera;
  const reduced = useReducedMotion();
  const px = useTransform(pointer.x, (v) => v * depth * 14);
  const py = useTransform(pointer.y, (v) => v * depth * 8);
  const orbitAmp = (depth - 1) * 5; // vw — background slides one way, foreground the other

  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      style={{ transformOrigin: "50% 62%" }}
      initial={false}
      animate={{ x: `${-cam.x * depth}vw`, y: `${-cam.y * depth}vh`, scale: 1 + (cam.z - 1) * depth }}
      transition={{ duration: reduced ? 0.01 : def.travel, ease: EASE }}
    >
      <motion.div className="absolute inset-0" style={{ x: px, y: py }}>
        <motion.div
          className="absolute inset-0"
          animate={def.orbit && !reduced ? { x: ["0vw", `${orbitAmp}vw`, "0vw", `${-orbitAmp}vw`, "0vw"] } : { x: "0vw" }}
          transition={def.orbit ? { duration: 18, repeat: Infinity, ease: "easeInOut" } : { duration: 3, ease: EASE }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function World({ scene, started, shootKey }: { scene: SceneId; started: boolean; shootKey: number }) {
  const def = SCENES[scene];
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const pointer = { x: useSpring(mx, { stiffness: 30, damping: 20 }), y: useSpring(my, { stiffness: 30, damping: 20 }) };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set(-(e.clientX / window.innerWidth - 0.5));
      my.set(-(e.clientY / window.innerHeight - 0.5));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const terraceVisible = def.world;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#02040a]">
      {/* sky */}
      <Layer depth={0.1} scene={scene} pointer={pointer}>
        <div
          className="absolute inset-x-[-10%] -top-[80vh] bottom-[-10vh]"
          style={{
            background:
              "linear-gradient(180deg, #010208 0%, #03060f 30%, #060c20 52%, #0b1533 68%, #18204a 80%, #2b2547 88%, #1a1830 100%)",
          }}
        />
      </Layer>

      {/* stars */}
      <Layer depth={0.14} scene={scene} pointer={pointer}>
        <div className="absolute inset-x-[-8%] -top-[80vh] h-[150vh]">
          <StarField brightness={def.stars} started={started} shootKey={shootKey} />
        </div>
      </Layer>

      {/* the moon — rises softly once the stars are out */}
      <Layer depth={0.3} scene={scene} pointer={pointer}>
        <motion.div
          className="absolute left-1/2 top-[13%] w-[min(26vw,17vh)] -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={started ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 6, delay: 2.5, ease: "easeOut" }}
        >
          <Moon glow={0.6 + def.stars * 0.4} />
        </motion.div>
      </Layer>

      <Layer depth={0.42} scene={scene} pointer={pointer}>
        <div className="absolute inset-x-0 -top-[60vh] h-[110vh]">
          <Clouds />
        </div>
      </Layer>

      {/* everything on the ground fades for overlay scenes */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: terraceVisible, filter: `blur(${def.blur}px)` }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
      >
        <Layer depth={0.62} scene={scene} pointer={pointer}>
          <div className="absolute inset-x-[-12%] top-[calc(61%-15vh)] h-[15.5vh]">
            <Skyline />
          </div>
        </Layer>

        <Layer depth={1} scene={scene} pointer={pointer}>
          <div className="absolute inset-y-0 left-[-10%] right-[-10%]">
            <Terrace />
          </div>
          <div className="absolute bottom-[3.5%] left-1/2 aspect-[520/600] h-[min(56vh,calc(92vw*1.154))] -translate-x-1/2 drop-shadow-[0_0_14px_rgba(150,170,255,0.12)]">
            <CoupleStage wife={def.wife} husband={def.husband} warmth={def.warmth} />
          </div>
        </Layer>

        {/* foreground bokeh — out-of-focus diyas close to the lens */}
        <Layer depth={1.4} scene={scene} pointer={pointer}>
          <div className="absolute -bottom-[4%] -left-[4%] opacity-70 blur-[5px]">
            <Diya size={130} delay={0.3} />
          </div>
          <div className="absolute -bottom-[6%] -right-[6%] opacity-50 blur-[8px]">
            <Diya size={170} delay={1.1} />
          </div>
        </Layer>
      </motion.div>

      {/* lens vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(1,2,6,0.75) 100%)" }}
      />
    </div>
  );
}
