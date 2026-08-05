const BASSLINE = [130.81, 130.81, 164.81, 130.81, 146.83, 146.83, 195.99, 174.61];
const MELODY = [523.25, 0, 659.25, 0, 587.33, 0, 783.99, 698.46];

export class Sfx {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this._musicInterval = null;
    this._musicStep = 0;
  }

  _ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  _tone(freq, duration, type = 'square', gain = 0.06, delay = 0) {
    if (this.muted) return;
    try {
      const ctx = this._ensureCtx();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.value = gain;
      osc.connect(g);
      g.connect(ctx.destination);
      const t0 = ctx.currentTime + delay;
      osc.start(t0);
      g.gain.setValueAtTime(gain, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.stop(t0 + duration + 0.02);
    } catch (e) { /* audio unavailable, ignore */ }
  }

  jump(isDouble = false) {
    if (isDouble) this._tone(700, 0.12, 'square', 0.05);
    else this._tone(480, 0.12, 'square', 0.05);
  }

  coin() { this._tone(880, 0.08, 'square', 0.05); this._tone(1320, 0.08, 'square', 0.04, 0.06); }
  stomp() { this._tone(180, 0.1, 'square', 0.06); }
  hurt() { this._tone(140, 0.25, 'sawtooth', 0.07); }
  block() { this._tone(700, 0.05, 'square', 0.06); this._tone(300, 0.09, 'square', 0.05, 0.04); }
  powerup() { [523, 659, 784, 1046].forEach((f, i) => this._tone(f, 0.12, 'square', 0.05, i * 0.09)); }
  clear() { [392, 523, 659, 784, 1046].forEach((f, i) => this._tone(f, 0.18, 'triangle', 0.06, i * 0.12)); }
  gameover() { [392, 349, 293, 220].forEach((f, i) => this._tone(f, 0.3, 'sawtooth', 0.05, i * 0.2)); }

  startMusic() {
    if (this._musicInterval) return;
    this._ensureCtx();
    this._musicStep = 0;
    this._musicInterval = setInterval(() => {
      const bass = BASSLINE[this._musicStep % BASSLINE.length];
      this._tone(bass, 0.16, 'triangle', 0.035);
      const mel = MELODY[this._musicStep % MELODY.length];
      if (mel) this._tone(mel, 0.14, 'square', 0.02);
      this._musicStep += 1;
    }, 170);
  }

  stopMusic() {
    if (this._musicInterval) {
      clearInterval(this._musicInterval);
      this._musicInterval = null;
    }
  }
}

export const sfx = new Sfx();
