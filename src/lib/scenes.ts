/**
 * Scene definitions — the "shot list" of the film.
 * Each scene tells the persistent world where the camera sits, how the
 * couple is posed, how the light feels and how the score should breathe.
 */

export type SceneId =
  | "intro"
  | "sky"
  | "terrace"
  | "couple"
  | "channi"
  | "dialogue"
  | "blessing"
  | "aarti"
  | "memory"
  | "message"
  | "final"
  | "end";

/** x in vw, y in vh (negative y tilts the camera up toward the sky), z = zoom. */
export type Camera = { x: number; y: number; z: number };

export type WifePose = "moon" | "husband" | "aarti" | "blessed" | "lean";
export type HusbandPose = "away" | "look" | "bless" | "together";

export type Mood = {
  level: number; // master loudness 0..1
  bright: number; // filter brightness 0..1
  flute: number; // flute phrase density 0..1
  bells: boolean;
};

export type SceneDef = {
  camera: Camera;
  wife: WifePose;
  husband: HusbandPose;
  /** 0..1 — opacity of the terrace world behind overlays */
  world: number;
  /** extra blur on the world (px) for overlay scenes */
  blur: number;
  /** star brightness multiplier */
  stars: number;
  /** warm diya light on the couple 0..1 */
  warmth: number;
  letterbox: boolean;
  orbit?: boolean;
  mood: Mood;
  /** seconds for the camera to travel into this scene */
  travel: number;
};

export const SCENES: Record<SceneId, SceneDef> = {
  intro: {
    camera: { x: 0, y: -62, z: 1 },
    wife: "moon",
    husband: "away",
    world: 1,
    blur: 0,
    stars: 1,
    warmth: 0.3,
    letterbox: false,
    mood: { level: 0.5, bright: 0.3, flute: 0, bells: false },
    travel: 0.1,
  },
  sky: {
    camera: { x: 0, y: -56, z: 1.14 },
    wife: "moon",
    husband: "away",
    world: 1,
    blur: 0,
    stars: 1.1,
    warmth: 0.3,
    letterbox: false,
    mood: { level: 0.68, bright: 0.5, flute: 0.5, bells: false },
    travel: 6,
  },
  terrace: {
    camera: { x: 0, y: 0, z: 1 },
    wife: "moon",
    husband: "away",
    world: 1,
    blur: 0,
    stars: 0.9,
    warmth: 0.55,
    letterbox: false,
    mood: { level: 0.75, bright: 0.6, flute: 0.6, bells: false },
    travel: 7,
  },
  couple: {
    camera: { x: 0, y: 2, z: 1.06 },
    wife: "husband",
    husband: "look",
    world: 1,
    blur: 0,
    stars: 0.9,
    warmth: 0.6,
    letterbox: false,
    mood: { level: 0.75, bright: 0.6, flute: 0.5, bells: false },
    travel: 4,
  },
  channi: {
    camera: { x: -4, y: -6, z: 1.3 },
    wife: "moon",
    husband: "look",
    world: 0.55,
    blur: 6,
    stars: 1.5,
    warmth: 0.7,
    letterbox: true,
    mood: { level: 0.42, bright: 0.28, flute: 0.15, bells: false },
    travel: 4,
  },
  dialogue: {
    camera: { x: 0, y: 5, z: 1.2 },
    wife: "husband",
    husband: "look",
    world: 1,
    blur: 0,
    stars: 1.25,
    warmth: 0.75,
    letterbox: true,
    mood: { level: 0.6, bright: 0.45, flute: 0.35, bells: false },
    travel: 4,
  },
  blessing: {
    camera: { x: 1, y: 4, z: 1.24 },
    wife: "blessed",
    husband: "bless",
    world: 1,
    blur: 0,
    stars: 1.2,
    warmth: 0.8,
    letterbox: true,
    mood: { level: 0.66, bright: 0.5, flute: 0.4, bells: false },
    travel: 3.5,
  },
  aarti: {
    camera: { x: 0, y: 6, z: 1.3 },
    wife: "aarti",
    husband: "look",
    world: 1,
    blur: 0,
    stars: 1,
    warmth: 1,
    letterbox: true,
    orbit: true,
    mood: { level: 0.8, bright: 0.7, flute: 0.55, bells: true },
    travel: 3.5,
  },
  memory: {
    camera: { x: 0, y: -30, z: 1.05 },
    wife: "husband",
    husband: "look",
    world: 0,
    blur: 10,
    stars: 0.8,
    warmth: 0.6,
    letterbox: false,
    mood: { level: 0.66, bright: 0.55, flute: 0.65, bells: false },
    travel: 3,
  },
  message: {
    camera: { x: 0, y: -40, z: 1.1 },
    wife: "husband",
    husband: "look",
    world: 0.25,
    blur: 4,
    stars: 1.3,
    warmth: 0.6,
    letterbox: false,
    mood: { level: 0.5, bright: 0.38, flute: 0.25, bells: false },
    travel: 4,
  },
  final: {
    camera: { x: 0, y: -4, z: 0.9 },
    wife: "lean",
    husband: "together",
    world: 1,
    blur: 0,
    stars: 1.2,
    warmth: 0.7,
    letterbox: false,
    mood: { level: 0.74, bright: 0.55, flute: 0.5, bells: false },
    travel: 7,
  },
  end: {
    camera: { x: 0, y: -20, z: 0.84 },
    wife: "lean",
    husband: "together",
    world: 0,
    blur: 0,
    stars: 0,
    warmth: 0.4,
    letterbox: false,
    mood: { level: 0.22, bright: 0.2, flute: 0.1, bells: false },
    travel: 6,
  },
};
