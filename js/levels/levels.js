import { PALETTE } from '../gfx/palette.js';

export const GROUND_Y = 520;
export const WORLD_HEIGHT = 600;

function coinRow(xStart, y, count, spacing = 34) {
  return Array.from({ length: count }, (_, i) => ({ x: xStart + i * spacing, y }));
}

export const LEVELS = {
  about: {
    key: 'about',
    title: 'World 1 · About Me',
    bgTint: PALETTE.skyDay,
    width: 3600,
    pits: [],
    platforms: [
      { x: 700, y: 400, w: 160 },
      { x: 1500, y: 380, w: 192 },
      { x: 2300, y: 420, w: 160 },
      { x: 3000, y: 380, w: 192 },
    ],
    blocks: [
      { x: 400, y: 410, contentKey: 'about-0' },
      { x: 1100, y: 410, contentKey: 'about-1' },
      { x: 1560, y: 310, contentKey: 'about-2' },
      { x: 2360, y: 350, contentKey: 'about-3' },
      { x: 3050, y: 310, contentKey: 'about-exp' },
    ],
    pipes: [],
    powerUps: [],
    coins: [
      ...coinRow(760, 360, 4),
      ...coinRow(1550, 340, 4),
      ...coinRow(2350, 380, 4),
      ...coinRow(3050, 340, 4),
    ],
    enemies: [
      { x: 900, rangeMin: 850, rangeMax: 1300 },
      { x: 1900, rangeMin: 1850, rangeMax: 2200 },
      { x: 2700, rangeMin: 2650, rangeMax: 3000 },
    ],
    flagX: 3450,
    isCastle: false,
    next: 'skills',
  },

  skills: {
    key: 'skills',
    title: 'World 2 · Skills & Expertise',
    bgTint: PALETTE.skyTeal,
    width: 4400,
    pits: [{ x: 2000, width: 96 }],
    platforms: [
      { x: 600, y: 400, w: 160 },
      { x: 1100, y: 390, w: 160 },
      { x: 1700, y: 420, w: 160 },
      { x: 2300, y: 380, w: 192 },
      { x: 2800, y: 390, w: 160 },
      { x: 3400, y: 400, w: 192 },
      { x: 3900, y: 385, w: 160 },
    ],
    blocks: [
      { x: 650, y: 330, contentKey: 'frontend' },
      { x: 1150, y: 320, contentKey: 'wordpress' },
      { x: 1750, y: 350, contentKey: 'infra' },
      { x: 2350, y: 310, contentKey: 'marketing' },
      { x: 2850, y: 320, contentKey: 'design' },
      { x: 3450, y: 330, contentKey: 'programming' },
    ],
    pipes: [],
    powerUps: [],
    coins: [
      ...coinRow(1120, 300, 3),
      ...coinRow(1720, 380, 3),
      ...coinRow(2820, 300, 3),
      ...coinRow(3920, 320, 4),
    ],
    enemies: [
      { x: 800, rangeMin: 750, rangeMax: 1000 },
      { x: 1900, rangeMin: 1600, rangeMax: 1950 },
      { x: 3000, rangeMin: 2900, rangeMax: 3300 },
      { x: 3700, rangeMin: 3650, rangeMax: 3850 },
    ],
    flagX: 4300,
    isCastle: false,
    next: 'work',
  },

  work: {
    key: 'work',
    title: 'World 3 · Selected Work',
    bgTint: PALETTE.skySunset,
    width: 5400,
    pits: [{ x: 1800, width: 96 }, { x: 3600, width: 96 }],
    platforms: [
      { x: 1550, y: 400, w: 160 },
      { x: 3350, y: 400, w: 160 },
      { x: 5050, y: 400, w: 160 },
    ],
    blocks: [
      { x: 5100, y: 330, contentKey: 'all-projects' },
    ],
    pipes: [
      { x: 500, height: 96, projectIndex: 0 },
      { x: 1200, height: 128, projectIndex: 1 },
      { x: 2200, height: 96, projectIndex: 2 },
      { x: 2900, height: 128, projectIndex: 3 },
      { x: 4000, height: 128, projectIndex: 4 },
      { x: 4700, height: 96, projectIndex: 5 },
    ],
    powerUps: [],
    coins: [
      ...coinRow(1780, 420, 3, 32),
      ...coinRow(3580, 420, 3, 32),
      ...coinRow(2250, 340, 4),
    ],
    enemies: [
      { x: 900, rangeMin: 850, rangeMax: 1100 },
      { x: 1500, rangeMin: 1400, rangeMax: 1700 },
      { x: 2600, rangeMin: 2500, rangeMax: 2800 },
      { x: 3300, rangeMin: 3250, rangeMax: 3500 },
      { x: 4400, rangeMin: 4300, rangeMax: 4600 },
    ],
    flagX: 5300,
    isCastle: false,
    next: 'contact',
  },

  contact: {
    key: 'contact',
    title: 'World 4 · Contact',
    bgTint: PALETTE.skyDusk,
    width: 2200,
    pits: [],
    platforms: [
      { x: 900, y: 400, w: 160 },
    ],
    blocks: [],
    pipes: [],
    powerUps: [{ x: 960, y: 360 }],
    coins: [
      ...coinRow(1400, 420, 6),
    ],
    enemies: [
      { x: 600, rangeMin: 500, rangeMax: 800 },
      { x: 1700, rangeMin: 1600, rangeMax: 1900 },
    ],
    flagX: 2050,
    isCastle: true,
    next: null,
  },
};

export const LEVEL_ORDER = ['about', 'skills', 'work', 'contact'];
