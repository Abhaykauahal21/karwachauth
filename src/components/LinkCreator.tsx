"use client";

import { upload } from "@vercel/blob/client";
import { Check, Copy, ExternalLink, ImagePlus, Loader2, Send, X } from "lucide-react";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { storyData, type StoryPhotos } from "@/config/story";
import { encodeShare, isPhotoPathname, photoSrc, type ShareFields } from "@/lib/share";
import MoonPhase from "./ui/MoonPhase";

const subscribe = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-sans text-[0.68rem] tracking-[0.3em] text-gold/80 uppercase">{label}</span>
      {children}
      {hint && <span className="block font-sans text-xs text-ivory/45">{hint}</span>}
    </label>
  );
}

/** Phone photos are huge; resize to 1400px JPEG before uploading. */
async function shrink(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1400 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * k);
  canvas.height = Math.round(bmp.height * k);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode"))), "image/jpeg", 0.85),
  );
}

const MEMORY_LABELS: Record<string, string> = {
  walk: "Pehli lambi baat",
  sit: "Uski smile",
  lights: "Favourite person",
  wedding: "Shaadi ke phere",
  rain: "Baarish",
};

/** One photo: pick, shrink, upload to the private Blob store, show a thumbnail. Stores the blob pathname. */
function PhotoSlot({
  label,
  url,
  passcode,
  onChange,
  round = false,
}: {
  label: string;
  url?: string;
  passcode: string;
  onChange: (url: string | undefined) => void;
  round?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const blob = await shrink(file);
      const res = await upload("photos/photo.jpg", blob, {
        access: "private",
        handleUploadUrl: "/api/upload",
        clientPayload: passcode,
        contentType: "image/jpeg",
      });
      onChange(res.pathname);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setError(msg.includes("asscode") ? "Passcode galat hai." : "Upload nahi hua. Vercel Blob connected hai?");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const shape = round ? "rounded-full" : "rounded-xl";
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className={`relative grid aspect-square w-full max-w-28 place-items-center overflow-hidden border border-dashed border-gold/35 bg-[#0a1024]/80 text-gold/70 transition-colors hover:border-gold/70 ${shape}`}
        aria-label={`${label} photo ${url ? "badlein" : "lagayein"}`}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element -- thumbnail of the just-uploaded blob
          <img src={isPhotoPathname(url) ? photoSrc(url) : url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : busy ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <ImagePlus size={20} strokeWidth={1.5} />
        )}
      </button>
      <span className="font-sans text-[0.7rem] leading-tight text-ivory/60">{label}</span>
      {url && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="flex items-center gap-1 font-sans text-[0.65rem] tracking-[0.15em] text-ivory/40 uppercase hover:text-rose"
        >
          <X size={11} /> Hatayein
        </button>
      )}
      {error && <span className="font-sans text-[0.7rem] text-rose">{error}</span>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
    </div>
  );
}

const input =
  "w-full rounded-xl border border-gold/20 bg-[#0a1024]/80 px-4 py-3 font-sans text-base text-ivory placeholder:text-ivory/30 outline-none transition-colors focus:border-gold/60";

/**
 * Make a client's link in a minute: type the names (and, if you like, a
 * personal letter), then copy the link or send it straight on WhatsApp.
 * No code changes, no redeploy.
 */
