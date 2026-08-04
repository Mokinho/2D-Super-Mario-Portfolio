const SPEED = 55;

export class Bug extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, rangeMin, rangeMax) {
    super(scene, x, y, 'bug-1');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setBodySize(22, 14, false);
    this.body.setOffset(2, 6);
    this.rangeMin = rangeMin;
    this.rangeMax = rangeMax;
    this.dir = 1;
    this.setVelocityX(SPEED);
    this._walkTimer = 0;
    this._walkFrame = 0;
    this.alive = true;
  }

  update(time, delta) {
    if (!this.alive) return;
    if (this.x <= this.rangeMin) { this.dir = 1; }
    if (this.x >= this.rangeMax) { this.dir = -1; }
    if (this.body.blocked.left) this.dir = 1;
    if (this.body.blocked.right) this.dir = -1;
    this.setVelocityX(SPEED * this.dir);
    this.setFlipX(this.dir < 0);

    this._walkTimer += delta;
    if (this._walkTimer > 160) {
      this._walkTimer = 0;
      this._walkFrame = 1 - this._walkFrame;
      this.setTexture(this._walkFrame ? 'bug-2' : 'bug-1');
    }
  }

  squash() {
    this.alive = false;
    this.body.enable = false;
    this.setTexture('bug-dead');
    this.setDisplaySize(26, 10);
    this.scene.time.delayedCall(400, () => this.destroy());
  }
}
