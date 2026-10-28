"use client";

import BeatText from "@/components/ui/BeatText";
import type { SceneProps } from "./types";
import { UPPER } from "./placement";

/** The camera tilts down to the terrace: she waits for the moon, thali in hand. */
export default function TerraceScene({ beat, beatKey, shown }: SceneProps) {
  return <BeatText beat={beat} beatKey={beatKey} shown={shown} className={UPPER} />;
}
