import { sfx } from '../audio/Sfx.js';

const SPEED = 190;
const JUMP_VELOCITY = -500;

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setBodySize(18, 34, false);
    this.body.setOffset(5, 6);
    this.setCollideWorldBounds(true);
    this.setMaxVelocity(SPEED, 900);
    this.invulnerable = false;
    this.controls = { left: false, right: false, jump: false, down: false };
    this._runFrame = 0;
    this._runTimer = 0;
    this._jumpHeld = false;
    this._facing = 1;
  }

  get onGround() {
    return this.body.blocked.down || this.body.touching.down;
  }

  update(time, delta) {
    const keys = this.scene.keys;
    const left = this.controls.left || (keys.left && keys.left.isDown) || (keys.a && keys.a.isDown);
    const right = this.controls.right || (keys.right && keys.right.isDown) || (keys.d && keys.d.isDown);
    const jumpDown = this.controls.jump || (keys.up && keys.up.isDown) || (keys.w && keys.w.isDown) || (keys.space && keys.space.isDown);
    const down = this.controls.down || (keys.down && keys.down.isDown) || (keys.s && keys.s.isDown);
    this.isDown = down;

    if (this.frozen) return;

    if (left && !right) {
      this.setVelocityX(-SPEED);
      this._facing = -1;
      this.setFlipX(true);
    } else if (right && !left) {
      this.setVelocityX(SPEED);
      this._facing = 1;
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (jumpDown && this.onGround && !this._jumpHeld) {
      this.setVelocityY(JUMP_VELOCITY);
      sfx.jump();
    }
    this._jumpHeld = jumpDown;

    if (!this.onGround) {
      this.setTexture('player-jump');
    } else if (Math.abs(this.body.velocity.x) > 5) {
      this._runTimer += delta;
      if (this._runTimer > 110) {
        this._runTimer = 0;
        this._runFrame = 1 - this._runFrame;
      }
      this.setTexture(this._runFrame ? 'player-run1' : 'player-run2');
    } else {
      this.setTexture('player-idle');
    }

    if (this.invulnerable) {
      this.alpha = Math.floor(time / 90) % 2 ? 0.3 : 1;
    } else {
      this.alpha = 1;
    }
  }

  bounce() {
    this.setVelocityY(-260);
  }

  hurt(knockDir = -1) {
    if (this.invulnerable || this.frozen) return false;
    this.invulnerable = true;
    this.setVelocity(knockDir * 160, -280);
    this.scene.time.delayedCall(1200, () => { this.invulnerable = false; this.alpha = 1; });
    sfx.hurt();
    return true;
  }
}
