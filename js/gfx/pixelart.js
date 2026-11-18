import { PALETTE } from './palette.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function bake(scene, key, w, h, draw) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  draw(g);
  g.generateTexture(key, w, h);
  g.destroy();
}

// Draw onto a canvas texture in "art pixels" (each art pixel = `scale` game px).
function canvasArt(scene, key, artW, artH, scale, paint) {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, artW * scale, artH * scale);
  const ctx = tex.getContext();
  ctx.imageSmoothingEnabled = false;
  const put = (x, y, color, w = 1, h = 1) => {
    if (!color) return;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x) * scale, Math.round(y) * scale, w * scale, h * scale);
  };
  paint(put, artW, artH);
  tex.refresh();
}

// Pixel map from strings. '.' = transparent. Optional 1px auto-outline.
function pixelMap(scene, key, rows, colors, { scale = 2, outline = null } = {}) {
  if (scene.textures.exists(key)) return;
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  const grid = rows.map((r) => r.padEnd(w, '.'));
  const pad = outline ? 1 : 0;
  canvasArt(scene, key, w + pad * 2, h + pad * 2, scale, (put) => {
    const filled = (x, y) => y >= 0 && y < h && x >= 0 && x < w && grid[y][x] !== '.';
    if (outline) {
      for (let y = -1; y <= h; y++) {
        for (let x = -1; x <= w; x++) {
          if (filled(x, y)) continue;
          if (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1)) {
            put(x + pad, y + pad, outline);
          }
        }
      }
    }
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const c = grid[y][x];
        if (c !== '.') put(x + pad, y + pad, colors[c]);
      }
    }
  });
}

// "</>" glyph as a list of art-pixel cells (14 wide x 7 tall).
function codeGlyphCells() {
  const cells = [];
  for (let y = 0; y < 7; y++) {
    const arm = Math.abs(3 - y);
    cells.push([arm, y]);
    cells.push([8 - Math.floor(y / 2), y]);
    cells.push([13 - arm, y]);
  }
  return cells;
}

const hex = (n) => `#${n.toString(16).padStart(6, '0')}`;

const C = {
  ink: '#101633',
  white: '#ffffff',
  hair: '#1c2148', hairHi: '#3a4890',
  skin: '#f6c49b', skinSh: '#d9946a',
  hood: '#24398f', hoodSh: '#182a6c', hoodHi: '#3f5ec6', code: '#e9f2ff',
  pack: '#f6a623', packSh: '#c46d10',
  pants: '#1b2552', pantsHi: '#2d3b7c',
  shoe: '#ffffff', sole: '#9aa6c4',
  grass: '#5ed13c', grassHi: '#9cf06a', grassSh: '#2f9b2c', grassInk: '#1b5a1f',
  brick: '#d8692b', brickHi: '#f39147', mortar: '#7a3314',
  gold: '#ffc61f', goldHi: '#fff1a0', goldSh: '#d88a00',
  block: '#ffcb2b', blockHi: '#fff07c', blockSh: '#e0940f',
  used: '#b8652b', usedHi: '#d98a4a', usedSh: '#7a3d17',
  red: '#e8352c', redSh: '#a81f18',
  cloud: '#ffffff', cloudSh: '#cfe0ff', cloudSh2: '#b4c4f2',
  mtn: '#4fae6c', mtnHi: '#7dcf86', mtnSh: '#3b8f59',
  hill: '#3fbf4c', hillHi: '#79e062', hillSh: '#2a9a3a',
  bush: '#36b93f', bushHi: '#7ee35e', bushInk: '#145a1d',
  navy: '#25409e', screen: '#dfe9ff',
  wood: '#f0a443', woodSh: '#b5671d',
  pipe: '#36b84c', pipeHi: '#7ee27a', pipeSh: '#1c7a33',
};

export function generateAllTextures(scene) {
  generatePlayerTextures(scene);
  generateBugTextures(scene);
  generateCoinTextures(scene);
  generateBlockTextures(scene);
  generateGroundTextures(scene);
  generateFlagTextures(scene);
  generateDecorTextures(scene);
  generateItemTextures(scene);
  generateCaveTextures(scene);
}

// ---------------------------------------------------------------------------
// Player: dark spiky hair, navy "</>" hoodie, orange backpack, white sneakers
// ---------------------------------------------------------------------------

