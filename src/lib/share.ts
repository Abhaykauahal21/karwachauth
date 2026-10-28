import type { StoryData, StoryPhotos } from "@/config/story";

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
  photos?: StoryPhotos;
};

const KEYS = {
  w: "wifeName",
  h: "husbandName",
  m: "personalMessage",
  s: "relationshipStartDate",
  k: "karwaChauthDate",
} as const satisfies Record<string, keyof ShareFields>;

const MAX = 1200;

/** A photo in the private Blob store, e.g. "photos/photo-AbC123.jpg". */
export function isPhotoPathname(v: string) {
  return /^photos\/[\w.-]{1,120}$/.test(v) && !v.includes("..");
}

/** Where the browser loads a stored photo from. */
export function photoSrc(pathname: string) {
  return `/api/photo?p=${encodeURIComponent(pathname)}`;
}

/** Only private-store photo names or plain https image URLs travel in a link. */
function safeUrl(v: unknown): string | undefined {
  if (typeof v !== "string" || v.length > 600) return undefined;
  if (isPhotoPathname(v)) return photoSrc(v);
  try {
    const u = new URL(v);
    return u.protocol === "https:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

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
    const v = (fields[long] as string | undefined)?.trim();
    if (v) out[short] = v;
  }
  const p = fields.photos;
  const photos: Record<string, unknown> = {};
  if (p?.husband) photos.ph = p.husband;
  if (p?.couple) photos.pc = p.couple;
  if (p?.memories?.some(Boolean)) photos.pm = p.memories.map((m) => m ?? "");
  return toBase64Url(JSON.stringify({ ...out, ...photos }));
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
    const photos: StoryPhotos = {};
    const husband = safeUrl(raw.ph);
    const couple = safeUrl(raw.pc);
    if (husband) photos.husband = husband;
    if (couple) photos.couple = couple;
    if (Array.isArray(raw.pm)) photos.memories = raw.pm.slice(0, 8).map((m) => safeUrl(m) ?? "");
    out.photos = photos;
    return out.wifeName && out.husbandName ? out : null;
  } catch {
    return null;
  }
}
