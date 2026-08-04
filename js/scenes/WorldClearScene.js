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
    this.cameras.main.setBackgroundColor(0x000000);

    this.add.text(width / 2, height * 0.32, `${this.clearedTitle.toUpperCase()}`, {
      fontFamily: 'monospace', fontSize: '22px', color: '#e85002',
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.4, 'CLEAR!', {
      fontFamily: 'monospace', fontSize: '40px', color: '#f7f3ee', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.55, `Coins ◉ ${GameState.coins}   Score ${GameState.score}`, {
      fontFamily: 'monospace', fontSize: '16px', color: '#9a8c7f',
    }).setOrigin(0.5);

    const label = this.nextKey ? 'PRESS ENTER TO CONTINUE' : 'PRESS ENTER';
    const blink = this.add.text(width / 2, height * 0.72, label, {
      fontFamily: 'monospace', fontSize: '15px', color: '#f7f3ee',
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
