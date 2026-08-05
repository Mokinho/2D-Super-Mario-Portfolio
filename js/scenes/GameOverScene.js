import { GameState } from '../state/GameState.js';
import { sfx } from '../audio/Sfx.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.levelKey = data.levelKey || 'about';
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x000000);
    sfx.stopMusic();

    this.add.text(width / 2, height * 0.35, 'GAME OVER', {
      fontFamily: 'monospace', fontSize: '40px', color: '#c10901', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.48, `Final Score: ${GameState.score}`, {
      fontFamily: 'monospace', fontSize: '16px', color: '#f7f3ee',
    }).setOrigin(0.5);

    const retry = this.add.text(width / 2, height * 0.64, '[ Retry this World ]', {
      fontFamily: 'monospace', fontSize: '16px', color: '#e85002',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const toTitle = this.add.text(width / 2, height * 0.72, '[ Back to Title ]', {
      fontFamily: 'monospace', fontSize: '14px', color: '#9a8c7f',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const retryLevel = () => {
      GameState.lives = 3;
      sfx.startMusic();
      this.scene.start('World', { levelKey: this.levelKey });
    };

    retry.on('pointerdown', retryLevel);
    toTitle.on('pointerdown', () => this.scene.start('Title'));
    this.input.keyboard.once('keydown-ENTER', retryLevel);
  }
}
