import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { WorldScene } from './scenes/WorldScene.js';
import { WorldClearScene } from './scenes/WorldClearScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { openClassicResume } from './ui/Panels.js';
import { sfx } from './audio/Sfx.js';

window.__portfolioGameTouch = { left: false, right: false, jump: false, down: false };

function bindTouchButton(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  const set = (v) => { window.__portfolioGameTouch[key] = v; };
  el.addEventListener('pointerdown', (e) => { e.preventDefault(); set(true); });
  el.addEventListener('pointerup', () => set(false));
  el.addEventListener('pointerout', () => set(false));
  el.addEventListener('pointercancel', () => set(false));
}

bindTouchButton('btn-left', 'left');
bindTouchButton('btn-right', 'right');
bindTouchButton('btn-jump', 'jump');
bindTouchButton('btn-down', 'down');

document.getElementById('classic-resume-btn').addEventListener('click', () => openClassicResume());
document.getElementById('mute-btn').addEventListener('click', (e) => {
  sfx.muted = !sfx.muted;
  e.currentTarget.textContent = sfx.muted ? '🔇' : '🔊';
});

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 600,
  pixelArt: true,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 1000 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, WorldScene, WorldClearScene, GameOverScene],
};

window.__game = new Phaser.Game(config);
