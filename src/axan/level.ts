import * as Dungeon from "@mikewesthad/dungeon";
import { Room } from "./rooms/.";
import RoomFactory from "./rooms/room-factory";
import { RoomInstance } from "../interfaces/room-instance.js";
import DungeonFactoryOutput from "../interfaces/dungeon-factory-output";
import MainScene from "axan/main.scene";

// The resposibility of the Level object should be to
// - Contain all room instances
// - Determine Room type/properties
// - Manage room state
// - Destroy and recreate

export default class Level {
  public readonly dungeonInstance: DungeonFactoryOutput;
  public startRoom: Room;
  public readonly scene: any;
  public readonly width: number;
  public readonly height: number;
  public readonly rooms: Array<Room>;

  constructor(scene: MainScene) {
    this.dungeonInstance = new Dungeon({
      width: 200,
      height: 100,
      randomSeed: 1111,
      chanceToLinkRooms: 100,
      doorSize: 3,
      doorPadding: 2,
      rooms: {
        width: { min: 10, max: 90 },
        height: { min: 7, max: 90 },
        maxArea: 400,
        maxRooms: 50,
      },
    });

    this.scene = scene;
    this.rooms = [];
  }

  instantiateRooms(): void {
    this.dungeonInstance.rooms.forEach((roomInstance: RoomInstance) => {
      const room = RoomFactory.createRoom(roomInstance, this.scene);
      this.rooms.push(room);
    });
    this.startRoom = this.rooms[0];
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
