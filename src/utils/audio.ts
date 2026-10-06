/**
 * Web Audio API Sound Effects Engine
 * Pure synthesized matchday audio: referee whistles, crowd cheers, stadium groans, and goal chimes.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    try {
      const saved = localStorage.getItem('matchpoint_muted');
      if (saved !== null) {
        this.isMuted = JSON.parse(saved);
      }
    } catch {
      this.isMuted = false;
    }
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    try {
      localStorage.setItem('matchpoint_muted', JSON.stringify(muted));
    } catch {}
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Countdown tick sound (subtle click)
   */
  public playTick(secondsLeft: number): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const isUrgent = secondsLeft <= 5;

      const baseFreq = isUrgent ? 1100 : 650;
      osc.type = isUrgent ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(isUrgent ? 0.25 : 0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  /**
   * Synthesized Stadium Crowd Cheer Noise
   */
  public playCrowdCheer(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 1.5; // 1.5 seconds of crowd noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02; // Pink-ish noise filter
        lastOut = data[i];
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 1.45);
    } catch {}
  }

  /**
   * Correct Answer Chime: Matchday Stadium Goal Fanfare + Crowd Cheer
   */
  public playCorrect(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      // Fanfare: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      const now = ctx.currentTime;

      freqs.forEach((freq, idx) => {
        const noteTime = now + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.5);
      });

      // Layer crowd roar
      setTimeout(() => this.playCrowdCheer(), 120);
    } catch {}
  }

  /**
   * Wrong Answer Buzzer + Disappointed Crowd Groan
   */
  public playWrong(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Harsh dual referee error buzzer
      [140, 133].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 0.85, now + 0.35);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.39);
      });

      // Disappointed crowd low groan
      const groanBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.7, ctx.sampleRate);
      const data = groanBuffer.getChannelData(0);
      for (let i = 0; i < groanBuffer.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const groan = ctx.createBufferSource();
      groan.buffer = groanBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.linearRampToValueAtTime(140, now + 0.6);

      const groanGain = ctx.createGain();
      groanGain.gain.setValueAtTime(0.15, now);
      groanGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      groan.connect(filter);
      filter.connect(groanGain);
      groanGain.connect(ctx.destination);

      groan.start(now);
      groan.stop(now + 0.68);
    } catch {}
  }

  /**
   * Authentic Referee Double Whistle (Bweeet! Bweeeeet!)
   */
  public playWhistle(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      
      const playBlast = (startTime: number, duration: number) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';

        // Classic referee pea whistle dual harmonics (approx 2600Hz & 2850Hz)
        osc1.frequency.setValueAtTime(2600, startTime);
        osc2.frequency.setValueAtTime(2850, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.22, startTime + 0.015);
        gain.gain.setValueAtTime(0.22, startTime + duration - 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + duration + 0.02);
        osc2.stop(startTime + duration + 0.02);
      };

      // Blast 1 (short)
      playBlast(now, 0.12);
      // Blast 2 (longer)
      playBlast(now + 0.16, 0.28);
    } catch {}
  }

  /**
   * Leaderboard rank change swoosh/ascend
   */
  public playRankChange(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.25);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  /**
   * Streak bonus celebration chime
   */
  public playStreak(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [880, 1174.66, 1396.91, 1760].forEach((freq, i) => {
        const time = now + i * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.35);
      });
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
