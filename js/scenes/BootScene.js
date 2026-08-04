import { generateAllTextures } from '../gfx/pixelart.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    generateAllTextures(this);
    this.scene.start('Title');
  }
}