const PLAYER_COLORS = {
  H: C.hair, h: C.hairHi, S: C.skin, s: C.skinSh, E: C.ink, W: C.white,
  N: C.hood, n: C.hoodSh, L: C.hoodHi, X: C.code,
  O: C.pack, o: C.packSh, P: C.pants, p: C.pantsHi, F: C.shoe, G: C.sole,
};

const HEAD = [
  '....H..H..H.H.....',
  '....HH.HHHHHHH....',
  '...HHHHhhhHHHHH...',
  '..HHHHHHHHHHHHHHH.',
  '.HHHHHHHHHHHHHHHH.',
  '..HHHHHHHHSHHSSHH.',
  '...HHHHSSSSSSSSSS.',
  '....HHsSSSSWESWES.',
  '....HsSSSSSWESWES.',
  '.....sSSSSSSSSSSS.',
  '.....sSSSSSSSSSs..',
  '......ssSSSSSss...',
];

const TORSO_IDLE = [
  '...OOONNNNNNNN....',
  '..OOOoNLNNNNNNN...',
  '..OOOoNXNNNXNXNN..',
  '..OOOoXNNNXNNNXS..',
  '..OOOoNXNXNNNXNS..',
  '..ooooNNNNNNNNN...',
  '....nnnnnnnnnn....',
];

const TORSO_JUMP = [
  '...OOONNNNNNNNNNS.',
  '..OOOoNLNNNNNNNNSS',
  '..OOOoNXNNNXNXNN..',
  '..OOOoXNNNXNNNX...',
  '..OOOoNXNXNNNXN...',
  '..ooooNNNNNNNNN...',
  '....nnnnnnnnnn....',
];

const LEGS = {
  idle: [
    '.....PPPP.PPPP....',
    '.....PPPP.PPPP....',
    '.....PPP...PPP....',
    '....FFFF..FFFF....',
    '....GGGGG.GGGGG...',
  ],
  run1: [
    '....PPPP...PPPP...',
    '...PPPP.....PPPP..',
    '..PPP........PPP..',
    '.FFFF........FFFF.',
    '.GGGG........GGGGG',
  ],
  run2: [
    '......PPPPPP......',
    '......PPPPPP......',
    '.....PPP..PPP.....',
    '....FFFF..FFFF....',
    '....GGGG..GGGGG...',
  ],
  jump: [
    '.....PPPP.PPPPP...',
    '....PPPP....PPPPF.',
    '...PPP.......FFGG.',
    '..FFFF............',
    '..GGGG............',
  ],
};

export const PLAYER_SIZE = { w: 40, h: 50 };

function generatePlayerTextures(scene) {
  const make = (key, torso, legs) => pixelMap(scene, key, [...HEAD, ...torso, ...legs], PLAYER_COLORS, { outline: C.ink });
  make('player-idle', TORSO_IDLE, LEGS.idle);
  make('player-run1', TORSO_IDLE, LEGS.run1);
  make('player-run2', TORSO_IDLE, LEGS.run2);
  make('player-jump', TORSO_JUMP, LEGS.jump);
  pixelMap(scene, 'player-hurt', [...HEAD, ...TORSO_JUMP, ...LEGS.jump],
    { ...PLAYER_COLORS, N: '#c4473d', n: '#8f2a22', L: '#e06a5f' }, { outline: C.ink });
}

// ---------------------------------------------------------------------------
// Bug enemy
// ---------------------------------------------------------------------------

function generateBugTextures(scene) {
  const colors = { R: C.red, r: C.redSh, W: C.white, E: C.ink, K: C.ink };
  const body = [
    '....K...K....',
    '.....K.K.....',
    '...RRRRRRR...',
    '..RWERRRWERR.',
    '.RRRRrRrRRRR.',
    '.RRrRRrRRrRR.',
    '..RRRRRRRRR..',
  ];
  pixelMap(scene, 'bug-1', [...body, '..K.K...K.K..', '.K...K.K...K.'], colors, { outline: C.ink });
  pixelMap(scene, 'bug-2', [...body, '...K.K.K.K...', '...K.K.K.K...'], colors, { outline: C.ink });
  pixelMap(scene, 'bug-dead', ['.RRRRRRRRRRR.', 'RrRRrRRrRRrRR'], colors, { outline: C.ink });
}

