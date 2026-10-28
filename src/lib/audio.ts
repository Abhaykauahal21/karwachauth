/**
 * A bansuri score synthesised live with the Web Audio API —
 * no audio files to download. Only the flute: no drone, no bass, no bells.
 *
 * Two themes (`fluteStyle` in the story config):
 *  • "love"    — a slow romantic melody in D major with the longing of B minor:
 *                soft swells, slow meend glides, a late vibrato on long notes.
 *  • "krishna" — a Krishna-style bansuri in the colour of raag Pahadi: breathier,
 *                with kan swar (grace notes) and murki (quick turns), like a
 *                bamboo flute played under a kadamb tree.
 *
 * If `musicUrl` is set in the story config, that file is played instead.
 */
import type { Mood } from "./scenes";

const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export type FluteStyle = "love" | "krishna";

type Ornament = "kan" | "murki";
/** [midi note, beats, slide into it with meend?, ornament?] */
type Note = [number, number, boolean?, Ornament?];

type Theme = {
  /** seconds per beat */
  beat: number;
  phrases: Note[][];
  order: number[];
  /** 2nd / 3rd harmonic levels: more = hollower, more "bamboo" */
  h2: number;
  h3: number;
  /** breath noise under the tone, 0 = none */
  breath: number;
  /** vibrato depth in cents on long notes */
  vibrato: number;
};

/** D major, for finding the neighbour notes that ornaments flick through. */
const SCALE = [55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 76, 78, 79, 81, 83];
const neighbour = (m: number, dir: 1 | -1) => SCALE[SCALE.indexOf(m) + dir] ?? m + dir * 2;

// D4 62 · E4 64 · F#4 66 · G4 67 · A4 69 · B4 71 · C#5 73 · D5 74 · E5 76 · F#5 78
const THEMES: Record<FluteStyle, Theme> = {
  love: {
    beat: 0.8,
    phrases: [
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
    ],
    order: [0, 1, 2, 3, 0, 4, 5, 3],
    h2: 0.07,
    h3: 0.018,
    breath: 0,
    vibrato: 8,
  },
  krishna: {
    beat: 0.7,
    phrases: [
      // 0 — Pa Dha Sa' … Dha Pa Ga … Re Ga Re Sa
      [[69, 1], [71, 0.5, false, "kan"], [74, 2, true], [71, 0.6], [69, 0.6, false, "murki"], [66, 1.6, true], [64, 0.5], [66, 0.5], [64, 0.6], [62, 3, true]],
      // 1 — Ga Pa Dha … Pa Ga Re Ga
      [[66, 0.75], [69, 0.75], [71, 1.5, true, "kan"], [69, 0.75], [66, 0.75, false, "murki"], [64, 0.75], [66, 3, true]],
      // 2 — up high: Sa' Re' Ga' … Re' Sa' Dha Pa
      [[74, 0.75], [76, 0.75, false, "kan"], [78, 2, true], [76, 0.6], [74, 0.6, false, "murki"], [71, 1.2, true], [69, 3, true]],
      // 3 — Dha Sa' Dha Pa Ga Re Sa
      [[71, 1], [74, 1.5, true], [71, 0.6], [69, 0.6, false, "kan"], [66, 1, true], [64, 0.8, false, "murki"], [62, 3.5, true]],
      // 4 — Sa Re Ga ma … Ga Re Sa (the Pahadi touch of ma)
      [[62, 0.75], [64, 0.75], [66, 0.75], [67, 1.5, true, "kan"], [66, 0.6], [64, 0.6, false, "murki"], [62, 3, true]],
    ],
    order: [0, 1, 2, 3, 4, 1, 2, 3],
    h2: 0.11,
    h3: 0.032,
    breath: 0.03,
    vibrato: 11,
  },
};

export interface Score {
  start(): Promise<void>;
  setMood(m: Mood): void;
  setMuted(muted: boolean): void;
  dispose(): void;
}

export function createScore(musicUrl?: string, style: FluteStyle = "love"): Score {
  if (musicUrl) return new FileScore(musicUrl, style);
  return new GenerativeScore(THEMES[style] ?? THEMES.love);
}

/**
 * Plays your own music file. The browser streams and decodes it natively,
 * off the main thread, so animations can't make it stutter. Volume is a
 * Web Audio gain on the audio thread: smooth fades that work on iPhone too
 * (where an <audio>'s volume can't be changed). If the file is missing or
 * won't play, the synthesised bansuri takes over, so there is always music.
 */
class FileScore implements Score {
  private el: HTMLAudioElement;
  private ctx?: AudioContext;
  private gain?: GainNode;
  private level = 0.7;
  private muted = false;
  private mood?: Mood;
  private fallback?: Score;
  private onVisibility = () => {
    if (document.hidden) this.el.pause();
    else if (!this.muted) this.el.play().catch(() => {});
  };

  constructor(
    url: string,
    private style: FluteStyle,
  ) {
    // created on the start screen, so the file is already buffering before "Begin"
    this.el = new Audio();
    this.el.preload = "auto";
    this.el.loop = true;
    this.el.src = url;
    this.el.load();
  }

