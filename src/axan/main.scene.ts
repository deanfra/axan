import Player from './player';
import Background from './background';
import { Room } from "./rooms";
import Level from "./level";
import Inventory from "./inventory";
import HUD from "./hud";
import RoomVisibility from "./rooms/room-visibility";
import RandomPlanetName from "../util/name-gen";
import { Enemy } from "axan/enemies";
import Projectile from "axan/beams/projectile";
import * as _ from "lodash";

// The responsibility of Main should be to:
// - Manage camera
// - Manage player
// - Preload assets

export default class MainScene extends Phaser.Scene {
  public map: Phaser.Tilemaps.Tilemap;

  public groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private groundTileset: Phaser.Tilemaps.Tileset;
  public backLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private backTileset: Phaser.Tilemaps.Tileset;
  private outOfBoundsLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private outOfBoundsTileset: Phaser.Tilemaps.Tileset;

  public backgroundGroup: Phaser.GameObjects.Group;
  public doorGateGroup: Phaser.GameObjects.Group;
  public enemyGroup: Phaser.GameObjects.Group;
  public hudGroup: Phaser.GameObjects.Group;
  public killedEnemies: Phaser.GameObjects.Group;
  public pickupGroup: Phaser.GameObjects.Group;
  public projectileGroup: Phaser.GameObjects.Group;
  
  public player: Player;
  public level: Level;
  public roomVisibility: any;
  public activeRoom: Room;

  public inventory: Inventory;
  public hud: HUD;

  private levelName: string = RandomPlanetName();
  private levelPrefix: string = _.sample(["lahiri", "suophus", "creotur"]);
  
