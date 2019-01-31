import Player from '../axan/player';
import Background from '../axan/background';
import { Room } from "../axan/rooms/";
import Level from "../axan/level";
import RoomVisibility from "../axan/rooms/room-visibility";
import RandomPlanetName from "../util/name-gen";
import { Enemy } from "axan/enemies";
import * as _ from "lodash";

// The responsibility of the Dungeon (main) should be to:
// - Manage camera
// - Manage player
// - Preload assets

export class DungeonScene extends Phaser.Scene {
  private camera: Phaser.Cameras.Scene2D.Camera;
  private cameraResizeNeeded: boolean;
  public map: Phaser.Tilemaps.Tilemap;

  private groundTileset: Phaser.Tilemaps.Tileset;
  public groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  public platformLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private outOfBoundsTileset: Phaser.Tilemaps.Tileset;
  private outOfBoundsLayer: Phaser.Tilemaps.DynamicTilemapLayer;

  public projectileGroup: Phaser.GameObjects.Group;
  public enemyGroup: Phaser.GameObjects.Group;
  public killedEnemies: Phaser.GameObjects.Group;
  public doorGateGroup: Phaser.GameObjects.Group;
  
  public player: Player;
  public backgroundGroup: Phaser.GameObjects.Group;
  public level: Level;
  public roomVisibility: any;
  public activeRoom: Room;
  
  public inventoryText: Phaser.GameObjects.BitmapText;

  constructor() {
    super({ key: 'DungeonScene' });
  }

  preload() {
    this.load.image("axan", "../assets/tilesets/16x16-crateria.png");
    this.load.image("player", "../assets/tilesets/player-atlas.png");
    this.load.image("crateriaSprite", "../assets/tilesets/crateria.png");
  }

  create(): void {
    console.log("Welcome to "+RandomPlanetName());
    this.level = new Level(this);
    this.makeTiles();
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
    this.setupInventory();
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta);
    this.enemyGroup.children.entries.forEach(
      enemy => enemy.update(time, delta), this
    );
    this.killedEnemies.children.entries.forEach(
      enemy => enemy.update(time, delta), this
    );

