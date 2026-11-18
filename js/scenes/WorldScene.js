import { Player } from '../entities/Player.js';
import { Bug } from '../entities/Bug.js';
import { Coin, PowerUp, ContentBlock, Pipe, Flagpole } from '../entities/Interactables.js';
import { LEVELS, GROUND_Y, WORLD_HEIGHT } from '../levels/levels.js';
import { GameState } from '../state/GameState.js';
import { sfx } from '../audio/Sfx.js';
import { buildPixelHud, setHudValues } from '../ui/Hud.js';
import {
  openAboutParagraph, openExperience, openSkill, openAllProjects, openContact, isPanelOpen,
} from '../ui/Panels.js';

export class WorldScene extends Phaser.Scene {
  constructor() {
    super('World');
  }

  init(data) {
    this.levelKey = data.levelKey || 'about';
    this.level = LEVELS[this.levelKey];
    this.spawnX = data.spawnX ?? null;
  }

  create() {
    const level = this.level;
    this.physics.world.setBounds(0, 0, level.width, WORLD_HEIGHT + 300);
    this.cameras.main.setBounds(0, 0, level.width, WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor(level.bgTint);

    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      s: Phaser.Input.Keyboard.KeyCodes.S,
    });

    this._buildBackground(level);
    this._buildGround(level);

    this.player = new Player(this, this.spawnX ?? 80, GROUND_Y - 100);
    this.player.setDepth(5);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(120, 80);

    this.bugsGroup = this.physics.add.group();
    level.enemies.forEach((e) => {
      const bug = new Bug(this, e.x, GROUND_Y - 40, e.rangeMin, e.rangeMax);
      this.bugsGroup.add(bug);
    });

    this.coinsGroup = this.physics.add.group();
    level.coins.forEach((c) => this.coinsGroup.add(new Coin(this, c.x, c.y)));

    this.powerUpsGroup = this.physics.add.group();
    (level.powerUps || []).forEach((p) => this.powerUpsGroup.add(new PowerUp(this, p.x, p.y)));

    this.blocks = level.blocks.map((b) => new ContentBlock(this, b.x, b.y, b.contentKey, (block) => this._onBlockHit(block)));
    this.pipes = level.pipes.map((p) => new Pipe(this, p.x, GROUND_Y, p.height, [p.projectIndex], null));

    this.flag = new Flagpole(this, level.flagX, GROUND_Y, level.isCastle, (flag, player) => this._onFlagReached(flag, player));

    this.physics.add.collider(this.player, this.groundGroup);
    this.physics.add.collider(this.bugsGroup, this.groundGroup);
    this.physics.add.collider(this.powerUpsGroup, this.groundGroup);
    this.physics.add.collider(this.player, this.bugsGroup, this._onPlayerBug, null, this);
    this.physics.add.overlap(this.player, this.coinsGroup, this._onPlayerCoin, null, this);
    this.physics.add.overlap(this.player, this.powerUpsGroup, this._onPlayerPowerUp, null, this);
    this.physics.add.overlap(this.player, this.flag, () => this.flag.trigger(this.player));
    this.blocks.forEach((block) => this.physics.add.collider(this.player, block, () => this._checkBlockHit(block)));
    this.pipes.forEach((pipe) => this.physics.add.collider(this.player, pipe));

    this._buildHud(level);
    this._buildTouchControlsBinding();

