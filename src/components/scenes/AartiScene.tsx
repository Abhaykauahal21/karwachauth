"use client";

import BeatText from "@/components/ui/BeatText";
import type { SceneProps } from "./types";
import { UPPER } from "./placement";

/**
 * The aarti — the thali circles, the diya flickers, the camera slowly orbits.
 * (The orbit and the light live in the World; this scene carries the words.)
 */
export default function AartiScene({ beat, beatKey, shown }: SceneProps) {
  return <BeatText beat={beat} beatKey={beatKey} shown={shown} className={UPPER} />;
}
