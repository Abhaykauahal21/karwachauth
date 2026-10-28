/**
 * A love theme for bansuri, synthesised live with the Web Audio API —
 * no audio files to download.
 *
 * Only the flute: no drone, no bass, no bells. It plays a composed,
 * slow romantic melody in D major (with the longing of B minor), in the
 * flute's warm middle register: soft swells, slow meend glides between
 * notes, and a late vibrato on the long notes.
 *
 * If `musicUrl` is set in the story config, that file is played instead.
 */
import type { Mood } from "./scenes";

const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

/** One beat of the theme, in seconds — slow, like a heartbeat at rest. */
const BEAT = 0.8;

/** [midi note, beats, slide into it with meend?] */
type Note = [number, number, boolean?];

// D4 62 · E4 64 · F#4 66 · G4 67 · A4 69 · B4 71 · C#5 73 · D5 74 · E5 76 · F#5 78
const PHRASES: Note[][] = [
  // 0 — a tender opening
  [[69, 1.5], [71, 0.75], [69, 0.75], [66, 2, true], [64, 0.75], [66, 0.75], [62, 3.5, true]],
  // 1 — longing, reaching up
  [[66, 1], [69, 1], [74, 2.5, true], [73, 0.75], [71, 0.75], [69, 3, true]],
  // 2 — a sigh falling back down
  [[71, 1.25], [69, 0.6], [67, 0.6], [66, 2, true], [64, 1], [62, 1], [64, 3.5, true]],
  // 3 — coming home
  [[69, 1], [66, 1], [69, 1], [71, 1.75, true], [69, 0.9], [66, 0.9], [62, 4, true]],
  // 4 — the heart swells
  [[74, 1.75], [76, 0.9], [78, 2.75, true], [76, 0.75], [74, 0.75], [71, 1.5, true], [69, 3.5, true]],
  // 5 — a gentle answer
  [[67, 1], [69, 1], [71, 2, true], [69, 0.75], [67, 0.75], [66, 1.25], [64, 1], [62, 3.75, true]],
];
const ORDER = [0, 1, 2, 3, 0, 4, 5, 3];

export interface Score {
  start(): Promise<void>;
  setMood(m: Mood): void;
  setMuted(muted: boolean): void;
  dispose(): void;
}

export function createScore(musicUrl?: string): Score {
  if (musicUrl) return new FileScore(musicUrl);
  return new GenerativeScore();
}

class FileScore implements Score {
  private el: HTMLAudioElement;
  private level = 0.6;
  private muted = false;
  private raf = 0;
  constructor(url: string) {
    this.el = new Audio(url);
    this.el.loop = true;
    this.el.volume = 0;
  }
  async start() {
    try {
      await this.el.play();
    } catch {
      /* autoplay refused — the toggle will retry */
    }
    this.fade();
  }
  private fade() {
    cancelAnimationFrame(this.raf);
    const step = () => {
      const target = this.muted ? 0 : this.level;
      const v = this.el.volume + (target - this.el.volume) * 0.04;
      this.el.volume = Math.max(0, Math.min(1, v));
      if (Math.abs(target - v) > 0.005) this.raf = requestAnimationFrame(step);
      else this.el.volume = target;
    };
    this.raf = requestAnimationFrame(step);
  }
  setMood(m: Mood) {
    this.level = 0.25 + m.level * 0.6;
    this.fade();
  }
  setMuted(muted: boolean) {
    this.muted = muted;
    if (!muted && this.el.paused) this.el.play().catch(() => {});
    this.fade();
  }
  dispose() {
    cancelAnimationFrame(this.raf);
    this.el.pause();
  }
}

class GenerativeScore implements Score {
  private ctx?: AudioContext;
  private master!: GainNode;
  private tone!: BiquadFilterNode;
  private timer = 0;
  private light = false;
  private mood: Mood = { level: 0.5, bright: 0.3, flute: 0, bells: false };
  private muted = false;
  private nextPhrase = 0;
  private phraseIdx = 0;
  private onVisibility = () => {
    if (!this.ctx) return;
    if (document.hidden) this.ctx.suspend();
    else if (!this.muted) this.ctx.resume();
  };

  async start() {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    // "playback" asks for a larger output buffer: far fewer crackles on phones
    const ctx = new Ctx({ latencyHint: "playback" });
    this.ctx = ctx;
    await ctx.resume();
    this.light = window.matchMedia("(pointer: coarse)").matches || (navigator.hardwareConcurrency || 8) <= 4;

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.ratio.value = 2.5;
    this.master.connect(comp).connect(ctx.destination);

    this.tone = ctx.createBiquadFilter();
    this.tone.type = "lowpass";
    this.tone.frequency.value = 1400;
    this.tone.Q.value = 0.3;

    const dry = ctx.createGain();
    dry.gain.value = 0.72;
    this.tone.connect(dry).connect(this.master);
    if (this.light) this.echoSpace(this.tone, this.master);
    else this.convolverSpace(this.tone, this.master);

    this.nextPhrase = ctx.currentTime + 1.2;
    this.tick();
    this.timer = window.setInterval(() => this.tick(), 250);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.applyMood(4);
  }

  setMood(m: Mood) {
    this.mood = m;
    this.applyMood(3.5);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (!this.ctx || !this.master) return;
    if (!muted) this.ctx.resume();
    this.applyMood(muted ? 0.6 : 1.5);
    if (muted) {
      const ctx = this.ctx;
      window.setTimeout(() => this.muted && ctx.suspend(), 900);
    }
  }

