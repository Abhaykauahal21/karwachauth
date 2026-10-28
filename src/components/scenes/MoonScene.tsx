"use client";

import BeatText from "@/components/ui/BeatText";
import type { SceneProps } from "./types";
import { LOWER_CENTER } from "./placement";

/** The camera rests on the moon — the storyteller of tonight. */
export default function MoonScene({ beat, beatKey, shown }: SceneProps) {
  return <BeatText beat={beat} beatKey={beatKey} shown={shown} className={LOWER_CENTER} />;
}
