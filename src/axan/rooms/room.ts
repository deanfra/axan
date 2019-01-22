import RoomInstance from "../../interfaces/room-instance";
import Door from "../tiles/door";
import None from "../tiles/none";
import Wall from "../tiles/wall";
import Tile from "../tiles/tile";

import { Piq } from "../enemies/piq";
import { Vroll } from "../enemies/vroll";
import { DungeonScene } from "scenes/dungeon.scene";

// The responsibility of a Room should be to:
// - Place layout, enemies & items
// - Retrieve room state

export default class Room {
  public readonly room: RoomInstance;
  public readonly groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private enemyGroup: Phaser.GameObjects.Group;
  public tiles: Array<Array<Tile|Wall>>;
  public id: number;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public left: number;
  public top: number;
  public right: number;
  public bottom: number;
  private isSetup: boolean;
  private scene: DungeonScene;

  constructor(room, scene) {
    this.room = room;
    this.id = room.id;
    this.x = room.x;
    this.y = room.y;
    this.width = room.width;
    this.height = room.height;
    this.left = room.left;
    this.top = room.top;
    this.right = room.right;
    this.bottom = room.bottom;

    this.groundLayer = scene.groundLayer;
    this.enemyGroup = scene.enemyGroup;
    this.scene = scene;
  }

  setup(): Room {
    if (!this.isSetup) {
      this.instantiateTiles();
      this.placeTiles();
      const collisionArray = Array.apply(null, { length: 22 }).map(Number.call, Number);
      this.groundLayer.setCollision(collisionArray, true);
      this.isSetup = true;
      this.addEnemies();
      this.addPickups();
    }
    return this;
  }

  addEnemies(): void {
    const worldX = this.scene.map.tileToWorldX(this.room.x + (this.room.width/2));
    const worldY = this.scene.map.tileToWorldY(this.room.y + (this.room.height/2));
    const EnemyClass = (Math.random()*2>1) ? Vroll : Piq;

    this.enemyGroup.add(new EnemyClass(this.scene, worldX, worldY, Math.floor(Math.random() * 2)), true);
  }

  addPickups() {
    const randomX = Phaser.Math.Between(this.room.x+2, this.room.x+this.room.width-2);
    const randomY = Phaser.Math.Between(this.room.y+2, this.room.y+this.room.height-2);
    const worldX = this.scene.map.tileToWorldX(randomX);
    const worldY = this.scene.map.tileToWorldY(randomY);

    let PickupClass = this.scene.add.sprite(worldX, worldY, 'beams');

    if(Math.random() * 2 > 1) {
      PickupClass.name = "smg";
    } else {
      PickupClass.name = "pistol";
    }

    PickupClass.setDepth(10);
    this.scene.physics.world.enable(PickupClass, Phaser.Physics.Arcade.STATIC_BODY);
    this.scene.physics.add.overlap(PickupClass, this.scene.player, this.scene.pickupGet);
    this.scene.physics.add.collider(PickupClass, this.scene.groundLayer);
    PickupClass.body.allowGravity = false;

    PickupClass.play(PickupClass.name === "smg" ? "ice" : "charge");
  }
  
  instantiateTiles(): void {
    const { tiles: tileMap, width: roomWidth, height: roomHeight } = this.room;

    this.tiles = [];
    for (let y = 0; y < roomHeight; y++) {
      this.tiles.push([]);
      for (let x = 0; x < roomWidth; x++) {
        const tileNum = tileMap[y][x];
        if (tileNum === 3) {
          this.tiles[y][x] = new Door(x, y, this);
        } else if (tileNum === 2) {
          // 20% chance to place a random tile
          if (Math.floor(Math.random() * 10) > 8) {
            this.tiles[y][x] = new Wall(x, y, this);
          } else {
            // 40% chance to extend tiles into platforms
            const lastTile:Tile = this.tiles[y][x-1];
            if (lastTile.constructor.name === "Wall" && Math.floor(Math.random() * 10) > 6) {
              this.tiles[y][x] = new Wall(x, y, this);
            } else {
              this.tiles[y][x] = new None(x, y, this);
            }
          }
        } else {
          this.tiles[y][x] = new Wall(x, y, this);
        }
      }
    }
  }

  placeTiles(): void {
    this.tiles.forEach((tileY: any) => {
      tileY.forEach((tileX: any) => {
        tileX.placeTile();
      })
    })
  }

  replaceTile(newTile: Tile): void {
    this.tiles[newTile.y][newTile.x] = newTile;
    newTile.placeTile()
  }

  // placePlatforms() {
  //   const { x: roomX, y: roomY } = this.room;
  //   const cellularMap = Cellular(this.room.width, this.room.height, { aliveThreshold: 4.7 });

  //   cellularMap.grid.forEach((tiles, y) => {
  //     tiles.map((place, x) => {
  //       if (place) {
  //         this.groundLayer.putTileAt(2, roomX + x, roomY + y);
  //       }
  //     });
  //   });

  // }

  tileAt(x: number, y: number): Tile | Wall | null {
    if (!this.tiles[y] || y < 0 || y >= this.room.height || x < 0 || x >= this.room.width) {
      return null;
    }
    return this.tiles[y][x];
  }
}
