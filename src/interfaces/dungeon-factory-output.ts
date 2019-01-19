import RoomInstance from "./room-instance";

export default interface DungeonFactoryOutput {
  doorPadding: number;
  height: number;
  r: any;
  roomConfig: {};
  roomGrid: Array<Array<number>>;
  rooms: Array<RoomInstance>;
  tiles: Array<Array<number>>;
  width: number;
  addDoor(): void;
  addRoom(): void;
  canFitRoom(): boolean;
  createRandomRoom(): void;
  drawToConsole(): void;
  drawToHtml(): void;
  findNewDoorLocation(): any;
  findRoomAttachment(): any;
  generate(): any;
  generateRoom(): any;
  getMappedTiles(): any;
  getPotentiallyTouchingRooms(): any;
  getRoomAt(x, y): any;
  getTiles(): any;
}