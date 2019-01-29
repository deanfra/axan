import { RoomInstance, DoorInstance } from "../../interfaces/room-instance";
import Door from "../tiles/door";
import DoorGate from "../tiles/door-gate";
import None from "../tiles/none";
import Wall from "../tiles/wall";
import Tile from "../tiles/tile";

import { Piq } from "../enemies/piq";
import { Vroll } from "../enemies/vroll";
import { DungeonScene } from "scenes/dungeon.scene";
import * as Cellular from "cellular-dungeon";
import * as _ from "lodash";

// The responsibility of a Room should be to:
// - Place layout, enemies & items
// - Retrieve room state

export class Room {
  public readonly room: RoomInstance;
  public readonly groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  public readonly platformLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private isSetup: boolean;
  private enemyGroup: Phaser.GameObjects.Group;
  public tiles: Array<Array<Tile>>;
  public type: string = "default";
  private doorLookup: {[key: number]: Array<Door>} = {};
  private doorGateLookup: {[key: number]: DoorGate} = {};

  public readonly id: number;
  public readonly x: number;
  public readonly y: number;
  public readonly width: number;
  public readonly height: number;
  public readonly left: number;
  public readonly top: number;
  public readonly right: number;
  public readonly bottom: number;
  private readonly scene: DungeonScene;

  constructor(roomInstance, scene) {
    this.room = roomInstance;
    this.id = roomInstance.id;
    this.x = roomInstance.x;
    this.y = roomInstance.y;
    this.width = roomInstance.width;
    this.height = roomInstance.height;
    this.left = roomInstance.left;
    this.top = roomInstance.top;
    this.right = roomInstance.right;
    this.bottom = roomInstance.bottom;

    this.scene = scene;
    this.groundLayer = scene.groundLayer;
    this.platformLayer = scene.platformLayer;
    this.enemyGroup = scene.enemyGroup;
  }

  setup(): Room {
    console.log(this.type, this.width, this.height)
    if (!this.isSetup) {
      // Group doors up
      this.instantiateTiles();
      this.instantiatePlatforms();
      this.clearDoorways();
      this.placeTiles();
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

    this.room.doors.forEach(door => {
      const doorTile: any = this.tileAt((door.x - this.room.left), (door.y-this.room.top));
      this.doorLookup[door.linksTo] = this.doorLookup[door.linksTo] || [];
      this.doorLookup[door.linksTo].push(doorTile);
    });
  }

  placeTiles(): void {
    this.tiles.forEach((tileY: any) => {
      tileY.forEach((tileX: any) => {
        tileX.placeTile();
      })
    })
  }

  addEnemies(): void {
    const worldX = this.scene.map.tileToWorldX(this.room.x + (this.room.width/2));
    const worldY = this.scene.map.tileToWorldY(this.room.y + (this.room.height/2));
    const EnemyClass = (Math.random()*2>1) ? Vroll : Piq;

    this.enemyGroup.add(new EnemyClass(this.scene, worldX, worldY, Math.floor(Math.random() * 2)), true);
  }

  addDoorGate(): void {
    _.forEach(this.doorLookup, ([door]: Array<Door>, id) => {
      const worldX = this.scene.map.tileToWorldX(this.room.left+door.x);
      const worldY = this.scene.map.tileToWorldY(this.room.top+door.y);

      this.doorGateLookup[id] = new DoorGate(this.scene, (worldX + 8), (worldY + 8), door);
      this.scene.doorGateGroup.add(this.doorGateLookup[id], true);
    });
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

    this.scene.physics.world.enable(PickupClass, Phaser.Physics.Arcade.STATIC_BODY);
    this.scene.physics.add.overlap(PickupClass, this.scene.player, this.scene.player.pickupGet);
    PickupClass.play(PickupClass.name === "smg" ? "ice" : "charge");
  }

  instantiatePlatforms() {
    const { width: roomWidth, height: roomHeight } = this.room;
    const cellularMap = Cellular(this.room.width, this.room.height, { aliveThreshold: 4.1 });

    for (let y = 1; y < (roomHeight-1); y++) {
      for (let x = 1; x < (roomWidth-1); x++) {
        const cellularMapTile = cellularMap.grid[y][x];
        if (cellularMapTile) {
          this.tiles[y][x] = new Wall(x, y, this);
        }
      }
    }
  }

  clearDoorways() {
    // loop through doors
    _.forEach(this.doorLookup, doors => {
      doors.forEach(door => {
        const doorTile: any = this.tiles[door.y][door.x];

        // what direction to head in
        const { xInc, yInc } = doorTile.clearance;
        let [x, y] = [xInc, yInc];

        // walk in a direction and check for blocking walls
        let clear = false;
        while (!clear) {
          const tileY = this.tiles[door.y+y] || [];
          const nextTile = tileY[door.x+x];
          
          if (!nextTile) {
            // if we hit the edge of the room, step back and place wall
            const lastY = (door.y+y)-yInc;
            const lastX = (door.x+x)-xInc;
            this.tiles[lastY][lastX] = new Wall(lastX, lastY, this);
            clear = true;
          } else if (nextTile.constructor.name==="Wall") {
            this.tiles[nextTile.y][nextTile.x] = new None(nextTile.x, nextTile.y, this);
            x += xInc;
            y += yInc;
          } else {
            clear = true;
          }
        }
      });
    });
  }

  tileAt(x: number, y: number): Tile | null {
    if (!this.tiles[y] || y < 0 || y >= this.room.height || x < 0 || x >= this.room.width) {
      return null;
    }
    return this.tiles[y][x];
  }

  movePlayerIntoRoom(previousRoom) {
    if (previousRoom){
      const { x, y, clearance: c } = this.doorLookup[previousRoom.id][1];

      const xOffset = (c.dir==="e") ? 2 : (c.dir==="w") ? -1 : 2;
      const yOffset = (c.dir==="n") ? 0 : (c.dir==="s") ? 4 : 3;

      // offset nesw based on door clearance
      this.scene.player.x = this.scene.map.tileToWorldX(this.x + x + xOffset);
      this.scene.player.y = this.scene.map.tileToWorldX(this.y + y + yOffset);

      this.doorGateLookup[previousRoom.id].shut();

      console.log(xOffset, yOffset)
    }
  }
}