    this.cameras.main.fadeIn(220, 0, 0, 0);
  }

  _buildBackground(level) {
    const W = this.scale.width;
    const H = this.scale.height;
    this.add.image(0, 0, 'sky').setOrigin(0, 0).setDisplaySize(W, H).setScrollFactor(0).setDepth(-10);

    const layer = (key, factor, y, depth, alpha = 1) => {
      const tex = this.textures.get(key).getSourceImage();
      const width = Math.ceil(level.width * factor + W + tex.width);
      return this.add.tileSprite(0, y, width, tex.height, key)
        .setOrigin(0, 1).setScrollFactor(factor, 1).setDepth(depth).setAlpha(alpha);
    };
    layer('mountains', 0.12, GROUND_Y + 6, -8);
    layer('hills', 0.3, GROUND_Y + 6, -7);

    // Clouds drift at their own pace
    for (let x = 40, i = 0; x < level.width * 0.4 + W; x += 230, i++) {
      const key = i % 3 === 1 ? 'cloud-small' : 'cloud';
      const y = 60 + ((i * 53) % 150);
      this.add.image(x, y, key).setScrollFactor(0.25, 1).setDepth(-6);
    }
    // Floating browser windows with a cloud cushion
    for (let x = 620; x < level.width * 0.3 + W; x += 900) {
      const y = 120 + ((x / 900) % 2) * 40;
      this.add.image(x, y, 'browser').setScrollFactor(0.3, 1).setDepth(-5);
      this.add.image(x - 40, y + 34, 'cloud-small').setScrollFactor(0.3, 1).setDepth(-5);
      this.add.image(x + 46, y + 38, 'cloud-small').setScrollFactor(0.3, 1).setDepth(-5).setFlipX(true);
    }
    // Bushes along the ground
    for (let x = 120, i = 0; x < level.width; x += 260 + ((i * 97) % 180), i++) {
      this.add.image(x, GROUND_Y + 2, i % 2 ? 'bush-small' : 'bush').setOrigin(0.5, 1).setDepth(-1);
    }
    // Welcome sign at the start of each world, castle behind the goal flag
    this.add.image(150, GROUND_Y + 2, 'sign').setOrigin(0.5, 1).setDepth(-1);
    if (level.isCastle) {
      this.add.image(level.flagX, GROUND_Y, 'castle-big').setOrigin(0.5, 1).setDepth(-1);
    } else {
      this.add.image(level.flagX + 80, GROUND_Y, 'castle').setOrigin(0.5, 1).setDepth(-1);
    }
  }

  _buildGround(level) {
    this.groundGroup = this.physics.add.staticGroup();
    const segments = [];
    let cursor = 0;
    const pits = [...level.pits].sort((a, b) => a.x - b.x);
    pits.forEach((pit) => {
      segments.push({ x: cursor, w: pit.x - cursor });
      cursor = pit.x + pit.width;
    });
    segments.push({ x: cursor, w: level.width - cursor });

    segments.forEach((seg) => {
      if (seg.w <= 0) return;
      const h = WORLD_HEIGHT - GROUND_Y;
      this.add.tileSprite(seg.x, GROUND_Y, seg.w, 32, 'ground').setOrigin(0, 0).setDepth(1);
      this.add.tileSprite(seg.x, GROUND_Y + 32, seg.w, h - 32 + 40, 'ground-fill').setOrigin(0, 0).setDepth(1);
      const s = this.groundGroup.create(seg.x + seg.w / 2, GROUND_Y + h / 2, 'ground');
      s.setDisplaySize(seg.w, h);
      s.setVisible(false);
      s.refreshBody();
    });

    level.platforms.forEach((p) => {
      this.add.tileSprite(p.x, p.y, p.w, 28, 'platform').setOrigin(0, 0).setDepth(1);
      const s = this.groundGroup.create(p.x + p.w / 2, p.y + 8, 'platform');
      s.setDisplaySize(p.w, 16);
      s.setVisible(false);
      s.refreshBody();
    });
  }

  _buildHud(level) {
    const hud = buildPixelHud(this, level.title);
    Object.assign(this, hud);
    this._refreshHud();
  }

  _refreshHud() {
    setHudValues(this, GameState);
  }

  _buildTouchControlsBinding() {
    const btns = window.__portfolioGameTouch;
    if (!btns) return;
    this.player.controls = btns;
  }

  _onPlayerBug(playerObj, bugObj) {
    if (!bugObj.alive) return;
    const isStomp = playerObj.body.velocity.y > 0 && playerObj.y < bugObj.y - 6;
    if (isStomp) {
      bugObj.squash();
      playerObj.bounce();
      GameState.score += 50;
      sfx.stomp();
      this._refreshHud();
    } else {
      const dir = playerObj.x < bugObj.x ? -1 : 1;
      if (playerObj.hurt(dir)) {
        GameState.lives -= 1;
        this._refreshHud();
        if (GameState.lives <= 0) this._gameOver();
      }
    }
  }

  _onPlayerCoin(playerObj, coinObj) {
    if (!coinObj.active || !coinObj.body.enable) return;
    coinObj.collect();
    GameState.coins += 1;
    GameState.score += 10;
    sfx.coin();
    this._refreshHud();
  }

  _onPlayerPowerUp(playerObj, powerObj) {
    if (!powerObj.active || !powerObj.body.enable) return;
    powerObj.collect();
    GameState.lives = Math.min(5, GameState.lives + 1);
    sfx.powerup();
    this._refreshHud();
  }

  _checkBlockHit(block) {
    if (block.used) return;
    if (this.player.body.touching.up) block.hit(this.player);
  }

  _onBlockHit(block) {
    sfx.block();
    GameState.score += 5;
    this._refreshHud();
    this.player.frozen = true;
    this.physics.world.pause();
    const resume = () => { this.player.frozen = false; this.physics.world.resume(); };

    if (block.contentKey.startsWith('about-')) {
      if (block.contentKey === 'about-exp') openExperience(resume);
      else openAboutParagraph(Number(block.contentKey.split('-')[1]), resume);
    } else if (block.contentKey === 'all-projects') {
      openAllProjects(resume);
    } else {
      openSkill(block.contentKey, resume);
    }
  }

  _onFlagReached(flag, player) {
    player.frozen = true;
    player.setVelocity(0, 0);
    sfx.clear();
    GameState.score += 100;
    this._refreshHud();

    if (flag.isCastle) {
      this.physics.world.pause();
      this._fireworks();
      openContact(() => {
        this.physics.world.resume();
      }, { finale: true });
      return;
    }

    this.tweens.add({
      targets: player, x: flag.x + 6, y: GROUND_Y - 40, duration: 700, ease: 'Sine.easeIn',
      onComplete: () => {
        this.time.delayedCall(400, () => {
          this.scene.start('WorldClear', { nextKey: this.level.next, clearedTitle: this.level.title });
        });
      },
    });
  }

  _fireworks() {
    const emitter = this.add.particles(this.player.x, this.player.y - 40, 'star-particle', {
      speed: { min: 100, max: 260 },
      angle: { min: 0, max: 360 },
      lifespan: 900,
      quantity: 24,
      scale: { start: 1.4, end: 0 },
      tint: [0xffc61f, 0xe8352c, 0xffffff, 0x3f5ec6],
    });
    emitter.setScrollFactor(0);
    this.time.delayedCall(950, () => emitter.destroy());
  }

  spawnDoubleJumpBurst(x, y) {
    const emitter = this.add.particles(x, y + 14, 'star-particle', {
      speed: { min: 40, max: 90 },
      angle: { min: 90, max: 450 },
      lifespan: 300,
      quantity: 6,
      scale: { start: 1, end: 0 },
      tint: [0xffd23f, 0xf7f3ee],
    });
    this.time.delayedCall(320, () => emitter.destroy());
  }

  _gameOver() {
    this.player.frozen = true;
    sfx.gameover();
    this.time.delayedCall(600, () => this.scene.start('GameOver', { levelKey: this.levelKey }));
  }

  update(time, delta) {
    if (!this.player.active) return;
    this.player.update(time, delta);
    this.bugsGroup.getChildren().forEach((b) => b.update && b.update(time, delta));
    this.coinsGroup.getChildren().forEach((c) => c.update && c.update(time, delta));

    if (this.player.y > WORLD_HEIGHT + 200 && !this.player.frozen) {
      this._onFallInPit();
    }

    this.pipes.forEach((pipe) => this._updatePipe(pipe));
  }

  _onFallInPit() {
    this.player.frozen = true;
    GameState.lives -= 1;
    this._refreshHud();
    sfx.hurt();
    if (GameState.lives <= 0) {
      this._gameOver();
    } else {
      this.time.delayedCall(500, () => this.scene.restart({ levelKey: this.levelKey }));
    }
  }

  _updatePipe(pipe) {
    if (isPanelOpen()) return;
    const topY = pipe.y - pipe.displayHeight / 2;
    const onTop = this.player.onGround
      && Math.abs(this.player.body.bottom - topY) < 12
      && Math.abs(this.player.x - pipe.x) < pipe.displayWidth / 2 + 8;
    pipe.setPromptVisible(onTop);
    if (onTop && this.player.isDown && !pipe.entered) {
      pipe.entered = true;
      this._enterPipe(pipe);
    }
    if (!onTop) pipe.entered = false;
  }

  _enterPipe(pipe) {
    sfx.block();
    this.player.frozen = true;
    this.player.setVelocity(0, 0);
    this.cameras.main.fadeOut(220, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Underworld', {
        projectIndex: pipe.projectKeys[0],
        returnLevelKey: this.levelKey,
        returnX: pipe.x,
      });
    });
  }
}
