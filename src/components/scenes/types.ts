import type { StoryData } from "@/config/story";
import type { Beat } from "@/lib/timeline";

export type SceneProps = {
  beat: Beat;
  /** global index of the beat — changes when the text should change */
  beatKey: number;
  /** number of lines of this beat currently revealed */
  shown: number;
  story: StoryData;
};
