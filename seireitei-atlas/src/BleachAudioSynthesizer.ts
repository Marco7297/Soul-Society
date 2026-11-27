/**
 * Authentic procedural Web Audio API sound effect synthesizer for Bleach anime effects:
 * - Shikai: Crystalline steel blade draw & metallic ring overtone
 * - Bankai: Heavy sub-bass earthquake rumble, thunder shockwave, and roaring Reiatsu flare
 * - Shunpo: Instantaneous high-velocity supersonic air displacement pop & whistle
 * - Kidō (Hadō/Bakudō): Spiritual energy vortex charge-up & resonant laser detonation
 * - Sekkiseki: Stone resonance & low-frequency Reishi nullification pulse
 * - Konsō: Serene temple bell shimmer guiding a soul to the afterlife
 */
export class BleachAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  private async resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  /**
   * 1. 始解 (Shikai): Crystalline Katana Draw & Metallic Sheen Ring
   */
  public async playShikai() {
    try {
      await this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.35, now);
      master.connect(this.ctx.destination);

      const harmonics = [
        { freq: 1174.66, gain: 0.28, type: 'sine' as OscillatorType, decay: 1.2 },
        { freq: 1760.0, gain: 0.2, type: 'triangle' as OscillatorType, decay: 0.95 },
        { freq: 2349.32, gain: 0.15, type: 'sine' as OscillatorType, decay: 0.75 },
        { freq: 3520.0, gain: 0.08, type: 'sine' as OscillatorType, decay: 0.5 },
      ];

      harmonics.forEach((h) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = h.type;
        osc.frequency.setValueAtTime(h.freq, now);
        osc.frequency.exponentialRampToValueAtTime(h.freq * 1.015, now + 0.15);

        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(h.gain, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

        osc.connect(g);
        g.connect(master);
        osc.start(now);
        osc.stop(now + h.decay + 0.05);
      });
    } catch {
      // AudioContext policy
    }
  }

  /**
   * 2. 卍解 (Bankai): Titanic Sub-Bass Explosion & Sky-Splitting Spiritual Roar
   */
  public async playBankai() {
    try {
      await this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.42, now);
      master.connect(this.ctx.destination);

      // Deep Sub-Bass Impact (Drop from 120Hz to 28Hz)
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, now);
      sub.frequency.exponentialRampToValueAtTime(32, now + 1.2);

      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.linearRampToValueAtTime(0.7, now + 0.04);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      sub.connect(subGain);
      subGain.connect(master);
      sub.start(now);
      sub.stop(now + 2.5);

      // Noise Thunder Burst
      const bufferSize = this.ctx.sampleRate * 1.8;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.45));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 1.6);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(master);
      noise.start(now);
    } catch {
      // AudioContext policy
    }
  }

  /**
   * 3. 瞬歩 (Shunpo): High-Speed Supersonic Air Crack & Displacement Whistle
   */
  public async playShunpo() {
    try {
      await this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.3, now);
      master.connect(this.ctx.destination);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.16);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.6, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // AudioContext policy
    }
  }

  /**
   * 4. 鬼道 (Kidō): Hadō / Bakudō Spiritual Burst Beam
   */
  public async playKido(type: 'hado' | 'bakudo' = 'hado') {
    try {
      await this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.32, now);
      master.connect(this.ctx.destination);

      // Charge-up sweep followed by energy detonation
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type === 'hado' ? 'sawtooth' : 'triangle';

      if (type === 'hado') {
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.6);
      } else {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(660, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.7);
      }

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch {
      // AudioContext policy
    }
  }

  /**
   * 5. 魂葬 (Konsō): Serene Afterlife Bell & Reishi Chime
   */
  public async playKonso() {
    try {
      await this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.28, now);
      master.connect(this.ctx.destination);

      const bellFreqs = [523.25, 659.25, 783.99, 1046.5];
      bellFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        g.gain.setValueAtTime(0.0001, now + idx * 0.08);
        g.gain.linearRampToValueAtTime(0.25 / (idx + 1), now + idx * 0.08 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);

        osc.connect(g);
        g.connect(master);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 2.0);
      });
    } catch {
      // AudioContext policy
    }
  }
}
