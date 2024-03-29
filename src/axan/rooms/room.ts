import { RoomInstance, DoorInstance } from "../../interfaces/room-instance";
import Door from "../tiles/door";
import DoorGate from "../tiles/door-gate";
import None from "../tiles/none";
import Wall from "../tiles/wall";
import BackTile from "../tiles/back-tile";
import Tile from "../tiles/tile";
import PickupFactory from "../pickups/pickup-factory";

import { Jumper } from "../enemies/jumper";
import { Piq } from "../enemies/piq";
import { Gnid } from "../enemies/gnid";
import { GnidPatrol } from "../enemies/gnid-patrol";
import { Vroll } from "../enemies/vroll";
import MainScene from "axan/main.scene";
import * as Cellular from "cellular-dungeon";
import * as _ from "lodash";

// The responsibility of a Room should be to:
// - Place layout, enemies & items
// - Retrieve room state

export class Room {
  public readonly room: RoomInstance;
  public readonly groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  public readonly backLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private isSetup: boolean;
  private enemyGroup: Phaser.GameObjects.Group;
  public tiles: Array<Array<Tile>>;
  public backTiles: Array<Array<Tile>>;
  public type: string = "default";
  private doorLookup: { [key: number]: Array<Door> } = {};
  private doorGateLookup: { [key: number]: DoorGate } = {};

  public readonly id: number;
  public readonly x: number;
  public readonly y: number;
  public readonly width: number;
  public readonly height: number;
  public readonly left: number;
  public readonly right: number;
  private readonly scene: MainScene;

  constructor(roomInstance, scene) {
    this.room = roomInstance;
    this.id = roomInstance.id;
    this.x = roomInstance.x;
    this.y = roomInstance.y;
    this.width = roomInstance.width;
    this.height = roomInstance.height;
    this.left = roomInstance.left;
    this.right = roomInstance.right;

    this.scene = scene;
    this.groundLayer = scene.groundLayer;
    this.backLayer = scene.backLayer;
    this.enemyGroup = scene.enemyGroup;
  }

  setup(): Room {
    console.log(this.type, this.width, this.height);
    if (!this.isSetup) {
      // Group doors up
      this.instantiateTiles();
      this.instantiatePlatforms();
      this.placeTiles();

      this.instantiateBack();
      this.placeBackTiles();

      const collisionArray = _.range(22);
      this.groundLayer.setCollision(collisionArray, true);
      this.addEnemies();
      this.addPickups();
      this.addDoorGate();
      this.isSetup = true;
    }

    return this;
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
          this.tiles[y][x] = new None(x, y, this);
        } else {
          this.tiles[y][x] = new Wall(x, y, this);
        }
      }
    }

    this.room.doors.forEach((door) => {
      const doorTile: any = this.tileAt(door.x - this.room.left, door.y - this.room.top);
      this.doorLookup[door.linksTo] = this.doorLookup[door.linksTo] || [];
      this.doorLookup[door.linksTo].push(doorTile);
    });
  }

  placeTiles(): void {
    this.tiles.forEach((tileY: Array<Tile>) => {
      tileY.forEach((tileX: Tile) => {
        tileX.placeTile();
      });
    });
  }

  placeBackTiles(): void {
    this.backTiles.forEach((tileY: Array<BackTile | None>) => {
      tileY.forEach((tileX: BackTile | None) => {
        tileX.placeBackTile();
      });
    });
  }

  addEnemies(): void {
    const x = _.sample(_.range(this.room.x + 1, this.room.x + this.room.width - 1));
    const y = _.sample(_.range(this.room.y + 1, this.room.y + this.room.height - 1));
    const worldX = this.scene.map.tileToWorldX(x);
    const worldY = this.scene.map.tileToWorldY(y);
    const EnemyClass = _.sample([Vroll, Piq, Jumper, Gnid, GnidPatrol]);
    this.enemyGroup.add(new EnemyClass(this.scene, worldX, worldY, _.sample([1, 2])), true);
  }

  addDoorGate(): void {
    _.forEach(this.doorLookup, ([door]: Array<Door>, id) => {
      const worldX = this.scene.map.tileToWorldX(this.room.left + door.x);
      const worldY = this.scene.map.tileToWorldY(this.room.top + door.y);

      this.doorGateLookup[id] = new DoorGate(this.scene, worldX + 8, worldY + 8, door);
      this.scene.doorGateGroup.add(this.doorGateLookup[id], true);
    });
  }

  addPickups() {
    const randNoneTile: any = _.sample(_.sample(this.tiles).filter((tile) => tile.tileLabel === "None")) || {};
    const randomX = randNoneTile.x + this.room.x;
    const randomY = this.room.height + this.room.y;
    const worldX = this.scene.map.tileToWorldX(randomX) + 8;
    const worldY = this.scene.map.tileToWorldY(randomY) - 32 - 8;

    PickupFactory.createRandomPickup(this.scene, worldX, worldY);
  }

  instantiatePlatforms() {
    const { width: roomWidth, height: roomHeight } = this.room;
    const cellularMap = Cellular(this.room.width, this.room.height, { aliveThreshold: 4.12 });

    for (let y = 1; y < roomHeight - 1; y++) {
      for (let x = 1; x < roomWidth - 1; x++) {
        const cellularMapTile = cellularMap.grid[y][x];
        if (cellularMapTile) {
          this.tiles[y][x] = new Wall(x, y, this);
        }
      }
    }
    this.clearDoorways();
  }

  instantiateBack() {
    const { width: roomWidth, height: roomHeight } = this.room;
    const cellularMap = Cellular(this.room.width, this.room.height, { aliveThreshold: 4.1 });
    this.backTiles = [[]];

    for (let y = 0; y < roomHeight; y++) {
      this.backTiles.push([]);
      for (let x = 0; x < roomWidth; x++) {
        const cellularMapTile = cellularMap.grid[y][x];
        if (cellularMapTile) {
          this.backTiles[y][x] = new BackTile(x, y, this);
        } else {
          this.backTiles[y][x] = new None(x, y, this);
        }
      }
    }
  }

  clearDoorways() {
    // loop through doors
    _.forEach(this.doorLookup, (doors) => {
      doors.forEach((door) => {
        door.clearDoorway(this);
      });
    });
  }

  tileAt(x: number, y: number): Door | Wall | Tile | null {
    if (!this.tiles[y] || y < 0 || y >= this.room.height || x < 0 || x >= this.room.width) {
      return null;
    }
    return this.tiles[y][x];
  }

  backTileAt(x: number, y: number): Tile | null {
    if (!this.backTiles[y] || y < 0 || y >= this.room.height || x < 0 || x >= this.room.width) {
      return null;
    }
    return this.backTiles[y][x];
  }

  movePlayerIntoRoom(previousRoom) {
    if (previousRoom) {
      const { x, y, clearance: c } = this.doorLookup[previousRoom.id][1];

      const xOffset = c.dir === "e" ? 2 : c.dir === "w" ? -1 : 2;
      const yOffset = c.dir === "n" ? 0 : c.dir === "s" ? 4 : 3;

      // offset nesw based on door clearance
      this.scene.player.x = this.scene.map.tileToWorldX(this.x + x + xOffset);
      this.scene.player.y = this.scene.map.tileToWorldX(this.y + y + yOffset);

      _.forEach(this.doorGateLookup, (doorGate) => {
        doorGate.shut();
      });
    }
  }
}
