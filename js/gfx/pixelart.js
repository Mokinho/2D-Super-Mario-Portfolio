import { PALETTE } from './palette.js';

function bake(scene, key, w, h, draw) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  draw(g);
  g.generateTexture(key, w, h);
  g.destroy();
}

export function generateAllTextures(scene) {
  generatePlayerTextures(scene);
  generateBugTextures(scene);
  generateCoinTextures(scene);
  generateBlockTextures(scene);
  generateGroundTextures(scene);
  generateFlagTextures(scene);
  generateDecorTextures(scene);
  generateItemTextures(scene);
}

function generatePlayerTextures(scene) {
  const W = 28, H = 40;
  const draw = (legOffset, armUp) => (g) => {
    g.fillStyle(PALETTE.accent, 1);
    g.fillRect(4, 0, 20, 8);
    g.fillStyle(PALETTE.text, 1);
    g.fillRect(3, 6, 3, 3);
    g.fillStyle(PALETTE.skin, 1);
    g.fillRect(6, 7, 16, 9);
    g.fillStyle(0xffffff, 1);
    g.fillRect(8, 10, 5, 3);
    g.fillRect(16, 10, 5, 3);
    g.fillStyle(PALETTE.hair, 1);
    g.fillRect(9, 11, 2, 2);
    g.fillRect(17, 11, 2, 2);
    g.fillStyle(PALETTE.text, 1);
    g.fillRect(8, 16, 12, 12);
    g.fillStyle(PALETTE.accent, 1);
    g.fillRect(8, 20, 12, 8);
    g.fillStyle(PALETTE.gold, 1);
    g.fillRect(12, 22, 4, 4);
    g.fillStyle(PALETTE.skin, 1);
    if (armUp) {
      g.fillRect(2, 10, 4, 10);
      g.fillRect(22, 10, 4, 10);
    } else {
      g.fillRect(3, 18, 4, 8);
      g.fillRect(21, 18, 4, 8);
    }
    g.fillStyle(PALETTE.accentDim, 1);
    g.fillRect(8 - legOffset, 28, 5, 10);
    g.fillRect(15 + legOffset, 28, 5, 10);
    g.fillStyle(PALETTE.hair, 1);
    g.fillRect(7 - legOffset, 36, 7, 4);
    g.fillRect(14 + legOffset, 36, 7, 4);
  };
  bake(scene, 'player-idle', W, H, draw(0, false));
  bake(scene, 'player-run1', W, H, draw(3, false));
  bake(scene, 'player-run2', W, H, draw(-3, false));
  bake(scene, 'player-jump', W, H, draw(0, true));
  bake(scene, 'player-hurt', W, H, (g) => { draw(0, true)(g); g.fillStyle(PALETTE.accentDim, 0.35); g.fillRect(0, 0, W, H); });
}

function generateBugTextures(scene) {
  const W = 26, H = 18;
  const draw = (legPhase) => (g) => {
    g.fillStyle(PALETTE.accentDim, 1);
    g.fillEllipse(13, 10, 22, 14);
    g.fillStyle(0x2b0500, 1);
    g.fillEllipse(9, 6, 6, 6);
    g.fillEllipse(17, 6, 6, 6);
    g.fillEllipse(13, 12, 6, 6);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(9, 5, 2);
    g.fillCircle(17, 5, 2);
    g.fillStyle(0x000000, 1);
    g.fillCircle(9, 5, 1);
    g.fillCircle(17, 5, 1);
    g.lineStyle(1, 0x2b0500, 1);
    g.beginPath();
    g.moveTo(8, 2); g.lineTo(5, -2);
    g.moveTo(18, 2); g.lineTo(21, -2);
    g.strokePath();
    g.fillStyle(0x2b0500, 1);
    const o = legPhase ? 2 : -2;
    g.fillRect(2, 12 + o, 3, 5);
    g.fillRect(9, 14 - o, 3, 5);
    g.fillRect(16, 14 + o, 3, 5);
    g.fillRect(21, 12 - o, 3, 5);
  };
  bake(scene, 'bug-1', W, H + 6, draw(false));
  bake(scene, 'bug-2', W, H + 6, draw(true));
  bake(scene, 'bug-dead', W, 10, (g) => {
    g.fillStyle(PALETTE.accentDim, 1);
    g.fillEllipse(13, 5, 24, 8);
    g.fillStyle(0x2b0500, 1);
    g.fillRect(4, 3, 4, 2);
    g.fillRect(18, 3, 4, 2);
  });
}

