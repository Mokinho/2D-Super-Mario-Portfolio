import { GameState } from '../state/GameState.js';

export class WorldClearScene extends Phaser.Scene {
  constructor() {
    super('WorldClear');
  }

  init(data) {
    this.nextKey = data.nextKey;
    this.clearedTitle = data.clearedTitle;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x0d1f5c);

    this.add.text(width / 2, height * 0.32, `${this.clearedTitle.replace(/·/g, "-").toUpperCase()}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '16px', color: '#ffc61f',
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.4, 'CLEAR!', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '34px', color: '#f7f3ee', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.55, `COINS ${GameState.coins}   SCORE ${GameState.score}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '12px', color: '#d2e5ff',
    }).setOrigin(0.5);

    const label = this.nextKey ? 'PRESS ENTER TO CONTINUE' : 'PRESS ENTER';
    const blink = this.add.text(width / 2, height * 0.72, label, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '12px', color: '#f7f3ee',
    }).setOrigin(0.5);
    this.tweens.add({ targets: blink, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });

    const proceed = () => {
      if (this.nextKey) this.scene.start('World', { levelKey: this.nextKey });
      else this.scene.start('Title');
    };
    this.input.keyboard.once('keydown-ENTER', proceed);
    this.input.keyboard.once('keydown-SPACE', proceed);
    this.input.once('pointerdown', proceed);
  }
}
