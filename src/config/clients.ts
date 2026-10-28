/**
 * ─────────────────────────────────────────────────────────────
 *  CLIENTS — one entry per couple, each gets their own link.
 * ─────────────────────────────────────────────────────────────
 *
 *  The key becomes the URL:   "aarohi"  →  https://your-site.com/aarohi
 *  Use lowercase letters, numbers and dashes only (e.g. "priya-amit").
 *
 *  Only the names are required. Anything you leave out falls back to the
 *  universal story in `story.ts` — dialogues, blessing, wedding memory,
 *  and a warm default letter — so a new client takes about a minute.
 *
 *  After adding a client, redeploy; the new link works immediately.
 */
import { storyData, type StoryData } from "./story";

type ClientEntry = Pick<StoryData, "wifeName" | "husbandName"> & Partial<StoryData>;

export const clients: Record<string, ClientEntry> = {
  aarohi: {
    wifeName: "Aarohi",
    husbandName: "Rohan",
  },
  priya: {
    wifeName: "Priya",
    husbandName: "Amit",
    personalMessage:
      "Priya, tum ho toh ghar ghar lagta hai. Aaj tumne mere liye vrat rakha — aur main har din tumhare liye dua karta hoon ki tumhari har khushi poori ho.",
  },
};

/** The full story for a client, or null if the link doesn't exist. */
export function getClientStory(slug: string): StoryData | null {
  const c = clients[slug];
  if (!c) return null;
  return {
    ...storyData,
    // details that only fit one couple never leak from the demo story
    relationshipStartDate: "",
    favoriteMemory: "",
    ...c,
  };
}
