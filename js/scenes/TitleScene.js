import { GameState } from '../state/GameState.js';
import { sfx } from '../audio/Sfx.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const welcome = document.getElementById('welcome-screen');
    const startButton = document.getElementById('start-adventure');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    welcome.hidden = false;
    welcome.classList.remove('is-starting');
    startButton.disabled = false;
    document.body.classList.add('is-welcome');
    this.cameras.main.setBackgroundColor(0x09265c);
    let starting = false;

    const start = () => {
      if (starting || document.getElementById('panel-overlay').classList.contains('is-open')) return;
      starting = true;
      startButton.disabled = true;
      welcome.classList.add('is-starting');
      sfx.startMusic();
      this.time.delayedCall(reducedMotion ? 0 : 180, () => {
        welcome.hidden = true;
        document.body.classList.remove('is-welcome');
        GameState.reset();
        this.scene.start('World', { levelKey: 'about' });
      });
    };
    const onKey = (event) => {
      // Let focused buttons handle their own Enter/Space activation.
      if (event.repeat || (event.code !== 'Enter' && event.code !== 'Space')) return;
      if (event.target instanceof HTMLElement && event.target.closest('button, a, input, textarea, select, [role="dialog"]')) return;
      event.preventDefault();
      start();
    };
    startButton.addEventListener('click', start);
    document.addEventListener('keydown', onKey);
    this.events.once('shutdown', () => {
      startButton.removeEventListener('click', start);
      document.removeEventListener('keydown', onKey);
      welcome.hidden = true;
      document.body.classList.remove('is-welcome');
    });
  }
}