    if (this.cameraResizeNeeded) {
      // Do this here rather than the resize callback as it limits
      // how much we'll slow down the game
      this.cameras.main.setSize(window.innerWidth, window.innerHeight);
      // this.inventoryText.setText(window.innerWidth.toString());
      this.cameraResizeNeeded = false;
    }
  }

  makeTiles() {
    this.map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: this.level.dungeonInstance.width,
      height: this.level.dungeonInstance.height
    });

    this.groundTileset = this.map.addTilesetImage("axan", "axan", 16, 16);
    this.groundLayer = this.map.createBlankDynamicLayer("groundLayer", this.groundTileset);
    this.outOfBoundsTileset = this.map.addTilesetImage("crateria", "crateria", 16, 16);
    this.outOfBoundsLayer = this.map.createBlankDynamicLayer("outOfBoundsLayer", this.outOfBoundsTileset);
    this.platformLayer = this.map.createBlankDynamicLayer("platformLayer", this.groundTileset);
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

    // this.player = new Player(this, 130, 300, 'player');
    this.player = new Player(this, playerX, playerY, 'player');
    
    // player / world hit detection
    this.physics.add.collider(this.player, this.groundLayer);
    // player / enemy hit detection
    this.physics.add.overlap(this.player, this.enemyGroup, this.enemyHit);
    // player / door gate hit detection
    this.physics.add.collider(this.player, this.doorGateGroup);

    this.add.existing(this.player);
  }

  setupBackground() {
    this.backgroundGroup = this.add.group();
    this.backgroundGroup.add(new Background(this, "caves-front", 0.9, -1));
    this.backgroundGroup.add(new Background(this, "caves-mid", 0.7, -2));
    this.backgroundGroup.add(new Background(this, "caves-back", 0.5, -3));
  }

  setupCamera() {
    // + Extract to camera class
    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    const camera = this.cameras.main;
    camera.setRoundPixels(true);
    camera.setZoom(3);

    window.addEventListener("resize", () => {
      this.cameraResizeNeeded = true;
    });

    camera.startFollow(this.player, true, 0.3, 0.3, 0, 40);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    // this.cameraConstrainTo(this.rooms.rooms[0]);
  }
  
  setupDoorGateGroup() {
    this.doorGateGroup = this.add.group();
    // enemy / door gate hit detection
    this.physics.add.collider(this.enemyGroup, this.doorGateGroup);

    [
      {
        key: 'idle-vert',
        repeat: -1,
        defaultTextureKey: 'doors-vert',
        frames: this.anims.generateFrameNames('doors-vert', { start: 1, end: 1 })
      }, {
        key: 'idle-vert-blank',
        repeat: -1,
        defaultTextureKey: 'doors-vert',
        frames: this.anims.generateFrameNames('doors-vert', { start: 0, end: 0 })
      }, {
        key: 'idle-horiz',
        repeat: -1,
        defaultTextureKey: 'doors-horiz',
        frames: this.anims.generateFrameNames('doors-horiz', { start: 1, end: 1 })
      }, {
        key: 'idle-horiz-blank',
        repeat: -1,
        defaultTextureKey: 'doors-horiz',
        frames: this.anims.generateFrameNames('doors-horiz', { start: 0, end: 0 })
      }
    ].forEach(anim => this.anims.create(anim));
  }

  doorShot = (proj: Phaser.GameObjects.Sprite, doorGate: any) => {
    doorGate.open();
  }

  setupPickupGroup() {
    [
      {
        key: 'charge',
        repeat: -1,
        frameRate: 15,
        defaultTextureKey: 'beams',
        frames: this.anims.generateFrameNames('beams', { start: 0, end: 1 })
      }, {
        key: 'ice',
        repeat: -1,
        frameRate: 15,
        defaultTextureKey: 'beams',
        frames: this.anims.generateFrameNames('beams', { start: 2, end: 3 })
      }
    ].forEach(anim => this.anims.create(anim));
  }

  setupProjectileGroup() {
    this.projectileGroup = this.add.group({ createCallback: proj => this.physics.world.enable(proj) });

    // world / projectiles hit detection
    this.physics.add.collider(
      this.projectileGroup,
      this.groundLayer,
      (projectile) => {
        if (projectile.active && projectile.getData('onCollide')) {
          projectile.getData('onCollide')(projectile, this);
        }
      }, undefined, this);


    this.physics.add.overlap(this.projectileGroup, this.enemyGroup, this.enemyShot, undefined, this);
    this.physics.add.overlap(this.projectileGroup, this.doorGateGroup, this.doorShot, undefined, this);

    [
      {
        key: 'beam-photon',
        defaultTextureKey: 'projectiles',
        frames: this.anims.generateFrameNames('projectiles', { start: 0, end: 0 })
      },
      {
        key: 'beam-fire',
        defaultTextureKey: 'projectiles',
        frames: this.anims.generateFrameNames('projectiles', { start: 1, end: 1 })
      },
    ].forEach(anim => this.anims.create(anim))
  }

  setupEnemyGroup() {
    this.enemyGroup = this.add.group();
    this.killedEnemies = this.add.group();

    // world / enemy hit detection
    this.physics.add.collider(this.enemyGroup, this.groundLayer);
    this.physics.add.collider(this.killedEnemies, this.groundLayer);

    this.anims.create({
      key: 'piq',
      frameRate: 15,
      repeat: -1,
      frames: this.anims.generateFrameNames('enemies', { start: 0, end: 3 })
    });
    this.anims.create({
      key: 'vroll',
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNames('enemies', { start: 4, end: 5 })
    });
    this.anims.create({
      key: 'vroll-down',
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNames('enemies', { start: 6, end: 7 })
    });
  }

  enemyHit = (enemy, player) => {
    // console.log('x - enemy hit')
  }

  enemyShot = (proj: Phaser.GameObjects.Sprite, enemy: Enemy) => {
    if (enemy.canDamage || proj.getData('bypass')) {
      const scene = this as DungeonScene;
      let fromRight = true;
      let shouldFlip = false;
      let multiplier = 1;
      if (proj.x < enemy.x) {
        fromRight = false;
      }
      if (fromRight && enemy.body.velocity.x > 0 && proj.getData('flip')) {
        shouldFlip = true;
      } else if (!fromRight && enemy.body.velocity.x < 0 && proj.getData('flip')) {
        shouldFlip = true;
      }
      if (proj.getData('force')) {
        multiplier = proj.getData('force');
      }

      enemy.damage(proj.getData('dmg'), fromRight, multiplier, shouldFlip);
      if (proj.getData('onEnemy')) {
        proj.getData('onEnemy')(proj, enemy, scene);
      }
      if (!proj.getData('melee')) {
        proj.destroy();
      }
    }
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

  setupInventory(): void {
    this.inventoryText = this.add.bitmapText((window.innerWidth/3)+15, ((window.innerHeight/3)*2)-15, 'mario', 'LASER BEAM', 3) as any;
    this.inventoryText.setDepth(100);
    this.inventoryText.setScrollFactor(0);
  }
}
