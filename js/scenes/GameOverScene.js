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
    this.cameras.main.setBackgroundColor(0x0d1f5c);
    sfx.stopMusic();

    this.add.text(width / 2, height * 0.35, 'GAME OVER', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '34px', color: '#e8352c', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.48, `Final Score: ${GameState.score}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '16px', color: '#f7f3ee',
    }).setOrigin(0.5);

    const retry = this.add.text(width / 2, height * 0.64, '[ Retry this World ]', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '16px', color: '#ffc61f',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const toTitle = this.add.text(width / 2, height * 0.72, '[ Back to Title ]', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '14px', color: '#9a8c7f',
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
