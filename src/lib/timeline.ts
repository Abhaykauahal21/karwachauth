import type { Memory, Speaker, StoryData } from "@/config/story";
import type { SceneId } from "./scenes";

export type TextStyle =
  | "script" // handwritten accent
  | "serif" // editorial narration
  | "display" // big emotional headline
  | "dialogue" // spoken line near a character
  | "letter" // the personal message
  | "names" // HUSBAND ♥ WIFE
  | "signature";

export type Beat = {
  scene: SceneId;
  lines: string[];
  style: TextStyle;
  speaker?: Speaker;
  typewriter?: boolean;
  /** scene-specific sub state: channi phase, memory visual, … */
  sub?: string;
  hearts?: boolean;
  /** wait for a tap instead of auto-advancing */
  hold?: boolean;
  /** a real photo shown with this beat (memory polaroids) */
  photo?: string;
  /** ms after the beat starts before each line appears */
  delays: number[];
  /** ms until auto-advance */
  duration: number;
};

type BeatInput = Omit<Beat, "delays" | "duration"> & { lead?: number; linger?: number };

const readMs = (s: string) => 900 + s.length * 52;

function finalize(b: BeatInput): Beat {
  const { lead = 700, linger = 2200, ...rest } = b;
  const typeMs = b.typewriter ? 95 : 0;
  const delays: number[] = [];
  let t = lead;
  b.lines.forEach((line, i) => {
    delays.push(t);
    const next = b.lines[i + 1];
    if (next !== undefined) t += readMs(line) + line.length * typeMs + 350;
    else t += readMs(line) + line.length * typeMs;
  });
  return { ...rest, delays, duration: t + linger };
}

export function fill(text: string, d: StoryData) {
  return text
    .replaceAll("{wife}", d.wifeName)
    .replaceAll("{husband}", d.husbandName)
    .replaceAll("{date}", d.karwaChauthDate)
    .replaceAll("{since}", d.relationshipStartDate)
    .replaceAll("{memory}", d.favoriteMemory ?? "");
}

