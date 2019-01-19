import Player from '../axan/sprites/player';
import Background from '../axan/sprites/background';
import Room from "../axan/room";
import Rooms from "../axan/rooms";
import RoomVisibility from "../axan/room-visibility";
import RandomPlanetName from "../util/name-gen";
import { Enemy, Piq } from "axan/sprites/enemies";

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
    this.load.image("axan", "../assets/tilesets/player.png");
    this.load.image("crateriaSprite", "../assets/tilesets/crateria.png");
    this.load.image("caves", "../assets/tilesets/caves.png");
  }

  create(): void {

    console.log("Welcome to "+RandomPlanetName());
    this.rooms = new Rooms(this.scene);
    this.makeTiles();
    this.rooms.setupRooms(this.groundLayer);
    this.setupRoomVisibility();
    this.setupPlayer();
    this.setupCamera();
    this.setupBackground();
    this.setupGuns();
    this.setupProjectiles();
    this.setupEnemies();

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
    // place player in the top most room
    const { centerX, bottom } = this.rooms.startRoom.room;
    
    const playerX = this.map.tileToWorldX(centerX);
    const playerY = this.map.tileToWorldY(bottom-1);

    this.player = new Player(this, playerX, playerY, 'player', this.groundLayer);
    this.physics.add.collider(this.player, this.groundLayer);
    this.player.anims.play('begin');
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

  setupGuns() {
    const smgPickup: Phaser.GameObjects.Sprite = this.add.sprite(this.player.x - 40, this.player.y + 10, 'beams');
    smgPickup.setDepth(10);
    smgPickup.name = 'smg';
    this.physics.world.enable(smgPickup, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.physics.add.overlap(smgPickup, this.player, this.pickupGet);
    this.physics.add.collider(smgPickup, this.groundLayer);
    smgPickup.body.allowGravity = false;

    const pistolPickup: Phaser.GameObjects.Sprite = this.add.sprite(this.player.x + 40, this.player.y + 10, 'beams');
    pistolPickup.setDepth(10);
    pistolPickup.name = 'pistol';
    this.physics.world.enable(pistolPickup, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.physics.add.overlap(pistolPickup, this.player, this.pickupGet);
    this.physics.add.collider(pistolPickup, this.groundLayer);
    pistolPickup.body.allowGravity = false;

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

    smgPickup.play('charge');
    pistolPickup.play('ice');
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
    this.anims.create({
      key: 'projectile',
      frames: [{ key: 'projectiles', frame: 1 }]
    });
    this.anims.create({
      key: 'projectile',
      frames: [{ key: 'beam', frame: 2 }]
    });

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

  setupEnemies() {
    this.enemyGroup = this.add.group();
    this.killedEnemies = this.add.group();

    // world / enemy hit detection
    this.physics.add.collider(this.enemyGroup as any, this.groundLayer);
    this.physics.add.collider(this.killedEnemies as any, this.groundLayer);
    // enemy / player hit detection
    this.physics.add.overlap(this.enemyGroup as any, this.player, this.enemyHit);

    this.anims.create({
      key: 'piq',
      frameRate: 15,
      repeat: -1,
      frames: this.anims.generateFrameNames('enemies', { start: 0, end: 3 })
    });

    // projectile / enemy hit detection
    this.physics.add.overlap(
      this.projectileGroup as any,
      this.enemyGroup as any,
      this.enemyShot,
      undefined, this
    );

    this.enemyGroup.add(new Piq(this, this.player.x - 20, this.player.y, Math.floor(Math.random() * 2)), true);
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
