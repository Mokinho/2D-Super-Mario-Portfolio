import { generateAllTextures } from '../gfx/pixelart.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    // Wait (briefly) for the pixel font so HUD text renders in it from the first frame.
    const fontReady = document.fonts && document.fonts.load
      ? Promise.race([document.fonts.load('12px "Press Start 2P"'), new Promise((r) => setTimeout(r, 2500))])
      : Promise.resolve();
    fontReady.catch(() => {}).finally(() => {
      generateAllTextures(this);
      this.scene.start('Title');
    });
  }
}