function generateCoinTextures(scene) {
  const W = 18, H = 18;
  bake(scene, 'coin-1', W, H, (g) => {
    g.fillStyle(PALETTE.gold, 1);
    g.fillCircle(9, 9, 8);
    g.fillStyle(PALETTE.accent, 1);
    g.fillCircle(9, 9, 5);
    g.fillStyle(0xfff6df, 1);
    g.fillRect(6, 3, 2, 5);
  });
  bake(scene, 'coin-2', W, H, (g) => {
    g.fillStyle(PALETTE.gold, 1);
    g.fillEllipse(9, 9, 5, 16);
    g.fillStyle(0xfff6df, 1);
    g.fillRect(8, 2, 2, 5);
  });
}

function generateBlockTextures(scene) {
  const S = 32;
  bake(scene, 'block', S, S, (g) => {
    g.fillStyle(PALETTE.brick, 1);
    g.fillRect(0, 0, S, S);
    g.fillStyle(PALETTE.brickHighlight, 1);
    g.fillRect(2, 2, S - 4, 3);
    g.fillRect(2, 2, 3, S - 4);
    g.lineStyle(3, PALETTE.brickDark, 1);
    g.strokeRect(2, 2, S - 4, S - 4);
    g.fillStyle(PALETTE.brickDark, 1);
    g.fillRect(0, 0, 4, 4);
    g.fillRect(S - 4, 0, 4, 4);
    g.fillRect(0, S - 4, 4, 4);
    g.fillRect(S - 4, S - 4, 4, 4);
  });
  bake(scene, 'block-used', S, S, (g) => {
    g.fillStyle(PALETTE.ground, 1);
    g.fillRect(0, 0, S, S);
    g.fillStyle(PALETTE.groundTop, 1);
    g.fillRect(2, 2, S - 4, 3);
    g.lineStyle(2, 0x000000, 0.4);
    g.strokeRect(1, 1, S - 2, S - 2);
  });
}

function generateGroundTextures(scene) {
  const S = 32;
  bake(scene, 'ground', S, S, (g) => {
    g.fillStyle(PALETTE.grass, 1);
    g.fillRect(0, 0, S, 10);
    g.fillStyle(PALETTE.grassShadow, 1);
    g.fillRect(0, 8, S, 2);
    g.fillStyle(PALETTE.grassDark, 1);
    g.fillTriangle(2, 10, 8, 10, 5, 4);
    g.fillTriangle(18, 10, 26, 10, 22, 3);
    g.fillStyle(PALETTE.ground, 1);
    g.fillRect(0, 10, S, S - 10);
    g.fillStyle(PALETTE.groundTop, 1);
    g.fillRect(4, 16, 6, 6);
    g.fillRect(20, 22, 7, 6);
    g.lineStyle(1, 0x000000, 0.25);
    g.strokeRect(0, 0, S, S);
  });
  bake(scene, 'platform', S, 16, (g) => {
    g.fillStyle(PALETTE.ground, 1);
    g.fillRect(0, 4, S, 12);
    g.fillStyle(PALETTE.grass, 1);
    g.fillRect(0, 0, S, 6);
    g.fillStyle(PALETTE.grassShadow, 1);
    g.fillRect(0, 5, S, 2);
    g.lineStyle(1, 0x000000, 0.3);
    g.strokeRect(0, 0, S, 16);
  });
}

export const FLAGPOLE_HEIGHT = 224;

