import Player from "./player";
import Background from "./background";
import { Room } from "./rooms";
import Level from "./level";
import Inventory from "./inventory";
import HUD from "./hud";
import RoomVisibility from "./rooms/room-visibility";
import { Enemy } from "axan/enemies";
import MakeAnimations from "./animations";
import Projectile from "axan/beams/projectile";
import * as _ from "lodash";

import creoturTileMapping from "../assets/tilesets/worlds/creotur/creotur";
import lahiriTileMapping from "../assets/tilesets/worlds/lahiri/lahiri";
import suophusTileMapping from "../assets/tilesets/worlds/suophus/suophus";

// The responsibility of Main should be to:
// - Manage camera
// - Manage player
// - Preload assets

const tileMaps = {
  creotur: creoturTileMapping,
  lahiri: lahiriTileMapping,
  suophus: suophusTileMapping,
};

export default class MainScene extends Phaser.Scene {
  public map: Phaser.Tilemaps.Tilemap;

  public groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private groundTileset: Phaser.Tilemaps.Tileset;
  public groundTileMapping: { [key: string]: Array<number> };
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
  public vegetationGroup: Phaser.GameObjects.Group;

  public player: Player;
  public level: Level;
  public roomVisibility: any;
  public activeRoom: Room;

  public inventory: Inventory;
  public hud: HUD;

  public levelPrefix: string = _.sample(["lahiri", "suophus", "creotur"]);