  async start() {
    // the file already failed while buffering (e.g. not uploaded): go straight to the flute,
    // still inside the tap, so iOS lets it play
    if (this.el.error) return this.useFallback();
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    try {
      // everything up to play() runs synchronously inside the tap, which iOS requires
      const ctx = new Ctx({ latencyHint: "playback" });
      this.ctx = ctx;
      this.gain = ctx.createGain();
      this.gain.gain.value = 0;
      ctx.createMediaElementSource(this.el).connect(this.gain).connect(ctx.destination);
      const playing = this.el.play();
      await Promise.all([ctx.resume(), playing]);
      document.addEventListener("visibilitychange", this.onVisibility);
      this.ramp(3);
    } catch {
      // file missing, unsupported or blocked: fall back to the synthesised flute
      this.el.pause();
      this.ctx?.close();
      await this.useFallback();
    }
  }

  private async useFallback() {
    this.fallback = new GenerativeScore(THEMES[this.style] ?? THEMES.love);
    await this.fallback.start();
    if (this.mood) this.fallback.setMood(this.mood);
    if (this.muted) this.fallback.setMuted(true);
  }

  private ramp(seconds: number) {
    if (!this.ctx || !this.gain) return;
    const t = this.ctx.currentTime;
    const g = this.gain.gain;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(this.muted ? 0 : this.level, t + seconds);
  }

  setMood(m: Mood) {
    this.mood = m;
    if (this.fallback) return this.fallback.setMood(m);
    // quieter for the intimate scenes, fuller for the happy ones
    this.level = 0.4 + m.level * 0.6;
    this.ramp(3);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.fallback) return this.fallback.setMuted(muted);
    if (!muted) {
      this.ctx?.resume();
      if (this.el.paused) this.el.play().catch(() => {});
    }
    this.ramp(muted ? 0.6 : 1.5);
    if (muted) window.setTimeout(() => this.muted && this.el.pause(), 700);
  }

  dispose() {
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.fallback?.dispose();
    this.el.pause();
    this.el.removeAttribute("src");
    this.el.load();
    this.ctx?.close();
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
  private noise?: AudioBuffer;
  constructor(private theme: Theme) {}
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

    if (this.theme.breath > 0) this.noise = this.noiseBuffer(2);

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
   * Plays the next phrase of the theme. Every note swells softly and fades,
   * long notes bloom into a late vibrato, marked notes slide in with a slow
   * meend, and ornaments flick through neighbour notes. Intimate scenes
   * breathe a little slower. Returns end time.
   */
  private phrase(t0: number) {
    const ctx = this.ctx!;
    const { phrases, order, beat, h2: h2Level, h3: h3Level, breath, vibrato } = this.theme;
    const notes = phrases[order[this.phraseIdx % order.length]];
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
    h2Gain.gain.value = h2Level;
    h3Gain.gain.value = h3Level;
    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    vib.frequency.value = 4.8;
    vibGain.gain.setValueAtTime(0, t0);
    vib.connect(vibGain);
    for (const o of [osc, h2, h3]) vibGain.connect(o.detune);

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.linearRampToValueAtTime(0.085, t0 + 0.4);

    const jump = (f: number, at: number) => {
      osc.frequency.setValueAtTime(f, at);
      h2.frequency.setValueAtTime(f * 2, at);
      h3.frequency.setValueAtTime(f * 3, at);
    };
    const glideTo = (f: number, at: number, tc: number) => {
      osc.frequency.setTargetAtTime(f, at, tc);
      h2.frequency.setTargetAtTime(f * 2, at, tc);
      h3.frequency.setTargetAtTime(f * 3, at, tc);
    };

    let t = t0;
    notes.forEach(([m, beats, slide, ornament], i) => {
      const d = beats * beat * slow;
      const f = midi(m);
      if (ornament === "kan") {
        // kan swar: a fleeting touch of the note above before landing
        jump(midi(neighbour(m, 1)), t);
        glideTo(f, t + 0.07, 0.025);
      } else if (ornament === "murki") {
        // murki: a quick, playful turn — above, home, below, home
        jump(midi(neighbour(m, 1)), t);
        jump(f, t + 0.06);
        jump(midi(neighbour(m, -1)), t + 0.12);
        glideTo(f, t + 0.18, 0.02);
      } else if (i === 0) {
        jump(f, t);
      } else {
        // meend: a slow, singing slide; otherwise a gentle legato step
        glideTo(f, t, slide ? 0.17 : 0.035);
      }
      if (i > 0 && !slide) amp.gain.setTargetAtTime(0.07, t - 0.05, 0.04);
      // each note breathes: rises into its middle, then softens
      amp.gain.setTargetAtTime(0.11, t + 0.06, d * 0.25);
      amp.gain.setTargetAtTime(0.08, t + d * 0.55, d * 0.3);
      // vibrato only blooms on long notes, and only after a moment — like a real player
      vibGain.gain.setTargetAtTime(0, t, 0.05);
      if (d > 1) vibGain.gain.setTargetAtTime(vibrato, t + 0.5, 0.35);
      t += d;
    });
    amp.gain.setTargetAtTime(0.0001, t - 1.1, 0.4);

    osc.connect(amp);
    h2.connect(h2Gain).connect(amp);
    h3.connect(h3Gain).connect(amp);
    amp.connect(this.tone);

    // the air in a bamboo flute: soft breath that follows the same swells
    if (breath > 0 && this.noise) {
      const air = ctx.createBufferSource();
      air.buffer = this.noise;
      air.loop = true;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 1800;
      band.Q.value = 0.8;
      const airGain = ctx.createGain();
      airGain.gain.value = breath;
      air.connect(band).connect(airGain).connect(amp);
      air.start(t0);
      air.stop(t + 0.8);
    }
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

  private noiseBuffer(seconds: number) {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
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
