import { RoomInstance, DoorInstance } from "../../interfaces/room-instance";
import Door from "../tiles/door";
import None from "../tiles/none";
import Wall from "../tiles/wall";
import Tile from "../tiles/tile";

import { Piq } from "../enemies/piq";
import { Vroll } from "../enemies/vroll";
import { DungeonScene } from "scenes/dungeon.scene";
import * as Cellular from "cellular-dungeon";

// The responsibility of a Room should be to:
// - Place layout, enemies & items
// - Retrieve room state

export class Room {
  public readonly room: RoomInstance;
  public readonly groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  public readonly platformLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private enemyGroup: Phaser.GameObjects.Group;
  public tiles: Array<Array<Tile|Wall>>;
  public type: string = "default";
  private doorLookup: {[key: number]: Array<DoorInstance>} = {};
  private isSetup: boolean;

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

    this.room.doors.forEach(door => {
      this.doorLookup[door.linksTo] = this.doorLookup[door.linksTo] || [];
      this.doorLookup[door.linksTo].push(door);
    });
  }

  setup(): Room {
    console.log(this.type, this.width, this.height)
    if (!this.isSetup) {
      // Group doors up
      this.instantiateWalls();
      this.instantiatePlatforms();
      this.placeTiles();
      const collisionArray = Array.apply(null, { length: 22 }).map(Number.call, Number);
      this.groundLayer.setCollision(collisionArray, true);
      this.addEnemies();
      this.addPickups();
      this.addDoors();
      this.isSetup = true;
    }
    
    return this;
  }

  instantiateWalls(): void {
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

  addDoors(): void {
    let door;

    for(let key in this.doorLookup) {
      door = this.doorLookup[key][0];

      const worldX = this.scene.map.tileToWorldX(door.x);
      const worldY = this.scene.map.tileToWorldY(door.y);

      let DoorObject = this.scene.add.sprite((worldX+8), (worldY-8), "axan");
      
      this.scene.doorGroup.add(DoorObject);
      this.scene.physics.world.enable(DoorObject, Phaser.Physics.Arcade.STATIC_BODY);
      this.scene.physics.add.collider(DoorObject, this.scene.player);
      
      DoorObject.play("idle");
    }
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
    PickupClass.body.allowGravity = false;
    PickupClass.play(PickupClass.name === "smg" ? "ice" : "charge");
  }

  instantiatePlatforms() {
    const { tiles: tileMap, width: roomWidth, height: roomHeight } = this.room;
    const cellularMap = Cellular(this.room.width, this.room.height, { aliveThreshold: 4.1 });

    for (let y = 1; y < (roomHeight-1); y++) {
      for (let x = 1; x < (roomWidth-1); x++) {
        const cellularMapTile = cellularMap.grid[y][x];
        if (cellularMapTile) {
          this.tiles[y][x] = new Wall(x, y, this);
        }
      }
    }

    this.clearDoorways();
  }

  clearDoorways() {
    const { left: roomLeft, top: roomTop } = this.room;

    // loop through doors
    for (const linkID in this.doorLookup){
      const doorInstances = this.doorLookup[linkID];
      doorInstances.forEach(doorInstance => {
        let clear = false;
        const doorY = doorInstance.y - roomTop;
        const doorX = doorInstance.x - roomLeft;
        const doorTile: any = this.tiles[doorY][doorX];

        // what direction to head in
        const { xInc, yInc } = doorTile.clearDirection;
        let x = xInc;
        let y = yInc;

        // walk in a direction and check for blocking walls
        while (!clear) {
          const tileY = this.tiles[doorY+y] || [];
          const nextTile = tileY[doorX+x];
          
          if (!nextTile) {
            // if we hit the edge of the room, step back and place wall
            const lastY = (doorY+y)-yInc;
            const lastX = (doorX+x)-xInc;
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
    }
  }

  tileAt(x: number, y: number): Tile | Wall | null {
    if (!this.tiles[y] || y < 0 || y >= this.room.height || x < 0 || x >= this.room.width) {
      return null;
    }
    return this.tiles[y][x];
  }
}
