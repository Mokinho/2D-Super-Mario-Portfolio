import { Player } from '../entities/Player.js';
import { Bug } from '../entities/Bug.js';
import { Coin, ContentBlock, Pipe } from '../entities/Interactables.js';
import { FEATURED_PROJECTS } from '../data/content.js';
import { GameState } from '../state/GameState.js';
import { sfx } from '../audio/Sfx.js';
import { PALETTE } from '../gfx/palette.js';
import { openProjectByIndex, isPanelOpen } from '../ui/Panels.js';

const ROOM_WIDTH = 760;
const ROOM_HEIGHT = 600;
const FLOOR_Y = 480;
const CEIL_Y = 96;

export class UnderworldScene extends Phaser.Scene {
  constructor() {
    super('Underworld');
  }

  init(data) {
    this.projectIndex = data.projectIndex;
    this.returnLevelKey = data.returnLevelKey;
    this.returnX = data.returnX;
  }

  create() {
    const project = FEATURED_PROJECTS[this.projectIndex];
    this.cameras.main.setBackgroundColor(PALETTE.caveBg);
    this.physics.world.setBounds(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    this.cameras.main.setBounds(0, 0, ROOM_WIDTH, ROOM_HEIGHT);

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

    this.groundGroup = this.physics.add.staticGroup();
    const floor = this.groundGroup.create(ROOM_WIDTH / 2, FLOOR_Y + 60, 'cave-block');
    floor.setDisplaySize(ROOM_WIDTH, 120);
    floor.refreshBody();
    const ceiling = this.groundGroup.create(ROOM_WIDTH / 2, CEIL_Y - 16, 'cave-block');
    ceiling.setDisplaySize(ROOM_WIDTH, 32);
    ceiling.refreshBody();

    this.player = new Player(this, 60, FLOOR_Y - 80);
    this.player.setDepth(5);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    this._buildTouchControlsBinding();

    this.bugsGroup = this.physics.add.group();
    this.bugsGroup.add(new Bug(this, ROOM_WIDTH * 0.55, FLOOR_Y - 40, ROOM_WIDTH * 0.35, ROOM_WIDTH * 0.75));

    this.coinsGroup = this.physics.add.group();
    [0.22, 0.3, 0.38, 0.46].forEach((f) => this.coinsGroup.add(new Coin(this, ROOM_WIDTH * f, FLOOR_Y - 150)));

    this.block = new ContentBlock(this, ROOM_WIDTH * 0.32, FLOOR_Y - 190, 'project', () => this._onBlockHit());

    this.upPipe = new Pipe(this, ROOM_WIDTH - 100, FLOOR_Y, 96, [this.projectIndex], null, '↓ Climb Back Up');

    this.physics.add.collider(this.player, this.groundGroup);
    this.physics.add.collider(this.bugsGroup, this.groundGroup);
    this.physics.add.collider(this.player, this.bugsGroup, this._onPlayerBug, null, this);
    this.physics.add.overlap(this.player, this.coinsGroup, this._onPlayerCoin, null, this);
    this.physics.add.collider(this.player, this.block, () => this._checkBlockHit());
    this.physics.add.collider(this.player, this.upPipe);

    this._buildHud(project);
    this.cameras.main.fadeIn(220, 0, 0, 0);
  }

  _buildTouchControlsBinding() {
    const btns = window.__portfolioGameTouch;
    if (!btns) return;
    this.player.controls = btns;
  }

  _buildHud(project) {
    const style = { fontFamily: 'monospace', fontSize: '15px', color: '#f7f3ee', stroke: '#000000', strokeThickness: 4 };
    this.add.rectangle(0, 0, this.scale.width, 84, 0x000000, 0.35).setOrigin(0, 0).setScrollFactor(0).setDepth(90);
    this.hudLives = this.add.text(16, 12, '', style).setScrollFactor(0).setDepth(100);
    this.hudCoins = this.add.text(16, 34, '', style).setScrollFactor(0).setDepth(100);
    this.hudScore = this.add.text(16, 56, '', style).setScrollFactor(0).setDepth(100);
    this.hudTitle = this.add.text(this.scale.width - 16, 12, `Underworld · ${project.title}`, {
      ...style, color: '#5aa8e8',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);
    this._refreshHud();
  }

  _refreshHud() {
    this.hudLives.setText(`☕ x${GameState.lives}`);
    this.hudCoins.setText(`◉ ${GameState.coins}`);
    this.hudScore.setText(`SCORE ${GameState.score}`);
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

  _checkBlockHit() {
    if (this.block.used) return;
    if (this.player.body.touching.up) this.block.hit(this.player);
  }

  _onBlockHit() {
    sfx.block();
    GameState.score += 5;
    this._refreshHud();
    this.player.frozen = true;
    this.physics.world.pause();
    openProjectByIndex(this.projectIndex, () => {
      this.player.frozen = false;
      this.physics.world.resume();
    });
  }

  _gameOver() {
    this.player.frozen = true;
    sfx.gameover();
    this.time.delayedCall(600, () => this.scene.start('GameOver', { levelKey: this.returnLevelKey }));
  }

  update(time, delta) {
    if (!this.player.active) return;
    this.player.update(time, delta);
    this.bugsGroup.getChildren().forEach((b) => b.update && b.update(time, delta));
    this.coinsGroup.getChildren().forEach((c) => c.update && c.update(time, delta));
    this._updateUpPipe();
  }

  _updateUpPipe() {
    if (isPanelOpen()) return;
    const topY = this.upPipe.y - this.upPipe.displayHeight / 2;
    const onTop = this.player.onGround
      && Math.abs(this.player.body.bottom - topY) < 12
      && Math.abs(this.player.x - this.upPipe.x) < this.upPipe.displayWidth / 2 + 8;
    this.upPipe.setPromptVisible(onTop);
    if (onTop && this.player.isDown && !this.upPipe.entered) {
      this.upPipe.entered = true;
      this._exit();
    }
    if (!onTop) this.upPipe.entered = false;
  }

  _exit() {
    sfx.block();
    this.player.frozen = true;
    this.player.setVelocity(0, 0);
    this.cameras.main.fadeOut(220, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('World', { levelKey: this.returnLevelKey, spawnX: this.returnX });
    });
  }
}