  public inventoryText: Phaser.GameObjects.BitmapText;
  public healthText: Phaser.GameObjects.BitmapText;
  public nameText: Phaser.GameObjects.BitmapText;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image("player", "../assets/tilesets/player-atlas.png");
  }

  create(): void {
    console.log("Welcome to " + this.levelName);
    this.level = new Level(this);
    this.inventory = new Inventory(this);

    this.makeTiles();
    this.makeBackTiles();
    this.setupRoomVisibility();
    this.setupBackground();
    this.setupEnemyGroup();
    this.setupDoorGateGroup();
    this.setupPickupGroup();
    this.level.instantiateRooms();
    this.setupPlayer();
    this.level.startRoom.setup();
    this.setupProjectileGroup();
    this.setupCamera();
    this.hud = new HUD(this);
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta);

    this.enemyGroup.children.entries.concat(this.killedEnemies.children.entries)
      .forEach(
        enemy => enemy.update(time, delta), this
      );
  }

  makeTiles() {
    this.map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: this.level.dungeonInstance.width,
      height: this.level.dungeonInstance.height
    });

    this.groundTileset = this.map.addTilesetImage(this.levelPrefix+"-ground", this.levelPrefix+"-ground", 16, 16);
    this.groundLayer = this.map.createBlankDynamicLayer("groundLayer", this.groundTileset);
    this.groundLayer.depth = 2;
    this.outOfBoundsTileset = this.map.addTilesetImage(this.levelPrefix+"-out-of-bounds", this.levelPrefix+"-out-of-bounds", 16, 16);
    this.outOfBoundsLayer = this.map.createBlankDynamicLayer("outOfBoundsLayer", this.outOfBoundsTileset);
  }

  makeBackTiles() {
    const backMap = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: this.level.dungeonInstance.width,
      height: this.level.dungeonInstance.height
    });

    this.backTileset = backMap.addTilesetImage(this.levelPrefix+"-back", this.levelPrefix+"-back", 16, 16);
    this.backLayer = backMap.createBlankDynamicLayer("backLayer", this.backTileset);
    this.backLayer.depth = 1;
  }

  setupRoomVisibility() {
    const tileArray = _.range(20);
    this.outOfBoundsLayer.randomize(0, 0, this.level.dungeonInstance.width, this.level.dungeonInstance.height, tileArray)
    this.outOfBoundsLayer.setDepth(99);
    this.roomVisibility = new RoomVisibility(this.outOfBoundsLayer, this);
  }

  setupPlayer() {
    const { centerX, bottom } = this.level.startRoom.room;
    const playerX = this.map.tileToWorldX(centerX);
    const playerY = this.map.tileToWorldY(bottom-1);
    this.player = new Player(this, playerX, playerY);
    
    // player / world hit detection
    this.physics.add.collider(this.player, this.groundLayer);
    // player / enemy hit detection
    this.physics.add.overlap(this.player, this.enemyGroup, this.player.enemyHurtPlayer);
    // player / door gate hit detection
    this.physics.add.collider(this.player, this.doorGateGroup);

    this.add.existing(this.player);
  }

  setupBackground() {
    this.backgroundGroup = this.add.group();
    this.backgroundGroup.add(new Background(this, this.levelPrefix+"-bg-front", 0.9, -1));
    this.backgroundGroup.add(new Background(this, this.levelPrefix+"-bg-mid", 0.7, -2));
    this.backgroundGroup.add(new Background(this, this.levelPrefix+"-bg-back", 0.5, -3));
  }

  setupCamera() {
    // + Extract to camera class
    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap

    const camera = this.cameras.main;
    camera.setRoundPixels(true);
    camera.setZoom(3);

    camera.startFollow(this.player, true, 0.3, 0.3, 0, 40);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }
  
  setupDoorGateGroup() {
    [
      {
        key: 'door-open',
        repeat: 0,
        frameRate: 20,
        frames: this.anims.generateFrameNames('door-gates', { start: 1, end: 3, prefix: 'door-open' })
      }, {
        key: 'door-close',
        repeat: 0,
        frameRate: 20,
        frames: 
          this.anims.generateFrameNames('door-gates', { start: 1, end: 3, prefix: 'door-open' }).reverse()
            .concat(this.anims.generateFrameNames('door-gates', { start: 1, end: 1, prefix: 'door-active' }))
            .concat(this.anims.generateFrameNames('door-gates', { start: 1, end: 1, prefix: 'door-active' }))
            .concat(this.anims.generateFrameNames('door-gates', { start: 1, end: 1, prefix: 'door-active' }))
            .concat(this.anims.generateFrameNames('door-gates', { start: 1, end: 1, prefix: 'door-active' }))
            .concat(this.anims.generateFrameNames('door-gates', { start: 1, end: 1, prefix: 'door-closed' }))
      }, {
        key: 'door-closed',
        repeat: -1,
        frames: this.anims.generateFrameNames('door-gates', { start: 1, end: 1, prefix: 'door-closed' })
      }, {
        key: 'door-active',
        repeat: -1,
        frames: this.anims.generateFrameNames('door-gates', { start: 1, end: 1, prefix: 'door-active' })
      }
    ].forEach(anim => this.anims.create(anim));

    this.doorGateGroup = this.add.group();
    // enemy / door gate hit detection
    this.physics.add.collider(this.enemyGroup, this.doorGateGroup);
  }

  doorShot = (projectile: Projectile, doorGate: any) => {
    projectile.projectileCollide();
    doorGate.open();
  }

  setupPickupGroup() {
    this.pickupGroup = this.add.group();

    const repeat = -1;
    const frameRate = 15;

    [
      {
        key: 'health-pickup',
        frameRate: 7,
        yoyo: true,
        frames: this.anims.generateFrameNames('pickups', { start: 1, end: 3, prefix: "health-pickup" })
      }, {
        key: 'hi-jump-boots',
        frameRate: 7,
        frames: this.anims.generateFrameNames('pickups', { start: 1, end: 2, prefix: "boot-pickup" })
      }, {
        key: 'dash-boots',
        frameRate: 7,
        frames: this.anims.generateFrameNames('pickups', { start: 1, end: 2, prefix: "dash-pickup" })
      }, {
        key: 'wall-jump-boots',
        frameRate: 7,
        frames: this.anims.generateFrameNames('pickups', { start: 1, end: 2, prefix: "walljump-pickup" })
      }, {
        key: 'health-upgrade',
        frameRate: 7,
        frames: this.anims.generateFrameNames('pickups', { start: 1, end: 2, prefix: "globe" })
      }, {
        key: 'health-upgrade-2',
        frameRate: 7,
        frames: this.anims.generateFrameNames('pickups', { start: 1, end: 2, prefix: "globe-steel" })
      }, {
        key: 'pickup-holder',
        frames: this.anims.generateFrameNames('pickups', { start: 1, end: 1, prefix: "pickup-holder" })
      }, {
        key: 'charge',
        frames: this.anims.generateFrameNames('beam-pickups', { start: 0, end: 1 })
      }, {
        key: 'spazer',
        frames: this.anims.generateFrameNames('beam-pickups', { start: 2, end: 3 })
      }, {
        key: 'wave',
        frames: this.anims.generateFrameNames('beam-pickups', { start: 4, end: 5 })
      }, {
        key: 'ice',
        frames: this.anims.generateFrameNames('beam-pickups', { start: 6, end: 7 })
      }, {
        key: 'plasma',
        frames: this.anims.generateFrameNames('beam-pickups', { start: 8, end: 9 })
      }
    ].forEach(anim => this.anims.create(_.merge({ repeat, frameRate }, anim)));
  }

  setupProjectileGroup() {
    this.projectileGroup = this.add.group();

    // world / projectiles hit detection
    this.physics.add.collider(
      this.projectileGroup,
      this.groundLayer,
      (projectile: Projectile) => {
        if (projectile.active) {
          projectile.projectileCollide();
        }
      }, undefined, this);


    this.physics.add.overlap(this.projectileGroup, this.enemyGroup, this.enemyShot, undefined, this);
    this.physics.add.overlap(this.projectileGroup, this.doorGateGroup, this.doorShot, undefined, this);

    [
      {
        key: 'beam-photon',
        frames: this.anims.generateFrameNames('projectiles', { start: 1, end: 1, prefix: "photon", zeroPad: 2 })
      },
      {
        key: 'beam-pulse',
        frames: this.anims.generateFrameNames('projectiles', { start: 1, end: 1, prefix: "pulse", zeroPad: 2 })
      },
      {
        key: 'beam-rang',
        frames: this.anims.generateFrameNames('projectiles', { start: 1, end: 1, prefix: "rang", zeroPad: 2 })
      },
      {
        key: 'beam-orb',
        frames: this.anims.generateFrameNames('projectiles', { start: 1, end: 1, prefix: "orb", zeroPad: 2 })
      },
      {
        key: 'beam-ice',
        frames: this.anims.generateFrameNames('projectiles', { start: 1, end: 1, prefix: "ice", zeroPad: 2 })
      },
      {
        key: 'beam-fire',
        frames: this.anims.generateFrameNames('projectiles', { start: 1, end: 1, prefix: "fire", zeroPad: 2 })
      }, {
        key: 'beam-impact',
        frameRate: 20,
        repeat: 0,
        frames: this.anims.generateFrameNames('effects', { start: 0, end: 5, prefix: 'beam-impact' })
      }
    ].forEach(anim => this.anims.create(anim))
  }

  setupEnemyGroup() {
    this.enemyGroup = this.add.group();
    this.killedEnemies = this.add.group();

    // world / enemy hit detection
    this.physics.add.collider(this.enemyGroup, this.groundLayer);
    this.physics.add.collider(this.killedEnemies, this.groundLayer);

    [{
      key: 'piq',
      frameRate: 15,
      repeat: -1,
      frames: this.anims.generateFrameNames('enemies', { start: 0, end: 4, prefix: 'piq', zeroPad: 2 })
    }, {
      key: 'gnid',
      frameRate: 15,
      repeat: -1,
      frames: this.anims.generateFrameNames('enemies', { start: 1, end: 8, prefix: 'gnid' })
    }, {
      key: 'jumper-idle',
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNames('enemies', { start: 0, end: 4, prefix: 'jumper-idle', zeroPad: 2 })
    }, {
      key: 'jumper-jump',
      frameRate: 4,
      repeat: 0,
      frames: this.anims.generateFrameNames('enemies', { start: 1, end: 1, prefix: 'jumper-jump', zeroPad: 2 })
    }, {
      key: 'vroll',
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNames('enemies', { start: 0, end: 2, prefix: 'vroll-idle', zeroPad: 2 })
    }, {
      key: 'vroll-down',
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNames('enemies', { start: 0, end: 2, prefix: 'vroll-attack', zeroPad: 2 })
    }, {
      key: 'enemy-death',
      frameRate: 20,
      repeat: 0,
      frames: this.anims.generateFrameNames('effects', { start: 0, end: 6, prefix: 'enemy-death', zeroPad: 2 })
    }].forEach(anim => this.anims.create(anim))
  }

  // refactor into enemy.ts
  enemyShot = (projectile: Projectile, enemy: Enemy) => {
    if (enemy.canDamage || projectile.getData('bypass')) {
      const scene = this as MainScene;
      let fromRight = projectile.x > enemy.x;
      let shouldFlip = false;
      let multiplier = 1;

      if (fromRight && enemy.body.velocity.x > 0 && projectile.getData('flip')) {
        shouldFlip = true;
      } else if (!fromRight && enemy.body.velocity.x < 0 && projectile.getData('flip')) {
        shouldFlip = true;
      }

      if (projectile.getData('force')) {
        multiplier = projectile.getData('force');
      }

      enemy.hurt(projectile.damage, multiplier, shouldFlip);

      if (projectile.effects.indexOf("ice") >= 0) {
        if (enemy.health <= projectile.damage) {
          enemy.freeze();
        }
      }

      if (projectile.getData('onEnemy')) {
        projectile.getData('onEnemy')(projectile, enemy, scene);
      }
    }
    projectile.projectileCollide();
  }

  cameraConstrainTo(room: Room): void {
    // If my camera is already following a target
    // if (this.game.camera.target) {
    //   this.game.camera.follow(null);  // Unfollow the target  
    //   // Move the camera to the center of a planet, adjusting for the camera being 'centered' at the top-left.}
    //   this.game.add.tween(this.game.camera).to({ x: pCenter.x - (this.game.camera.width / 2), y: pCenter.y - (this.game.camera.height / 2) }, 750, Phaser.Easing.Quadratic.InOut, true);  

    const camera = this.cameras.main;
    // Constrain camera to room bounds
    const { x, y, width, height, left, right } = room;
    const [trX, trY, trLeft, trRight] = [x, y, width, height, left, right].map(rc => this.map.tileToWorldX(rc));

    camera.setBounds(trX, trY, window.innerWidth, window.innerHeight);
    camera.stopFollow();
    camera.startFollow(this.player, true, 0.3, 0.3, 0, 40);
  }
}
