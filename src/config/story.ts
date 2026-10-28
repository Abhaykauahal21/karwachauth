/**
 * ─────────────────────────────────────────────────────────────
 *  STORY CONFIG — edit this file to personalise the experience.
 * ─────────────────────────────────────────────────────────────
 *
 *  Everything the story says is rendered from `storyData`.
 *  Use {wife}, {husband}, {date}, {since} and {memory} anywhere in a line
 *  and they will be replaced with the values below.
 *
 *  Names can also be overridden from the link itself:
 *    https://your-site.com/?w=Aarohi&h=Rohan
 */

export type Speaker = "wife" | "husband";

export type Dialogue = {
  speaker: Speaker;
  /** Each entry appears after a gentle pause. */
  lines: string[];
};

export type MemoryVisual = "walk" | "sit" | "lights" | "wedding" | "rain";

export type Memory = {
  visual: MemoryVisual;
  lines: string[];
};

/** Real photos of the couple. Paths in /public ("/clients/aarohi/husband.jpg") or https URLs. */
export type StoryPhotos = {
  /** His face, seen through the channi right after the moon. */
  husband?: string;
  /** One per memory, in the same order, shown as polaroids in the montage. */
  memories?: string[];
  /** The two of them, above the personal letter. */
  couple?: string;
};

export type StoryData = {
  wifeName: string;
  husbandName: string;
  /** Tonight's Karwa Chauth, shown on the opening and closing screens. */
  karwaChauthDate: string;
  /** Optional: when it all began, e.g. "14 February 2019". Adds "Since …, you have been my favourite chapter." Leave "" to skip. */
  relationshipStartDate: string;
  /** Optional, only if you know it: completes "Aur yaad hai… humari pehli ___?". Leave "" to skip. */
  favoriteMemory?: string;
  personalMessage: string;
  dialogues: Dialogue[];
  blessing: string[];
  memories: Memory[];
  /** Optional: drop an mp3 into /public and put its path here, e.g. "/music.mp3".
   *  When empty, a soft generative tanpura + flute score is synthesised live. */
  musicUrl?: string;
  /** Optional real photos; without them the illustrated scenes are used. */
  photos?: StoryPhotos;
};

export const storyData: StoryData = {
  wifeName: "Aarohi",
  husbandName: "Rohan",
  karwaChauthDate: "29 October 2026",
  relationshipStartDate: "",
  favoriteMemory: "",

  personalMessage:
    "Tum meri zindagi ka sabse khoobsurat hissa ho. Aaj tumne mere liye din bhar na kuch khaya, na kuch piya — sirf meri lambi umar ki dua mein. Main bas itna kehna chahta hoon: tumhari har dua ka jawab main banna chahta hoon, aur har din tumhe utna hi khush rakhna chahta hoon jitna tum mujhe rakhti ho. Shukriya, meri hone ke liye.",

  dialogues: [
    {
      speaker: "wife",
      lines: ["Har saal Karwa Chauth aata hai…", "…par har saal tum mere liye aur bhi khaas ho jaate ho."],
    },
    {
      speaker: "husband",
      lines: ["Chaand ko dekh kar tumhari pooja poori hoti hai…", "Par meri har dua tumse shuru hoti hai."],
    },
    {
      speaker: "wife",
      lines: ["Bas ek hi dua hai…", "Har janam tum mere saath raho."],
    },
    {
      speaker: "husband",
      lines: ["Janam kitne bhi ho…", "Har baar tum hi meri zindagi banna."],
    },
  ],

  blessing: [
    "Hamesha khush raho.",
    "Har mushkil tumse door rahe.",
    "Zindagi tumhe har woh khushi de jiske tum laayak ho.",
  ],

  // Universal moments, true for every couple, so nobody gets a memory that isn't theirs.
  memories: [
    { visual: "walk", lines: ["Yaad hai…", "Jab humne pehli baar itni der tak baat ki thi?"] },
    { visual: "sit", lines: ["Yaad hai…", "Jab tumhari ek smile ne mera poora din badal diya tha?"] },
    {
      visual: "lights",
      lines: ["Shayad tabhi samajh jaana chahiye tha…", "…ki tum meri favourite person banne wali ho."],
    },
    { visual: "wedding", lines: ["Aur phir woh din aaya…", "jab saat pheron ke saath tum meri zindagi ka hissa bani."] },
  ],

  musicUrl: "",
  photos: {},
};
