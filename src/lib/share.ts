import type { StoryData } from "@/config/story";

/**
 * Shareable links: a client's details travel inside the link itself
 * (?d=…), so a new client needs no code change and no redeploy.
 * Short keys keep the link compact.
 */
export type ShareFields = {
  wifeName: string;
  husbandName: string;
  personalMessage?: string;
  relationshipStartDate?: string;
  karwaChauthDate?: string;
  husbandWhatsApp?: string;
};

const KEYS = {
  w: "wifeName",
  h: "husbandName",
  m: "personalMessage",
  s: "relationshipStartDate",
  k: "karwaChauthDate",
  p: "husbandWhatsApp",
} as const satisfies Record<string, keyof ShareFields>;

const MAX = 1200;

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(code: string) {
  const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function encodeShare(fields: ShareFields): string {
  const out: Record<string, string> = {};
  for (const [short, long] of Object.entries(KEYS)) {
    const v = fields[long]?.trim();
    if (v) out[short] = v;
  }
  return toBase64Url(JSON.stringify(out));
}

/** Decodes a ?d= value; returns null if it is missing or malformed. */
export function decodeShare(code: string | null): Partial<StoryData> | null {
  if (!code) return null;
  try {
    const raw = JSON.parse(fromBase64Url(code)) as Record<string, unknown>;
    const out: Partial<StoryData> = {};
    for (const [short, long] of Object.entries(KEYS)) {
      const v = raw[short];
      if (typeof v === "string" && v.trim()) out[long] = v.trim().slice(0, MAX);
    }
    if (out.husbandWhatsApp) out.husbandWhatsApp = out.husbandWhatsApp.replace(/\D/g, "");
    return out.wifeName && out.husbandName ? out : null;
  } catch {
    return null;
  }
}