// ---------------------------------------------------------------------------
// Coins
// ---------------------------------------------------------------------------

function generateCoinTextures(scene) {
  const colors = { Y: C.gold, l: C.goldHi, D: C.goldSh, W: C.white };
  pixelMap(scene, 'coin-1', [
    '..YYYY..',
    '.YllllY.',
    'YlWlllDY',
    'YlWlDlDY',
    'YWllDlDY',
    'YWllDlDY',
    'YWllDlDY',
    'YlWlDlDY',
    'YlllllDY',
    '.YDDDDY.',
    '..YYYY..',
  ], colors, { outline: C.ink });
  pixelMap(scene, 'coin-2', [
    '.YY.', 'YlDY', 'YWDY', 'YWDY', 'YWDY', 'YWDY', 'YWDY', 'YWDY', 'YlDY', 'YDDY', '.YY.',
  ], colors, { outline: C.ink });
}

// ---------------------------------------------------------------------------
// "</>" content blocks
// ---------------------------------------------------------------------------

function drawBlockBase(put, fill, hi, sh) {
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) put(x, y, fill);
  for (let i = 1; i < 15; i++) { put(i, 1, hi); put(1, i, hi); put(i, 14, sh); put(14, i, sh); }
  for (let i = 0; i < 16; i++) { put(i, 0, C.ink); put(i, 15, C.ink); put(0, i, C.ink); put(15, i, C.ink); }
}

function generateBlockTextures(scene) {
  canvasArt(scene, 'block', 16, 16, 2, (put) => {
    drawBlockBase(put, C.block, C.blockHi, C.blockSh);
    codeGlyphCells().forEach(([x, y]) => put(x + 1, y + 5, C.blockSh));
    codeGlyphCells().forEach(([x, y]) => put(x + 1, y + 4, C.ink));
  });
  canvasArt(scene, 'block-used', 16, 16, 2, (put) => {
    drawBlockBase(put, C.used, C.usedHi, C.usedSh);
    [[3, 3], [12, 3], [3, 12], [12, 12]].forEach(([x, y]) => put(x, y, C.usedSh));
  });
  canvasArt(scene, 'spark', 2, 5, 2, (put) => {
    put(0, 0, C.goldHi, 2, 5);
    put(0, 1, C.gold, 2, 3);
  });
}

// ---------------------------------------------------------------------------
// Ground: grass top + orange bricks
// ---------------------------------------------------------------------------

function brickColor(x, y) {
  const row = Math.floor(y / 4);
  const yy = y % 4;
  if (yy === 3) return C.mortar;
  if ((x + (row % 2) * 4) % 8 === 7) return C.mortar;
  if (yy === 0 || (x + (row % 2) * 4) % 8 === 0) return C.brickHi;
  return C.brick;
}

const TUFTS = [1, 0, 0, 1, 2, 1, 0, 0, 0, 1, 0, 0, 1, 2, 1, 0];

function paintGrass(put, w, bodyRows) {
  for (let x = 0; x < w; x++) {
    const t = TUFTS[x % 16];
    for (let k = 0; k < t; k++) put(x, 2 - t + k, k === 0 ? C.grassInk : C.grass);
    put(x, 2, t > 0 ? C.grass : C.grassInk);
    put(x, 3, C.grassHi);
    for (let y = 4; y < 2 + bodyRows; y++) put(x, y, C.grass);
    put(x, 2 + bodyRows, C.grassSh);
    put(x, 3 + bodyRows, C.grassInk);
  }
}

function generateGroundTextures(scene) {
  // Top tile (grass + bricks), 32x32
  canvasArt(scene, 'ground', 16, 16, 2, (put) => {
    paintGrass(put, 16, 3);
    for (let y = 7; y < 16; y++) for (let x = 0; x < 16; x++) put(x, y, brickColor(x, y - 7));
  });
  // Fill tile (bricks only), 32x32
  canvasArt(scene, 'ground-fill', 16, 16, 2, (put) => {
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) put(x, y, brickColor(x, y + 1));
  });
  // Floating platform, 32x28 (physics body is the top 16px)
  canvasArt(scene, 'platform', 16, 14, 2, (put) => {
    paintGrass(put, 16, 2);
    for (let y = 6; y < 13; y++) for (let x = 0; x < 16; x++) put(x, y, brickColor(x, y - 6));
    for (let x = 0; x < 16; x++) put(x, 13, C.ink);
  });
}

