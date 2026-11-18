export const PIXEL_FONT = '"Press Start 2P", monospace';

// Pixel-style HUD: navy panel with a gold border (lives, coins, score)
// plus a gold title badge, matching the "Level Up" title art.
export function buildPixelHud(scene, title) {
  const W = scene.scale.width;
  const depth = 100;
  const text = (x, y, value, color = '#ffffff', size = 13) => scene.add.text(x, y, value, {
    fontFamily: PIXEL_FONT, fontSize: `${size}px`, color, stroke: '#101633', strokeThickness: 4,
  }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(depth + 1);

  const panel = scene.add.graphics().setScrollFactor(0).setDepth(depth);
  const px = 12, py = 12, pw = 372, ph = 40;
  panel.fillStyle(0x101633, 1).fillRect(px - 3, py - 3, pw + 6, ph + 6);
  panel.fillStyle(0xffc61f, 1).fillRect(px, py, pw, ph);
  panel.fillStyle(0x0d1f5c, 1).fillRect(px + 4, py + 4, pw - 8, ph - 8);

  const cy = py + ph / 2;
  scene.add.image(px + 22, cy, 'coffee-cup').setScale(0.9).setScrollFactor(0).setDepth(depth + 1);
  const hudLives = text(px + 40, cy + 1, '');
  scene.add.image(px + 118, cy, 'coin-1').setScale(0.85).setScrollFactor(0).setDepth(depth + 1);
  const hudCoins = text(px + 134, cy + 1, '');
  const hudScore = text(px + 206, cy + 1, '', '#ffdc45');

  const badge = scene.add.graphics().setScrollFactor(0).setDepth(depth);
  const by = py + ph + 14;
  const hudTitle = scene.add.text(px + 18, by + 17, title.replace(/·/g, '-').toUpperCase(), {
    fontFamily: PIXEL_FONT, fontSize: '11px', color: '#101633',
  }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(depth + 1);
  const bw = Math.min(W - 40, hudTitle.width + 36);
  const bx = px;
  badge.fillStyle(0x101633, 1).fillRect(bx - 3, by - 3, bw + 6, 40);
  badge.fillStyle(0xffc61f, 1).fillRect(bx, by, bw, 34);
  badge.fillStyle(0xfff07c, 1).fillRect(bx, by, bw, 4);
  badge.fillStyle(0xe0940f, 1).fillRect(bx, by + 30, bw, 4);

  return { hudLives, hudCoins, hudScore, hudTitle };
}

export function setHudValues(hud, { lives, coins, score }) {
  hud.hudLives.setText(`x${lives}`);
  hud.hudCoins.setText(`${coins}`);
  hud.hudScore.setText(`SCORE ${score}`);
}