function generateFlagTextures(scene) {
  bake(scene, 'flag-pole', 6, FLAGPOLE_HEIGHT, (g) => {
    g.fillStyle(PALETTE.textDim, 1);
    g.fillRect(0, 0, 6, FLAGPOLE_HEIGHT);
  });
  bake(scene, 'flag-banner', 26, 20, (g) => {
    g.fillStyle(PALETTE.accent, 1);
    g.fillTriangle(0, 0, 26, 5, 0, 20);
    g.fillStyle(PALETTE.text, 1);
    g.fillRect(4, 6, 8, 8);
  });
  bake(scene, 'castle-door', 40, 56, (g) => {
    g.fillStyle(PALETTE.surface, 1);
    g.fillRoundedRect(0, 0, 40, 56, { tl: 20, tr: 20, bl: 0, br: 0 });
    g.fillStyle(0x000000, 1);
    g.fillRoundedRect(8, 12, 24, 44, { tl: 12, tr: 12, bl: 0, br: 0 });
  });
}

function generateDecorTextures(scene) {
  bake(scene, 'cloud', 64, 32, (g) => {
    g.fillStyle(PALETTE.cloudWhite, 0.95);
    g.fillEllipse(20, 20, 32, 20);
    g.fillEllipse(40, 16, 28, 18);
    g.fillEllipse(52, 22, 20, 14);
    g.fillStyle(0xdfeeff, 0.6);
    g.fillEllipse(24, 24, 20, 10);
  });
  bake(scene, 'hill', 180, 90, (g) => {
    g.fillStyle(PALETTE.hillGreen, 1);
    g.fillEllipse(90, 90, 180, 110);
    g.fillStyle(PALETTE.hillGreenDark, 1);
    g.fillEllipse(60, 96, 70, 60);
  });
  bake(scene, 'bush', 70, 32, (g) => {
    g.fillStyle(PALETTE.bushGreen, 1);
    g.fillEllipse(18, 22, 30, 22);
    g.fillEllipse(38, 16, 32, 24);
    g.fillEllipse(56, 22, 24, 18);
    g.fillStyle(PALETTE.bushGreenDark, 1);
    g.fillEllipse(38, 26, 60, 12);
  });
  bake(scene, 'bg-strip', 64, 600, (g) => {
    g.fillStyle(PALETTE.bgAlt, 1);
    g.fillRect(0, 0, 64, 600);
  });
  bake(scene, 'star-particle', 6, 6, (g) => {
    g.fillStyle(PALETTE.gold, 1);
    g.fillRect(0, 0, 6, 6);
  });
}

export function makePipeTexture(scene, key, width, height) {
  bake(scene, key, width, height, (g) => {
    g.fillStyle(PALETTE.pipeGreen, 1);
    g.fillRect(0, 0, width, height);
    g.fillStyle(PALETTE.pipeGreenLight, 1);
    g.fillRect(4, 0, 6, height);
    g.fillStyle(PALETTE.pipeGreenDark, 1);
    g.fillRect(0, 0, width, 20);
    g.fillRect(width - 6, 20, 6, height - 20);
    g.lineStyle(2, PALETTE.pipeGreenDark, 1);
    g.strokeRect(0, 0, width, height);
    g.strokeRect(0, 0, width, 20);
    g.fillStyle(PALETTE.pipeGreenLight, 0.7);
    g.fillRect(6, 22, 4, height - 26);
  });
}

function generateItemTextures(scene) {
  bake(scene, 'coffee-cup', 22, 24, (g) => {
    g.fillStyle(PALETTE.text, 1);
    g.fillRect(3, 6, 14, 16);
    g.fillStyle(PALETTE.accentDim, 1);
    g.fillRect(3, 6, 14, 3);
    g.fillStyle(0x3a2313, 1);
    g.fillRect(5, 9, 10, 3);
    g.lineStyle(2, PALETTE.text, 1);
    g.strokeCircle(19, 12, 4);
    g.fillStyle(0xffffff, 1);
    g.fillRect(6, 2, 1, 4);
    g.fillRect(9, 1, 1, 4);
    g.fillRect(12, 2, 1, 4);
  });
}