  public nameText: Phaser.GameObjects.BitmapText;

  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image("player", "../assets/tilesets/player-atlas.png");
  }

  create(): void {
    this.level = new Level(this);
    this.inventory = new Inventory(this);

    MakeAnimations(this);

    this.setupGroups();
    this.makeTiles();
    this.makeBackTiles();
    this.setupRoomVisibility();
    this.setupBackground();
    this.setupEnemyColliders();
    this.setupDoorGateColliders();
    this.level.instantiateRooms();
    this.setupPlayer();
    this.level.startRoom.setup();
    this.setupProjectileColliders();
    this.setupCamera();
    this.hud = new HUD(this);
  }

  setupGroups() {
    this.doorGateGroup = this.add.group();
    this.vegetationGroup = this.add.group();
    this.backgroundGroup = this.add.group();
    this.pickupGroup = this.add.group();
    this.projectileGroup = this.add.group();
    this.enemyGroup = this.add.group();
    this.killedEnemies = this.add.group();
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta);

    this.enemyGroup.children.entries.concat(this.killedEnemies.children.entries).forEach((enemy) => enemy.update(time, delta), this);
  }

  makeTiles() {
    this.map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: this.level.dungeonInstance.width,
      height: this.level.dungeonInstance.height,
    });

    this.groundTileset = this.map.addTilesetImage(this.levelPrefix + "-ground", this.levelPrefix + "-ground", 16, 16);
    this.groundTileMapping = tileMaps[this.levelPrefix];
    this.groundLayer = this.map.createBlankDynamicLayer("groundLayer", this.groundTileset);
    this.groundLayer.depth = 2;

    this.outOfBoundsTileset = this.map.addTilesetImage(this.levelPrefix + "-out-of-bounds", this.levelPrefix + "-out-of-bounds", 16, 16);
    this.outOfBoundsLayer = this.map.createBlankDynamicLayer("outOfBoundsLayer", this.outOfBoundsTileset);
  }

  makeBackTiles() {
    const backMap = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: this.level.dungeonInstance.width,
      height: this.level.dungeonInstance.height,
    });

    this.backTileset = backMap.addTilesetImage(this.levelPrefix + "-back", this.levelPrefix + "-back", 16, 16);
    this.backLayer = backMap.createBlankDynamicLayer("backLayer", this.backTileset);
    this.backLayer.depth = 0;
  }

  setupRoomVisibility() {
    const tileArray = _.range(20);
    this.outOfBoundsLayer.randomize(0, 0, this.level.dungeonInstance.width, this.level.dungeonInstance.height, tileArray);
    this.outOfBoundsLayer.setDepth(99);
    this.roomVisibility = new RoomVisibility(this.outOfBoundsLayer, this);
  }

  setupPlayer() {
    const { centerX, bottom } = this.level.startRoom.room;
    const playerX = this.map.tileToWorldX(centerX);
    const playerY = this.map.tileToWorldY(bottom - 1);
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
    this.backgroundGroup.add(new Background(this, this.levelPrefix + "-bg-front", 0.9, -1));
    this.backgroundGroup.add(new Background(this, this.levelPrefix + "-bg-mid", 0.7, -2));
    this.backgroundGroup.add(new Background(this, this.levelPrefix + "-bg-back", 0.5, -3));
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

  setupDoorGateColliders() {
    const enemyHitDoor = (enemy) => {
      if (enemy.name === "GnidPatrol") {
        enemy.touchedDoor();
      }
    };
    this.physics.add.collider(this.enemyGroup, this.doorGateGroup, enemyHitDoor);
  }

  setupProjectileColliders() {
    // world / projectiles hit detection
    this.physics.add.collider(
      this.projectileGroup,
      this.groundLayer,
      (projectile: Projectile) => {
        if (projectile.active) {
          projectile.projectileCollide();
        }
      },
      undefined,
      this
    );

    this.physics.add.overlap(this.projectileGroup, this.enemyGroup, this.enemyShot, undefined, this);
    this.physics.add.overlap(this.projectileGroup, this.doorGateGroup, this.doorShot, undefined, this);
  }

  setupEnemyColliders() {
    // world / enemy hit detection
    this.physics.add.collider(this.enemyGroup, this.groundLayer);
    this.physics.add.collider(this.killedEnemies, this.groundLayer);
  }

  // refactor into enemy.ts
  enemyShot = (projectile: Projectile, enemy: Enemy) => {
    if (enemy.canDamage || projectile.getData("bypass")) {
      const scene = this as MainScene;
      let fromRight = projectile.x > enemy.x;
      let shouldFlip = false;
      let multiplier = 1;

      if (fromRight && enemy.body.velocity.x > 0 && projectile.getData("flip")) {
        shouldFlip = true;
      } else if (!fromRight && enemy.body.velocity.x < 0 && projectile.getData("flip")) {
        shouldFlip = true;
      }

      if (projectile.getData("force")) {
        multiplier = projectile.getData("force");
      }

      enemy.hurt(projectile.damage, multiplier, shouldFlip);

      if (projectile.effects.includes("ice")) {
        // If the enemy has only one shot remaining, freeze it
        if (enemy.health <= projectile.damage) {
          enemy.freeze();
        }
      }

      if (projectile.getData("onEnemy")) {
        projectile.getData("onEnemy")(projectile, enemy, scene);
      }
    }
    projectile.projectileCollide();
  };

  doorShot = (projectile: Projectile, doorGate: any) => {
    projectile.projectileCollide();
    doorGate.open();
  };

  cameraConstrainTo(room: Room): void {
    // If my camera is already following a target
    // if (this.game.camera.target) {
    //   this.game.camera.follow(null);  // Unfollow the target
    //   // Move the camera to the center of a planet, adjusting for the camera being 'centered' at the top-left.}
    //   this.game.add.tween(this.game.camera).to({ x: pCenter.x - (this.game.camera.width / 2), y: pCenter.y - (this.game.camera.height / 2) }, 750, Phaser.Easing.Quadratic.InOut, true);

    const camera = this.cameras.main;
    // Constrain camera to room bounds
    const { x, y, width, height, left, right } = room;
    const [trX, trY, trLeft, trRight] = [x, y, width, height, left, right].map((rc) => this.map.tileToWorldX(rc));

    camera.setBounds(trX, trY, window.innerWidth, window.innerHeight);
    camera.stopFollow();
    camera.startFollow(this.player, true, 0.3, 0.3, 0, 40);
  }
}
