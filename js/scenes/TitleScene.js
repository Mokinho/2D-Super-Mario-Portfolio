import { PROFILE } from '../data/content.js';
import { GameState } from '../state/GameState.js';
import { openClassicResume } from '../ui/Panels.js';
import { sfx } from '../audio/Sfx.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x070402);

    for (let i = 0; i < 5; i++) {
      this.add.image(120 + i * 190, 90 + (i % 2) * 40, 'cloud').setAlpha(0.5);
    }

    this.add.text(width / 2, height * 0.28, PROFILE.name.toUpperCase(), {
      fontFamily: 'monospace', fontSize: '46px', color: '#f7f3ee', fontStyle: 'bold',
    }).setOrigin(0.5).setShadow(3, 3, '#e85002', 0, false, true);

    this.add.text(width / 2, height * 0.28 + 52, `${PROFILE.title} — Portfolio Quest`, {
      fontFamily: 'monospace', fontSize: '16px', color: '#e85002',
    }).setOrigin(0.5);

    this.add.image(width / 2 - 130, height * 0.55, 'player-idle').setScale(2.4);

    const blink = this.add.text(width / 2, height * 0.72, 'PRESS ENTER / SPACE / TAP TO START', {
      fontFamily: 'monospace', fontSize: '16px', color: '#f7f3ee',
    }).setOrigin(0.5);
    this.tweens.add({ targets: blink, alpha: 0.2, duration: 650, yoyo: true, repeat: -1 });

    this.add.text(width / 2, height * 0.82, 'Arrow keys / WASD to move · ↑ / Space to jump (tap again mid-air to double jump!) · ↓ to enter pipes', {
      fontFamily: 'monospace', fontSize: '12px', color: '#9a8c7f',
    }).setOrigin(0.5);

    const classicBtn = this.add.text(width / 2, height * 0.9, '[ Read the Classic Resume instead ]', {
      fontFamily: 'monospace', fontSize: '13px', color: '#9a8c7f',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    classicBtn.on('pointerover', () => classicBtn.setColor('#e85002'));
    classicBtn.on('pointerout', () => classicBtn.setColor('#9a8c7f'));
    classicBtn.on('pointerdown', () => openClassicResume());

    const start = () => {
      GameState.reset();
      sfx.startMusic();
      this.scene.start('World', { levelKey: 'about' });
    };
    this.input.keyboard.once('keydown-ENTER', start);
    this.input.keyboard.once('keydown-SPACE', start);
    this.input.once('pointerdown', (pointer, targets) => {
      if (targets.includes(classicBtn)) return;
      start();
    });
  }
}
