"use client";

import BeatText from "@/components/ui/BeatText";
import type { SceneProps } from "./types";
import { UPPER } from "./placement";

/** He walks across the terrace to stand in front of her. */
export default function CoupleScene({ beat, beatKey, shown }: SceneProps) {
  return <BeatText beat={beat} beatKey={beatKey} shown={shown} className={UPPER} />;
}