// ---------------------------------------------------------------------------
// Flag + castle
// ---------------------------------------------------------------------------

export const FLAGPOLE_HEIGHT = 224;

function generateFlagTextures(scene) {
  bake(scene, 'flag-pole', 8, FLAGPOLE_HEIGHT, (g) => {
    g.fillStyle(0x101633, 1); g.fillRect(0, 0, 8, FLAGPOLE_HEIGHT);
    g.fillStyle(0xffc61f, 1); g.fillRect(2, 0, 4, FLAGPOLE_HEIGHT);
    g.fillStyle(0xfff1a0, 1); g.fillRect(2, 0, 2, FLAGPOLE_HEIGHT);
  });
  pixelMap(scene, 'flag-ball', ['.YY.', 'YlYY', 'YYYD', '.DD.'], { Y: C.gold, l: C.goldHi, D: C.goldSh }, { scale: 3, outline: C.ink });
  canvasArt(scene, 'flag-banner', 22, 13, 2, (put) => {
    for (let y = 0; y < 13; y++) {
      const notch = Math.abs(6 - y) < 3 ? 3 - Math.abs(6 - y) : 0;
      for (let x = 0; x < 22 - notch; x++) put(x, y, y === 12 ? C.redSh : C.red);
      put(22 - notch - 1, y, C.ink);
    }
    for (let x = 0; x < 22; x++) { put(x, 0, C.ink); }
    codeGlyphCells().forEach(([x, y]) => put(x + 3, y + 3, C.white));
  });
  // Contact-world door (physics trigger), 40x56
  canvasArt(scene, 'castle-door', 20, 28, 2, (put) => {
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 20; x++) {
        const dx = x - 9.5;
        const inArch = y > 8 ? true : (dx * dx + (y - 9) * (y - 9) * 1.2) < 90;
        if (inArch) put(x, y, C.ink);
      }
    }
    for (let y = 4; y < 28; y++) for (let x = 3; x < 17; x++) {
      const dx = x - 9.5;
      if (y > 10 || (dx * dx + (y - 11) * (y - 11)) < 42) put(x, y, '#241338');
    }
  });
  generateCastle(scene, 'castle', 28, 40);
  generateCastle(scene, 'castle-big', 56, 66);
}

function generateCastle(scene, key, w, h) {
  canvasArt(scene, key, w, h, 2, (put) => {
    const merlonH = 6;
    const towerTop = merlonH;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let solid = y >= towerTop;
        if (y < merlonH) solid = Math.floor(x / 5) % 2 === 0 && x < w;
        if (!solid) continue;
        put(x, y, brickColor(x, y));
      }
    }
    // outline
    for (let x = 0; x < w; x++) { put(x, h - 1, C.ink); }
    for (let y = 0; y < h; y++) { put(0, y, C.ink); put(w - 1, y, C.ink); }
    for (let x = 0; x < w; x++) {
      if (Math.floor(x / 5) % 2 === 0) put(x, 0, C.ink);
      else put(x, merlonH, C.ink);
      if (x % 5 === 0 || x % 5 === 4) for (let y = 0; y <= merlonH; y++) put(x, y, C.ink);
    }
    // ledge
    for (let x = 0; x < w; x++) { put(x, merlonH + 4, C.mortar); put(x, merlonH + 3, C.brickHi); }
    // arched door
    const dw = Math.round(w * 0.36);
    const dx0 = Math.round((w - dw) / 2);
    const dTop = Math.round(h * 0.55);
    for (let y = dTop; y < h - 1; y++) {
      for (let x = dx0; x < dx0 + dw; x++) {
        const cx = x - (dx0 + dw / 2 - 0.5);
        const r = dw / 2;
        if (y - dTop < r && cx * cx + (y - dTop - r) * (y - dTop - r) > r * r) continue;
        put(x, y, C.ink);
      }
    }
    // windows
    const wy = merlonH + 8;
    [Math.round(w * 0.25), Math.round(w * 0.7)].forEach((wx) => put(wx, wy, C.ink, 2, 4));
  });
}

// ---------------------------------------------------------------------------
// Background + decor
// ---------------------------------------------------------------------------