export default function LinkCreator() {
  const origin = useSyncExternalStore(subscribe, getOrigin, getServerOrigin);
  const [f, setF] = useState<ShareFields>({
    wifeName: "",
    husbandName: "",
    personalMessage: "",
    relationshipStartDate: "",
    karwaChauthDate: storyData.karwaChauthDate,
  });
  const [photos, setPhotos] = useState<StoryPhotos>({ memories: [] });
  const [passcode, setPasscode] = useState("");
  const [copied, setCopied] = useState(false);
  const set = (k: keyof ShareFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }));
    setCopied(false);
  };

  const ready = f.wifeName.trim() !== "" && f.husbandName.trim() !== "";
  const link = useMemo(() => (ready ? `${origin}/?d=${encodeShare({ ...f, photos })}` : ""), [ready, origin, f, photos]);
  const setPhoto = (patch: (p: StoryPhotos) => StoryPhotos) => {
    setPhotos(patch);
    setCopied(false);
  };
  const whatsapp = ready
    ? `https://wa.me/?text=${encodeURIComponent(
        `Aapka Karwa Chauth surprise taiyaar hai 🌙\n${f.wifeName.trim()} ke liye, ${f.husbandName.trim()} ki taraf se:\n${link}`,
      )}`
    : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[radial-gradient(80%_50%_at_50%_0%,#121b3d,#02040a_70%)]">
      <main className="mx-auto max-w-xl px-5 py-12 sm:py-16">
        <header className="mb-10 space-y-4 text-center">
          <MoonPhase phase={1} size={36} className="mx-auto" />
          <h1 className="font-serif text-4xl font-light text-moon glow-text sm:text-5xl">Naya link banayein</h1>
          <p className="font-serif text-lg italic text-ivory/60">Naam bhariye, link copy kijiye, aur client ko bhej dijiye.</p>
        </header>

        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Wife ka naam *">
              <input className={input} value={f.wifeName} onChange={set("wifeName")} placeholder="Aarohi" maxLength={40} />
            </Field>
            <Field label="Husband ka naam *">
              <input className={input} value={f.husbandName} onChange={set("husbandName")} placeholder="Rohan" maxLength={40} />
            </Field>
          </div>

          <Field
            label="Personal message"
            hint="Khaali chhodenge toh ek pyaara default letter aayega. Yaad rahe: vrat wife rakhti hai."
          >
            <textarea
              className={`${input} min-h-36 resize-y font-serif text-lg italic`}
              value={f.personalMessage}
              onChange={set("personalMessage")}
              placeholder="Tum meri zindagi ka sabse khoobsurat hissa ho…"
              maxLength={600}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Karwa Chauth date">
              <input className={input} value={f.karwaChauthDate} onChange={set("karwaChauthDate")} maxLength={40} />
            </Field>
            <Field label="Kab se saath hain" hint='Optional, jaise "14 February 2019"'>
              <input className={input} value={f.relationshipStartDate} onChange={set("relationshipStartDate")} maxLength={40} />
            </Field>
          </div>

        </div>

        <section className="mt-10 space-y-5">
          <div className="space-y-1">
            <p className="font-sans text-[0.68rem] tracking-[0.3em] text-gold/80 uppercase">Photos (optional)</p>
            <p className="font-sans text-xs text-ivory/45">
              Husband ki photo channi mein chaand ke baad dikhegi, memories ki photos polaroid ban kar, aur couple photo letter ke upar.
              Jo khaali chhodenge, wahan illustrated scene hi rahega.
            </p>
          </div>
          <div className="mx-auto grid max-w-xs grid-cols-2 gap-6">
            <PhotoSlot
              label="Husband (channi)"
              url={photos.husband}
              passcode={passcode}
              onChange={(url) => setPhoto((p) => ({ ...p, husband: url }))}
              round
            />
            <PhotoSlot
              label="Dono saath (letter)"
              url={photos.couple}
              passcode={passcode}
              onChange={(url) => setPhoto((p) => ({ ...p, couple: url }))}
              round
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {storyData.memories.map((m, i) => (
              <PhotoSlot
                key={i}
                label={MEMORY_LABELS[m.visual] ?? `Memory ${i + 1}`}
                url={photos.memories?.[i] || undefined}
                passcode={passcode}
                onChange={(url) =>
                  setPhoto((p) => {
                    const next = [...(p.memories ?? [])];
                    next[i] = url ?? "";
                    return { ...p, memories: next };
                  })
                }
              />
            ))}
          </div>
          <Field label="Upload passcode" hint="Sirf tab bharein jab Vercel mein CREATE_PASSCODE set kiya ho.">
            <input className={input} value={passcode} onChange={(e) => setPasscode(e.target.value)} type="password" autoComplete="off" />
          </Field>
        </section>

        <section className="mt-10 rounded-2xl border border-gold/25 bg-[#0a1024]/70 p-5">
          <p className="mb-3 font-sans text-[0.68rem] tracking-[0.3em] text-gold/80 uppercase">Client ka link</p>
          {ready ? (
            <>
              <p className="mb-5 font-sans text-sm break-all text-ivory/75">{link}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copy}
                  className="flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#b98f4a] via-[#e9d3a1] to-[#b98f4a] px-5 font-sans text-xs font-medium tracking-[0.2em] text-[#1a1020] uppercase"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy link"}
                </button>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 items-center gap-2 rounded-full border border-gold/40 px-5 font-sans text-xs tracking-[0.2em] text-gold-soft uppercase hover:border-gold"
                >
                  <Send size={14} /> WhatsApp par bhejein
                </a>
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 items-center gap-2 rounded-full border border-ivory/20 px-5 font-sans text-xs tracking-[0.2em] text-ivory/70 uppercase hover:border-ivory/50"
                >
                  <ExternalLink size={14} /> Preview
                </a>
              </div>
            </>
          ) : (
            <p className="font-serif text-lg italic text-ivory/45">Dono naam bharte hi link yahan ban jayega.</p>
          )}
        </section>
      </main>
    </div>
  );
}
