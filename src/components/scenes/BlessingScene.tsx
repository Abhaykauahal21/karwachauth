"use client";

import BeatText from "@/components/ui/BeatText";
import type { SceneProps } from "./types";
import { UPPER } from "./placement";

/** Ashirwaad — his hand rests gently over her head as he blesses her. (His words are routed to DialogueScene.) */
export default function BlessingScene(props: SceneProps) {
  return <BeatText beat={props.beat} beatKey={props.beatKey} shown={props.shown} className={UPPER} />;
}