function blobArt(scene, key, w, h, circles, colors, scale) {
  canvasArt(scene, key, w, h, scale, (put) => {
    const inside = (x, y) => circles.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r) && y < h - colors.flatBottom;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!inside(x, y)) {
          if (colors.outline && (inside(x - 1, y) || inside(x + 1, y) || inside(x, y - 1) || inside(x, y + 1))) put(x, y, colors.outline);
          continue;
        }
        const depthBelow = [1, 2, 3].filter((d) => !inside(x, y + d)).length;
        const nearTop = !inside(x, y - 2) || !inside(x - 2, y - 1);
        let c = colors.base;
        if (depthBelow >= 2) c = colors.sh2 || colors.sh;
        else if (depthBelow === 1) c = colors.sh;
        else if (nearTop && colors.hi) c = colors.hi;
        put(x, y, c);
      }
    }
  });
}

export function generateBackdrop(scene) {
  // Sky gradient, banded like pixel art
  if (!scene.textures.exists('sky')) {
    const tex = scene.textures.createCanvas('sky', 4, 600);
    const ctx = tex.getContext();
    const top = [0x1a, 0x7f, 0xea];
    const bot = [0x9a, 0xdc, 0xff];
    const bands = 12;
    for (let i = 0; i < bands; i++) {
      const t = i / (bands - 1);
      const c = top.map((v, k) => Math.round(v + (bot[k] - v) * t));
      ctx.fillStyle = `rgb(${c.join(',')})`;
      ctx.fillRect(0, Math.floor((i * 600) / bands), 4, Math.ceil(600 / bands) + 1);
    }
    tex.refresh();
  }
}

function generateDecorTextures(scene) {
  generateBackdrop(scene);

  const cloudColors = { base: C.cloud, sh: C.cloudSh, sh2: C.cloudSh2, flatBottom: 0 };
  blobArt(scene, 'cloud', 40, 16, [[9, 10, 6], [18, 7, 7], [27, 8, 6], [33, 11, 5], [20, 12, 5]], cloudColors, 3);
  blobArt(scene, 'cloud-small', 26, 12, [[7, 7, 5], [14, 5, 5], [20, 8, 4]], cloudColors, 3);

  // Far mountains (tileable, 240 art px period)
  canvasArt(scene, 'mountains', 240, 80, 2, (put, w, h) => {
    const peaks = [[20, 46], [70, 62], [115, 40], [160, 70], [205, 50], [260, 46]];
    const height = (x) => Math.max(...peaks.map(([px, ph]) => {
      const d = Math.min(Math.abs(x - px), Math.abs(x - px + 240), Math.abs(x - px - 240));
      return ph - d * 0.9;
    }));
    for (let x = 0; x < w; x++) {
      const top = h - Math.round(height(x) / 2) * 2;
      for (let y = Math.max(0, top); y < h; y++) {
        let c = C.mtn;
        if (y === top || y === top + 1) c = C.mtnHi;
        else if ((x + y) % 14 < 2) c = C.mtnHi;
        else if ((x - y + 400) % 18 < 3) c = C.mtnSh;
        put(x, y, c);
      }
    }
  });

  // Near rolling hills (tileable, 200 art px period)
  canvasArt(scene, 'hills', 200, 50, 2, (put, w, h) => {
    const humps = [[30, 40, 38], [110, 30, 44], [170, 34, 36], [230, 40, 38]];
    const height = (x) => Math.max(0, ...humps.map(([cx, hh, r]) => {
      const d = Math.min(Math.abs(x - cx), Math.abs(x - cx + 200), Math.abs(x - cx - 200));
      return d < r ? hh * Math.sqrt(1 - (d / r) ** 2) : 0;
    }));
    for (let x = 0; x < w; x++) {
      const top = h - Math.round(height(x));
      for (let y = Math.max(0, top); y < h; y++) {
        let c = C.hill;
        if (y === top) c = C.bushInk;
        else if (y < top + 3) c = C.hillHi;
        else if ((x + y) % 16 < 2) c = C.hillHi;
        else if ((x * 3 + y * 5) % 23 === 0) c = C.hillSh;
        put(x, y, c);
      }
    }
  });

  const bushColors = { base: C.bush, sh: C.hillSh, hi: C.bushHi, outline: C.bushInk, flatBottom: 0 };
  blobArt(scene, 'bush', 36, 16, [[8, 12, 7], [17, 9, 9], [27, 12, 7]], bushColors, 2);
  blobArt(scene, 'bush-small', 22, 12, [[6, 9, 5], [13, 7, 6], [17, 9, 4]], bushColors, 2);

  // Floating browser window
  canvasArt(scene, 'browser', 44, 30, 2, (put, w, h) => {
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) put(x, y, C.ink);
    for (let y = 2; y < 8; y++) for (let x = 2; x < w - 2; x++) put(x, y, C.navy);
    for (let y = 9; y < h - 2; y++) for (let x = 2; x < w - 2; x++) put(x, y, C.screen);
    for (let x = 2; x < w - 2; x++) put(x, 9, C.white);
    [[5, '#ff4d4d'], [9, '#ffd23f'], [13, '#4cd964']].forEach(([x, c]) => put(x, 4, c, 2, 2));
    codeGlyphCells().forEach(([x, y]) => put(x + 15, y + 15, C.ink));
  });

  // Wooden sign with a laptop
  canvasArt(scene, 'sign', 30, 30, 2, (put) => {
    put(13, 18, C.ink, 4, 12); put(14, 18, C.woodSh, 2, 12);
    for (let y = 0; y < 20; y++) for (let x = 0; x < 30; x++) put(x, y, C.ink);
    for (let y = 1; y < 19; y++) for (let x = 1; x < 29; x++) put(x, y, C.wood);
    for (let x = 1; x < 29; x++) put(x, 18, C.woodSh);
    for (let y = 4; y < 13; y++) for (let x = 8; x < 22; x++) put(x, y, C.ink);
    for (let y = 5; y < 12; y++) for (let x = 9; x < 21; x++) put(x, y, C.navy);
    for (let x = 6; x < 24; x++) { put(x, 13, C.ink); put(x, 14, '#c9d3ea'); put(x, 15, C.ink); }
    put(13, 7, C.white); put(12, 8, C.white); put(13, 9, C.white);
    put(16, 7, C.white); put(15, 8, C.white); put(15, 9, C.white);
    put(17, 7, C.white); put(18, 8, C.white); put(17, 9, C.white);
  });

  bake(scene, 'star-particle', 6, 6, (g) => {
    g.fillStyle(PALETTE.gold, 1);
    g.fillRect(0, 0, 6, 6);
  });
}

