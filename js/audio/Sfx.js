export class Sfx {
  constructor() {
    this.ctx = null;
    this.muted = false;
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

  jump() { this._tone(520, 0.12, 'square', 0.05); }
  coin() { this._tone(880, 0.08, 'square', 0.05); this._tone(1320, 0.08, 'square', 0.04, 0.06); }
  stomp() { this._tone(180, 0.1, 'square', 0.06); }
  hurt() { this._tone(140, 0.25, 'sawtooth', 0.07); }
  block() { this._tone(400, 0.06, 'square', 0.05); }
  powerup() { [523, 659, 784, 1046].forEach((f, i) => this._tone(f, 0.12, 'square', 0.05, i * 0.09)); }
  clear() { [392, 523, 659, 784, 1046].forEach((f, i) => this._tone(f, 0.18, 'triangle', 0.06, i * 0.12)); }
  gameover() { [392, 349, 293, 220].forEach((f, i) => this._tone(f, 0.3, 'sawtooth', 0.05, i * 0.2)); }
}

export const sfx = new Sfx();
