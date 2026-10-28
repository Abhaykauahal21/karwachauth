"use client";

import BeatText from "@/components/ui/BeatText";
import type { SceneProps } from "./types";

/**
 * Spoken lines float like quotes beside whoever says them — her words on
 * her side of the frame (left), his on his (right), with a thin gold tail
 * pointing down to the speaker. On desktop the lines sit beside the couple.
 */
export default function DialogueScene({ beat, beatKey, shown, story }: SceneProps) {
  const isWife = beat.speaker === "wife";
  const side = isWife
    ? "left-0 pl-7 pr-[18%] sm:left-[5vw] sm:top-[30%] sm:max-w-[27vw] sm:pl-0 sm:pr-0 justify-start"
    : "right-0 pr-7 pl-[18%] sm:right-[5vw] sm:top-[30%] sm:max-w-[27vw] sm:pr-0 sm:pl-0 justify-end";
  return (
    <BeatText
      beat={beat}
      beatKey={beatKey}
      shown={shown}
      align={isWife ? "left" : "right"}
      speakerName={isWife ? story.wifeName : story.husbandName}
      quote
      className={`absolute top-[21%] flex w-full ${side}`}
    />
  );
}
