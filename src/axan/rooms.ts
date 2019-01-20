import * as Dungeon from "@mikewesthad/dungeon";
import Room from "./room";
import RoomInstance from "../interfaces/room-instance.js";
import DungeonFactoryOutput from "../interfaces/dungeon-factory-output";
import { DungeonScene } from "scenes/dungeon.scene";

// TODO: Store room instances against this

export default class Rooms {
  public readonly dungeonInstance: DungeonFactoryOutput;
  public startRoom: Room;
  public readonly scene: any;
  public readonly width: number;
  public readonly height: number;
  public readonly groundLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  public readonly rooms: Array<Room>;

  constructor(scene: DungeonScene) {
    this.dungeonInstance = new Dungeon({
      width: 200,
      height: 100,
      randomSeed: undefined,
      chanceToLinkRooms: 100,
      doorSize: 3,
      doorPadding: 2,
      rooms: {
        width: { min: 10, max: 90 },
        height: { min: 7, max: 90 },
        maxArea: 400,
        maxRooms: 50
      }
    });
    
    this.scene = scene;
    this.rooms = [];
    this.groundLayer = scene.groundLayer;
  }
  
  instantiateRooms(): void {
    this.dungeonInstance.rooms.forEach((roomInstance: RoomInstance) => {
      const room = new Room(roomInstance, this.scene);
      this.rooms.push(room);
    });
    this.startRoom = this.rooms[0];
    this.startRoom.setup();
  }

  byId(id: number): Room {
    let i = this.rooms.length;
    while (i--) {
      if (this.rooms[i].id === id) {
        return this.rooms[i];
      }
    }
  }
  
}