export function makePipeTexture(scene, key, width, height) {
  canvasArt(scene, key, width / 2, height / 2, 2, (put, w, h) => {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const lip = y < 10;
        const x0 = lip ? 0 : 2;
        const x1 = lip ? w - 1 : w - 3;
        if (x < x0 || x > x1) continue;
        let c = C.pipe;
        if (x === x0 || x === x1 || y === 0 || y === h - 1 || y === 9 || (y === 10 && lip)) c = C.ink;
        else if (x - x0 === 2 || x - x0 === 3) c = C.pipeHi;
        else if (x1 - x <= 3) c = C.pipeSh;
        put(x, y, c);
      }
    }
  });
}

function generateCaveTextures(scene) {
  const S = 32;
  bake(scene, 'cave-block', S, S, (g) => {
    g.fillStyle(PALETTE.caveBlock, 1);
    g.fillRect(0, 0, S, S);
    g.lineStyle(2, PALETTE.caveBlockDark, 1);
    g.strokeRect(0, 0, S, S);
    g.strokeRect(0, 0, S / 2, S / 2);
    g.strokeRect(S / 2, S / 2, S / 2, S / 2);
    g.fillStyle(PALETTE.caveBlockHighlight, 1);
    g.fillRect(1, 1, S / 2 - 2, 2);
    g.fillRect(S / 2 + 1, S / 2 + 1, S / 2 - 2, 2);
  });
}

function generateItemTextures(scene) {
  pixelMap(scene, 'coffee-cup', [
    '..s.s....',
    '.s.s.....',
    'LLLLLLL..',
    'WWWWWWW..',
    'WRRRRRWWW',
    'WRRRRRW.W',
    'WWWWWWWWW',
    '.WWWWW...',
    '.WWWWW...',
  ], { s: '#dfe9ff', L: C.redSh, W: C.white, R: C.red }, { outline: C.ink });
}

export { hex };
