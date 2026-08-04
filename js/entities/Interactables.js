import { makePipeTexture, FLAGPOLE_HEIGHT } from '../gfx/pixelart.js';

export class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'coin-1');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.setBodySize(14, 14, true);
    this._t = 0;
    this._f = 0;
  }

  update(time, delta) {
    this._t += delta;
    if (this._t > 140) {
      this._t = 0;
      this._f = 1 - this._f;
      this.setTexture(this._f ? 'coin-2' : 'coin-1');
    }
  }

  collect() {
    this.body.enable = false;
    this.scene.tweens.add({ targets: this, y: this.y - 24, alpha: 0, duration: 350, onComplete: () => this.destroy() });
  }
}

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'coffee-cup');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(true);
    this.setBounce(0.3);
    this.setCollideWorldBounds(true);
    this.setBodySize(18, 20, true);
  }

  collect() {
    this.body.enable = false;
    this.scene.tweens.add({ targets: this, y: this.y - 24, alpha: 0, duration: 350, onComplete: () => this.destroy() });
  }
}

export class ContentBlock extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, contentKey, onHit) {
    super(scene, x, y, 'block');
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.contentKey = contentKey;
    this.onHit = onHit;
    this.used = false;
    this.markText = scene.add.text(x, y, '?', {
      fontFamily: 'monospace', fontSize: '20px', color: '#f7f3ee', fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  hit(player) {
    if (this.used) return;
    this.used = true;
    this.setTexture('block-used');
    this.markText.setText('');
    const baseY = this.y;
    this.scene.tweens.add({
      targets: [this, this.markText], y: baseY - 8, duration: 90, yoyo: true,
    });
    this.onHit(this, player);
  }

  destroy(fromScene) {
    if (this.markText) this.markText.destroy();
    super.destroy(fromScene);
  }
}

export class Pipe extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, groundY, height, projectKeys, onEnter) {
    const key = `pipe-${height}`;
    makePipeTexture(scene, key, 40, height);
    super(scene, x, groundY - height / 2, key);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.projectKeys = projectKeys;
    this.onEnter = onEnter;
    this.prompt = scene.add.text(x, groundY - height - 18, 'Press ↓', {
      fontFamily: 'monospace', fontSize: '13px', color: '#e8c766',
    }).setOrigin(0.5).setAlpha(0);
  }

  setPromptVisible(visible) {
    this.prompt.setAlpha(visible ? 1 : 0);
  }

  destroy(fromScene) {
    if (this.prompt) this.prompt.destroy();
    super.destroy(fromScene);
  }
}

export class Flagpole extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, groundY, isCastle, onReach) {
    const h = isCastle ? 56 : FLAGPOLE_HEIGHT;
    super(scene, x, groundY - h / 2, isCastle ? 'castle-door' : 'flag-pole');
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.isCastle = isCastle;
    this.onReach = onReach;
    this.triggered = false;
    if (!isCastle) {
      this.banner = scene.add.image(x + 3, groundY - FLAGPOLE_HEIGHT + 10, 'flag-banner').setOrigin(0, 0.5);
    }
  }

  trigger(player) {
    if (this.triggered) return;
    this.triggered = true;
    this.onReach(this, player);
  }

  destroy(fromScene) {
    if (this.banner) this.banner.destroy();
    super.destroy(fromScene);
  }
}
