"use client";

import { RotateCcw } from "lucide-react";

export default function ReplayButton({ onReplay }: { onReplay: () => void }) {
  return (
    <button
      type="button"
      data-ui
      onClick={(e) => {
        e.stopPropagation();
        onReplay();
      }}
      className="flex h-11 items-center gap-2 rounded-full border border-gold/30 px-5 font-sans text-xs tracking-[0.28em] text-gold-soft uppercase transition-colors hover:border-gold/70 hover:bg-gold/5"
    >
      <RotateCcw size={14} strokeWidth={1.5} />
      Replay
    </button>
  );
}
