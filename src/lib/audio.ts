/**
 * A tiny generative score, synthesised live with the Web Audio API —
 * no audio files to download.
 *
 *  • tanpura drone (Pa–Sa–Sa–Sa) with a jawari-like filter bloom
 *  • soft ambient pad
 *  • bansuri-style flute phrases in raag Bhupali (D E F# A B)
 *  • temple ghanti during the aarti
 *  • very soft night wind
 *
 * If `musicUrl` is set in the story config, that file is played instead.
 */
import type { Mood } from "./scenes";

const SA = 146.83; // D3
const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
// Bhupali in D across two octaves (flute register)
const SCALE = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83].map(midi);

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
  private verb!: ConvolverNode;
  private noise!: AudioBuffer;
  private timer = 0;
  private mood: Mood = { level: 0.5, bright: 0.3, flute: 0, bells: false };
  private muted = false;
  private nextPluck = 0;
  private pluckIdx = 0;
  private nextPhrase = 0;
  private nextBell = 0;
  private lastNote = 5;
  private onVisibility = () => {
    if (!this.ctx) return;
    if (document.hidden) this.ctx.suspend();
    else if (!this.muted) this.ctx.resume();
  };

  async start() {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    this.ctx = ctx;
    await ctx.resume();

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    this.master.connect(comp).connect(ctx.destination);

    this.tone = ctx.createBiquadFilter();
    this.tone.type = "lowpass";
    this.tone.frequency.value = 1600;
    this.tone.Q.value = 0.4;

    this.verb = ctx.createConvolver();
    this.verb.buffer = this.impulse(4.2);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    const dry = ctx.createGain();
    dry.gain.value = 0.7;
    this.tone.connect(dry).connect(this.master);
    this.tone.connect(this.verb).connect(wet).connect(this.master);

    this.noise = this.noiseBuffer(3);
    this.pad();
    this.wind();

    this.nextPluck = ctx.currentTime + 0.2;
    this.nextPhrase = ctx.currentTime + 6;
    this.nextBell = ctx.currentTime + 2;
    this.timer = window.setInterval(() => this.tick(), 120);
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
    const level = this.muted ? 0 : 0.18 + this.mood.level * 0.5;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(level, t + seconds);
    this.tone.frequency.cancelScheduledValues(t);
    this.tone.frequency.setValueAtTime(this.tone.frequency.value, t);
    this.tone.frequency.exponentialRampToValueAtTime(700 + this.mood.bright * 4200, t + seconds);
  }

  private tick() {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== "running") return;
    const ahead = ctx.currentTime + 0.4;

    // tanpura: Pa – Sa' – Sa' – Sa, one cycle ≈ 4.8s
    while (this.nextPluck < ahead) {
      const strings = [SA * 0.75, SA, SA, SA / 2];
      const gaps = [1.1, 1.1, 1.3, 1.3];
      const i = this.pluckIdx % 4;
      this.pluck(strings[i], this.nextPluck, i === 3 ? 0.2 : 0.13);
      this.nextPluck += gaps[i];
      this.pluckIdx++;
    }

    if (this.mood.flute > 0.02 && this.nextPhrase < ahead) {
      const end = this.phrase(this.nextPhrase);
      this.nextPhrase = end + 2.5 + (1 - this.mood.flute) * 9 + Math.random() * 4;
    } else if (this.mood.flute <= 0.02 && this.nextPhrase < ahead) {
      this.nextPhrase = ahead + 2;
    }

    if (this.nextBell < ahead) {
      if (this.mood.bells) {
        this.bell(this.nextBell, 0.06 + Math.random() * 0.04);
        this.nextBell += 0.9 + Math.random() * 1.6;
      } else {
        // a rare, distant wind-chime even outside the aarti
        if (Math.random() < 0.18) this.bell(this.nextBell, 0.018, 2.2);
        this.nextBell += 6 + Math.random() * 8;
      }
    }
  }

  private pluck(freq: number, t: number, amp: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.Q.value = 3;
    f.frequency.setValueAtTime(500, t);
    f.frequency.linearRampToValueAtTime(2600, t + 0.6); // jawari bloom
    f.frequency.exponentialRampToValueAtTime(700, t + 4);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(amp, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 5);
    f.connect(g).connect(this.tone);
    for (const detune of [-4, 3]) {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = freq;
      o.detune.value = detune;
      o.connect(f);
      o.start(t);
      o.stop(t + 5.1);
    }
  }

  private pad() {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.value = 0.035;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.018;
    lfo.connect(lfoGain).connect(g.gain);
    lfo.start();
    g.connect(this.tone);
    for (const [f, d] of [
      [SA, 0],
      [SA * 1.5, 5],
      [SA * 2, -6],
      [SA * 2.5, 4],
    ]) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.detune.value = d;
      o.connect(g);
      o.start();
    }
  }

  private wind() {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 500;
    bp.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.value = 0.022;
    const lfo = ctx.createOscillator();
    const lg = ctx.createGain();
    lfo.frequency.value = 0.05;
    lg.gain.value = 260;
    lfo.connect(lg).connect(bp.frequency);
    lfo.start();
    src.connect(bp).connect(g).connect(this.master);
    src.start();
  }

  /** One bansuri phrase with meend (glides) between notes. Returns end time. */
  private phrase(t0: number) {
    const ctx = this.ctx!;
    const count = 3 + Math.floor(Math.random() * 4);
    const notes: number[] = [];
    let n = this.lastNote;
    for (let i = 0; i < count; i++) {
      n = Math.max(1, Math.min(SCALE.length - 2, n + [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]));
      notes.push(n);
    }
    // phrases resolve home to Sa or Pa
    notes.push(Math.random() < 0.6 ? 5 : 3);
    this.lastNote = notes[notes.length - 1];

    const durs = notes.map((_, i) => (i === notes.length - 1 ? 2.6 + Math.random() : [0.55, 0.8, 1.1, 1.5][Math.floor(Math.random() * 4)]));
    const total = durs.reduce((a, b) => a + b, 0);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    const over = ctx.createOscillator();
    over.type = "triangle";
    const overGain = ctx.createGain();
    overGain.gain.value = 0.12;
    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    vib.frequency.value = 5.2;
    vibGain.gain.setValueAtTime(0, t0);
    vibGain.gain.linearRampToValueAtTime(7, t0 + total);
    vib.connect(vibGain);
    vibGain.connect(osc.detune);
    vibGain.connect(over.detune);

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.0001, t0);

    // breath
    const breath = ctx.createBufferSource();
    breath.buffer = this.noise;
    const bf = ctx.createBiquadFilter();
    bf.type = "bandpass";
    bf.Q.value = 2;
    const bg = ctx.createGain();
    bg.gain.value = 0.25;

    let t = t0;
    notes.forEach((ni, i) => {
      const f = SCALE[ni];
      if (i === 0) {
        osc.frequency.setValueAtTime(f, t);
        over.frequency.setValueAtTime(f * 2, t);
        bf.frequency.setValueAtTime(f * 2, t);
        amp.gain.exponentialRampToValueAtTime(0.11, t + 0.25);
      } else {
        const glide = Math.random() < 0.35 ? 0.18 : 0.05;
        osc.frequency.setTargetAtTime(f, t, glide);
        over.frequency.setTargetAtTime(f * 2, t, glide);
        bf.frequency.setTargetAtTime(f * 2, t, glide);
        amp.gain.setTargetAtTime(0.085, t - 0.04, 0.03);
        amp.gain.setTargetAtTime(0.11, t + 0.04, 0.08);
      }
      t += durs[i];
    });
    amp.gain.setTargetAtTime(0.0001, t - 1.2, 0.4);

    osc.connect(amp);
    over.connect(overGain).connect(amp);
    breath.connect(bf).connect(bg).connect(amp);
    amp.connect(this.tone);
    for (const o of [osc, over, vib]) {
      o.start(t0);
      o.stop(t + 0.5);
    }
    breath.start(t0);
    breath.stop(t + 0.5);
    return t;
  }

  private bell(t: number, amp: number, pitch = 1) {
    const ctx = this.ctx!;
    const base = (1100 + Math.random() * 500) * pitch;
    for (const [ratio, a, decay] of [
      [1, 1, 2.6],
      [2.32, 0.5, 1.6],
      [4.25, 0.28, 0.9],
      [6.63, 0.14, 0.5],
    ]) {
      const o = ctx.createOscillator();
      o.frequency.value = base * ratio;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(amp * a, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      o.connect(g).connect(this.tone);
      o.start(t);
      o.stop(t + decay + 0.1);
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

  private noiseBuffer(seconds: number) {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }
}
