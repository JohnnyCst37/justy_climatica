export type SoundscapePreset = 'cerrado' | 'amazonia' | 'pantanal' | 'buritis' | 'drama';

interface MotifConfig {
  notes: number[];
  staggerSec: number;
  decaySec: number;
  filterFreq: number;
  peakGain: number;
  wave: OscillatorType;
}

const MOTIF_PRESETS: Record<SoundscapePreset, MotifConfig> = {
  cerrado: {
    notes: [261.63, 329.63, 392.0],
    staggerSec: 0,
    decaySec: 1.2,
    filterFreq: 900,
    peakGain: 0.05,
    wave: 'sine',
  },
  amazonia: {
    notes: [293.66, 369.99, 440.0, 587.33],
    staggerSec: 0.09,
    decaySec: 1.1,
    filterFreq: 1400,
    peakGain: 0.045,
    wave: 'sine',
  },
  pantanal: {
    notes: [246.94, 329.63, 493.88],
    staggerSec: 0.11,
    decaySec: 1.3,
    filterFreq: 1100,
    peakGain: 0.045,
    wave: 'triangle',
  },
  buritis: {
    notes: [329.63, 392.0, 587.33],
    staggerSec: 0.085,
    decaySec: 1.1,
    filterFreq: 1300,
    peakGain: 0.04,
    wave: 'sine',
  },
  drama: {
    notes: [110.0, 164.81],
    staggerSec: 0,
    decaySec: 1.5,
    filterFreq: 380,
    peakGain: 0.055,
    wave: 'triangle',
  },
};

const CHIME_CONFIG: MotifConfig = {
  notes: [392.0, 523.25],
  staggerSec: 0.08,
  decaySec: 0.6,
  filterFreq: 1200,
  peakGain: 0.05,
  wave: 'sine',
};

const TRANSITION_COOLDOWN_MS = 450;

class LyriaSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private initialized = false;
  private muted = false;
  private currentPreset: SoundscapePreset = 'cerrado';
  private lastTransitionAt = 0;
  private readonly baseVolume = 1.0;

  public initOnLogin(): void {
    if (typeof window === 'undefined') return;
    if (this.initialized) {
      if (this.ctx?.state === 'suspended') {
        void this.ctx.resume();
      }
      return;
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : this.baseVolume;
    this.masterGain.connect(this.ctx.destination);
    this.initialized = true;
  }

  public setThemeAmbience(preset: SoundscapePreset): void {
    this.currentPreset = preset;
    if (!this.initialized || this.muted || !this.ctx || !this.masterGain) return;
    const nowMs = Date.now();
    if (nowMs - this.lastTransitionAt < TRANSITION_COOLDOWN_MS) return;
    this.lastTransitionAt = nowMs;
    this.playSelfTerminatingMotif(MOTIF_PRESETS[this.currentPreset]);
  }

  private playSelfTerminatingMotif(cfg: MotifConfig): void {
    if (!this.ctx || !this.masterGain || this.muted) return;
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cfg.filterFreq, now);
    filter.connect(this.masterGain);

    cfg.notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const startTime = now + idx * cfg.staggerSec;
      const stopTime = startTime + cfg.decaySec + 0.05;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      osc.type = cfg.wave;
      osc.frequency.setValueAtTime(freq, startTime);

      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.linearRampToValueAtTime(cfg.peakGain, startTime + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + cfg.decaySec);

      osc.connect(noteGain);
      noteGain.connect(filter);
      osc.onended = () => {
        osc.disconnect();
        noteGain.disconnect();
      };
      osc.start(startTime);
      osc.stop(stopTime);
    });
  }

  public setVoiceDucking(isSpeaking: boolean): void {
    if (!this.ctx || !this.masterGain || this.muted) return;
    const now = this.ctx.currentTime;
    const target = isSpeaking ? 0.02 : this.baseVolume;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(target, now + 0.2);
  }

  public setMuted(mute: boolean): void {
    this.muted = mute;
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(mute ? 0 : this.baseVolume, now + 0.2);
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public playTransitionChime(): void {
    if (!this.initialized || !this.ctx || !this.masterGain || this.muted) return;
    const nowMs = Date.now();
    if (nowMs - this.lastTransitionAt < TRANSITION_COOLDOWN_MS) return;
    this.lastTransitionAt = nowMs;
    this.playSelfTerminatingMotif(CHIME_CONFIG);
  }
}

export const lyriaEngine = new LyriaSoundscapeEngine();
