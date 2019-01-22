import Player from '../axan/player';
import Background from '../axan/background';
import Room from "../axan/rooms/room";
import Rooms from "../axan/level";
import RoomVisibility from "../axan/room-visibility";
import RandomPlanetName from "../util/name-gen";
import { Enemy } from "axan/enemies";

// The responsibility of the Dungeon (main) should be to:
// - Manage camera
// - Manage player
// - Preload assets

// Tasks
// - Cleanup projectile code
// - Cleanup pickup code

export class DungeonScene extends Phaser.Scene {
  private camera: Phaser.Cameras.Scene2D.Camera;
  private cameraResizeNeeded: boolean;
  public map: Phaser.Tilemaps.Tilemap;

  private groundTileset: Phaser.Tilemaps.Tileset;
  public groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private outOfBoundsTileset: Phaser.Tilemaps.Tileset;
  private outOfBoundsLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private platformLayer: Phaser.Tilemaps.DynamicTilemapLayer;

  public projectileGroup: Phaser.GameObjects.Group;
  public enemyGroup: Phaser.GameObjects.Group;
  public killedEnemies: Phaser.GameObjects.Group;
  public pickupGroup: Phaser.GameObjects.Group;

  public player: Player;
  public background: Background;
  public rooms: Rooms;
  public roomVisibility: any;
  public activeRoom: Room;

  constructor() {
    super({ key: 'DungeonScene' });
  }

  preload() {
    this.load.image("axan", "../assets/tilesets/16x16-crateria.png");
    this.load.image("axan", "../assets/tilesets/player-atlas.png");
    // this.load.image("axan", "../assets/tilesets/player.png");
    this.load.image("crateriaSprite", "../assets/tilesets/crateria.png");
    this.load.image("caves", "../assets/tilesets/caves.png");
  }

  create(): void {
    console.log("Welcome to "+RandomPlanetName());
    this.rooms = new Rooms(this);
    this.makeTiles();
    this.setupRoomVisibility();
    this.setupBackground();
    // push these into a room's constructor
    this.setupEnemyGroup();
    this.setupPickupGroup();
    this.setupPickups();
    this.rooms.instantiateRooms();
    this.setupPlayer();
    this.setupCamera();
    // Push these into the room's setup function
    this.setupProjectiles();

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
      this.cameraResizeNeeded = false;
    }
  }

  makeTiles() {
    this.map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: this.rooms.dungeonInstance.width,
      height: this.rooms.dungeonInstance.height
    });

    this.groundTileset = this.map.addTilesetImage("axan", "axan", 16, 16);
    this.groundLayer = this.map.createBlankDynamicLayer("groundLayer", this.groundTileset);
    this.outOfBoundsTileset = this.map.addTilesetImage("crateria", "crateria", 16, 16);
    this.outOfBoundsLayer = this.map.createBlankDynamicLayer("outOfBoundsLayer", this.outOfBoundsTileset);
    this.platformLayer = this.map.createBlankDynamicLayer("platformLayer", this.groundTileset);
  }

  setupRoomVisibility() {
    const tileArray = Array.apply(null, { length: 20 }).map(Number.call, Number);
    this.outOfBoundsLayer.randomize(0, 0, this.rooms.dungeonInstance.width, this.rooms.dungeonInstance.height, tileArray)
    this.outOfBoundsLayer.setDepth(100);
    this.roomVisibility = new RoomVisibility(this.outOfBoundsLayer, this);
  }

  setupPlayer() {
    const { centerX, bottom } = this.rooms.startRoom.room;
    
    const playerX = this.map.tileToWorldX(centerX);
    const playerY = this.map.tileToWorldY(bottom-1);

    this.player = new Player(this, playerX, playerY, 'player', this.groundLayer);
    // player / world hit detection
    this.physics.add.collider(this.player, this.groundLayer);
    // player / enemy hit detection
    this.physics.add.overlap(this.player, this.enemyGroup as any, this.enemyHit);
    this.add.existing(this.player);
  }

  setupBackground() {
    this.background = new Background(this, this.groundLayer);
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
  
  setupPickupGroup() {
    this.pickupGroup = this.add.group();
    this.physics.add.overlap(this.pickupGroup as any, this.player, this.pickupGet);  
  }

  setupPickups() {
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

  setupProjectiles() {
    this.projectileGroup =
      this.add.group({
        createCallback: proj => this.physics.world.enable(proj)
      });
    // world / projectiles hit detection
    this.physics.add.collider(
      this.projectileGroup as any,
      this.groundLayer,
      (proj) => {
        if (proj.active && proj.getData('onCollide')) { proj.getData('onCollide')(proj, this); }
      }, undefined, this);

    // projectile / enemy hit detection
    this.physics.add.overlap( this.projectileGroup as any, this.enemyGroup as any, this.enemyShot, undefined, this);

    [
      {
        key: 'beam1',
        defaultTextureKey: 'projectiles',
        frames: this.anims.generateFrameNames('projectiles', { start: 0, end: 0 })
      },
      {
        key: 'beam2',
        defaultTextureKey: 'projectiles',
        frames: this.anims.generateFrameNames('projectiles', { start: 1, end: 1 })
      },
    ].forEach(anim => this.anims.create(anim))
  }

  setupEnemyGroup() {
    this.enemyGroup = this.add.group();
    this.killedEnemies = this.add.group();

    // world / enemy hit detection
    this.physics.add.collider(this.enemyGroup as any, this.groundLayer);
    this.physics.add.collider(this.killedEnemies as any, this.groundLayer);

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
    console.log('x - enemy hit')
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

  pickupGet = (pickup: Phaser.GameObjects.Sprite) => {
    this.player.changeGun(pickup.name);
    pickup.destroy();
  }

  cameraConstrainTo(room: Room) {
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