export function buildTimeline(d: StoryData): Beat[] {
  const f = (lines: string[]) => lines.map((l) => fill(l, d));
  const beats: BeatInput[] = [];

  // ── 1. Intro: darkness, stars, a name ──────────────────────────
  beats.push({ scene: "intro", lines: f(["Dear {wife}…"]), style: "script", typewriter: true, lead: 3600, linger: 1800 });
  beats.push({ scene: "intro", lines: ["I made something for you."], style: "serif", lead: 500 });
  beats.push({
    scene: "intro",
    lines: ["Because some feelings deserve more than just a message."],
    style: "serif",
    lead: 500,
    linger: 2600,
  });

  // ── 2. The sky — the moon becomes our storyteller ──────────────
  beats.push({ scene: "sky", lines: ["Tonight isn't just about the moon…"], style: "serif", lead: 2600 });
  beats.push({ scene: "sky", lines: ["Tonight is about you."], style: "display", lead: 400, linger: 2800 });
  if (d.relationshipStartDate) {
    beats.push({
      scene: "sky",
      lines: f(["Since {since}…", "you have been my favourite chapter."]),
      style: "serif",
    });
  }

  // ── 3. The terrace — she waits for the moon ───────────────────
  beats.push({ scene: "terrace", speaker: "husband", lines: ["Har saal tum chaand ka intezaar karti ho…"], style: "dialogue", lead: 4200 });
  beats.push({ scene: "terrace", speaker: "husband", lines: ["…aur main?", "Main bas tumhe dekhta rehta hoon."], style: "dialogue" });

  // ── 4. He arrives ──────────────────────────────────────────────
  beats.push({
    scene: "couple",
    speaker: "husband",
    lines: ["Din bhar ka nirjala vrat tumne rakha…", "sirf meri lambi umar ki dua ke liye."],
    style: "dialogue",
    lead: 2600,
  });
  beats.push({ scene: "couple", speaker: "husband", lines: ["Aaj ki raat…", "sirf tumhare naam."], style: "dialogue" });

  // ── 5. The channi — the climax ─────────────────────────────────
  beats.push({ scene: "channi", sub: "moon", lines: ["Phir chaand nikla…"], style: "serif", lead: 2600 });
  beats.push({ scene: "channi", sub: "moon", lines: ["Tumne channi uthayi…", "aur chaand ko dekha."], style: "serif" });
  beats.push({ scene: "channi", sub: "him", lines: ["…phir mujhe."], style: "script", lead: 3200, hearts: true });
  beats.push({
    scene: "channi",
    sub: "him",
    lines: ["Aur us ek pal mein,", "saari duniya tham si gayi."],
    style: "serif",
    hearts: true,
    linger: 2800,
  });

  // ── 6. The conversation ────────────────────────────────────────
  d.dialogues.forEach((dl, i) =>
    beats.push({
      scene: "dialogue",
      speaker: dl.speaker,
      lines: f(dl.lines),
      style: "dialogue",
      lead: i === 0 ? 2600 : 600,
    }),
  );

  // ── 7. Ashirwaad ───────────────────────────────────────────────
  const bless = f(d.blessing);
  for (let i = 0; i < bless.length; i += 2) {
    beats.push({
      scene: "blessing",
      speaker: "husband",
      lines: bless.slice(i, i + 2),
      style: "dialogue",
      lead: i === 0 ? 2800 : 600,
    });
  }
  beats.push({
    scene: "blessing",
    lines: f(["Happy Karwa Chauth, {wife}."]),
    style: "display",
    hearts: true,
    linger: 3000,
  });

  // ── 8. Aarti ───────────────────────────────────────────────────
  beats.push({
    scene: "aarti",
    speaker: "husband",
    lines: ["Diye ki roshni mein…", "tumhari aankhon ki chamak aur bhi gehri lagti hai."],
    style: "dialogue",
    lead: 3000,
  });
  beats.push({ scene: "aarti", speaker: "husband", lines: ["Tum ho…", "toh har din tyohaar hai."], style: "dialogue", linger: 3000 });

  // ── 9. Memory montage ──────────────────────────────────────────
  const photos = d.photos?.memories ?? [];
  const memories: (Memory & { photo?: string })[] = d.memories.map((m, i) => ({ ...m, photo: photos[i] || undefined }));
  if (d.favoriteMemory) {
    const at = memories.findIndex((m) => m.visual === "wedding");
    memories.splice(at < 0 ? memories.length : at, 0, {
      visual: "walk",
      lines: ["Aur yaad hai…", "Humari pehli {memory}?"],
      photo: undefined,
    });
  }
  memories.forEach((m, i) =>
    beats.push({
      scene: "memory",
      sub: m.visual,
      photo: m.photo,
      lines: f(m.lines),
      style: "serif",
      lead: i === 0 ? 2200 : 1400,
    }),
  );

  // ── 10. The letter ─────────────────────────────────────────────
  beats.push({ scene: "message", lines: [`${d.husbandName}|${d.wifeName}`], style: "names", lead: 2400, linger: 2000 });
  beats.push({ scene: "message", lines: ["Ek chhoti si baat kehni thi…"], style: "script", lead: 400 });
  beats.push({
    scene: "message",
    lines: [fill(d.personalMessage, d)],
    style: "letter",
    lead: 600,
    hearts: true,
    hold: true,
    linger: 3000,
  });

  // ── 11. Final ──────────────────────────────────────────────────
  beats.push({
    scene: "final",
    speaker: "husband",
    lines: ["Chaand har saal badalta rahega…", "Par meri mohabbat tumhare liye kabhi nahi badlegi."],
    style: "dialogue",
    lead: 3800,
    linger: 2800,
  });
  beats.push({ scene: "final", lines: ["Happy Karwa Chauth"], style: "display", hearts: true, linger: 2600 });
  beats.push({ scene: "final", lines: ["Forever yours,", d.husbandName], style: "signature", linger: 3600 });

  // ── 12. Darkness, one star ─────────────────────────────────────
  beats.push({ scene: "end", sub: "end", lines: [], style: "serif", hold: true, lead: 0, linger: 0 });

  return beats.map(finalize);
}
