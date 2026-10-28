"use client";

import BeatText from "@/components/ui/BeatText";
import type { SceneProps } from "./types";
import { CENTER } from "./placement";

/** Darkness, the first stars, and her name. */
export default function IntroScene({ beat, beatKey, shown }: SceneProps) {
  return <BeatText beat={beat} beatKey={beatKey} shown={shown} className={`${CENTER} max-w-3xl mx-auto`} />;
}
