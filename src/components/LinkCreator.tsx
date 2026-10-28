"use client";

import { Check, Copy, ExternalLink, Send } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { storyData } from "@/config/story";
import { encodeShare, type ShareFields } from "@/lib/share";
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
    husbandWhatsApp: "",
  });
  const [copied, setCopied] = useState(false);
  const set = (k: keyof ShareFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }));
    setCopied(false);
  };

  const ready = f.wifeName.trim() !== "" && f.husbandName.trim() !== "";
  const link = useMemo(() => (ready ? `${origin}/?d=${encodeShare(f)}` : ""), [ready, origin, f]);
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

          <Field label="Husband ka WhatsApp" hint="Optional. Story ke end mein wife isi number par “I love you” bhej payegi.">
            <input
              className={input}
              value={f.husbandWhatsApp}
              onChange={set("husbandWhatsApp")}
              placeholder="919876543210"
              inputMode="numeric"
              maxLength={16}
            />
          </Field>
        </div>

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
