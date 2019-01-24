import { Room, Corridor, TallRoom, SmallRoom, LargeRoom } from ".";
import { RoomInstance } from "../../interfaces/room-instance.js";

export default class RoomFactory {
  static createRoom(roomInstance: RoomInstance, scene): Room {
    const RoomType = this.determineType(roomInstance);
    const room = new RoomType(roomInstance, scene);
    return room;
  }
  
  static determineType(roomInstance: RoomInstance) {
    const { width, height } = roomInstance;

    if(width <= 15 && height > 20) {
      return TallRoom;
    } else if (width >= 18 && height <= 9) {
      return Corridor;
    } else if (width <= 14 && height <= 11) {
      return SmallRoom;
    } else if (width >= 20 && height >= 20) {
      return LargeRoom;
    } else {
      return Room;
    }
  }
}