  dispose() {
    window.clearInterval(this.timer);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.ctx?.close();
  }

  // ── internals ─────────────────────────────────────────────────

  private applyMood(seconds: number) {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const level = this.muted ? 0 : 0.22 + this.mood.level * 0.45;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(level, t + seconds);
    // the filter never opens past ~2.4 kHz: everything stays round and soft
    this.tone.frequency.cancelScheduledValues(t);
    this.tone.frequency.setValueAtTime(this.tone.frequency.value, t);
    this.tone.frequency.exponentialRampToValueAtTime(900 + this.mood.bright * 1500, t + seconds);
  }

  private tick() {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== "running") return;
    // schedule well ahead on the audio clock, so a busy main thread (animations,
    // canvas, scene changes) can never make a note late
    const now = ctx.currentTime;
    const ahead = now + 2.5;
    // after a long stall (tab hidden, phone locked) skip missed notes instead of bursting them
    if (this.nextPhrase < now) this.nextPhrase = now + 1;

    // the flute is the whole score, so it only pauses to breathe between phrases
    if (this.nextPhrase < ahead) {
      const end = this.phrase(this.nextPhrase);
      this.nextPhrase = end + 0.7 + (1 - Math.max(0.35, this.mood.flute)) * 1.6;
    }
  }

  /**
   * Plays the next phrase of the love theme. Every note swells softly and
   * fades, long notes bloom into a late vibrato, and marked notes slide in
   * with a slow meend. Intimate scenes breathe a little slower. Returns end time.
   */
  private phrase(t0: number) {
    const ctx = this.ctx!;
    const notes = PHRASES[ORDER[this.phraseIdx % ORDER.length]];
    this.phraseIdx++;
    const slow = 1 + (1 - this.mood.level) * 0.3;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    // a whisper of the 2nd and 3rd harmonics gives the hollow, breathy bansuri colour
    const h2 = ctx.createOscillator();
    const h3 = ctx.createOscillator();
    h2.type = h3.type = "sine";
    const h2Gain = ctx.createGain();
    const h3Gain = ctx.createGain();
    h2Gain.gain.value = 0.07;
    h3Gain.gain.value = 0.018;
    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    vib.frequency.value = 4.8;
    vibGain.gain.setValueAtTime(0, t0);
    vib.connect(vibGain);
    for (const o of [osc, h2, h3]) vibGain.connect(o.detune);

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.linearRampToValueAtTime(0.085, t0 + 0.4);

    let t = t0;
    notes.forEach(([m, beats, slide], i) => {
      const d = beats * BEAT * slow;
      const f = midi(m);
      if (i === 0) {
        osc.frequency.setValueAtTime(f, t);
        h2.frequency.setValueAtTime(f * 2, t);
        h3.frequency.setValueAtTime(f * 3, t);
      } else {
        // meend: a slow, singing slide; otherwise a gentle legato step
        const glide = slide ? 0.17 : 0.035;
        osc.frequency.setTargetAtTime(f, t, glide);
        h2.frequency.setTargetAtTime(f * 2, t, glide);
        h3.frequency.setTargetAtTime(f * 3, t, glide);
        if (!slide) amp.gain.setTargetAtTime(0.07, t - 0.05, 0.04);
      }
      // each note breathes: rises into its middle, then softens
      amp.gain.setTargetAtTime(0.11, t + 0.06, d * 0.25);
      amp.gain.setTargetAtTime(0.08, t + d * 0.55, d * 0.3);
      // vibrato only blooms on long notes, and only after a moment — like a real player
      vibGain.gain.setTargetAtTime(0, t, 0.05);
      if (d > 1) vibGain.gain.setTargetAtTime(8, t + 0.5, 0.35);
      t += d;
    });
    amp.gain.setTargetAtTime(0.0001, t - 1.1, 0.4);

    osc.connect(amp);
    h2.connect(h2Gain).connect(amp);
    h3.connect(h3Gain).connect(amp);
    amp.connect(this.tone);
    for (const o of [osc, h2, h3, vib]) {
      o.start(t0);
      o.stop(t + 0.8);
    }
    return t;
  }

  /** Rich convolution reverb for desktops. */
  private convolverSpace(from: AudioNode, to: AudioNode) {
    const ctx = this.ctx!;
    const verb = ctx.createConvolver();
    verb.buffer = this.impulse(3.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.7;
    from.connect(verb).connect(wet).connect(to);
  }

  /** Cheap feedback-delay "room" for phones — a fraction of the CPU of a convolver. */
  private echoSpace(from: AudioNode, to: AudioNode) {
    const ctx = this.ctx!;
    const input = ctx.createGain();
    const out = ctx.createGain();
    from.connect(input);
    out.connect(to);
    out.gain.value = 0.5;
    for (const [time, fb] of [
      [0.27, 0.48],
      [0.41, 0.42],
    ]) {
      const d = ctx.createDelay(1);
      d.delayTime.value = time;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1800;
      const g = ctx.createGain();
      g.gain.value = fb;
      input.connect(d);
      d.connect(lp).connect(g).connect(d);
      lp.connect(out);
    }
  }

  private impulse(seconds: number) {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return buf;
  }
}
