import Tile from "./tile";
import { Room } from "../rooms/room";

export default class Door extends Tile {
  clearDirection: { xInc: number, yInc: number };

  constructor(x: number, y: number, room: Room) {
    super(x, y, room)
    this.clearDirection = this.determineClearance();
  }

  placeTile(): void {
    this.tileIndex = 23;
    return super.placeTile();
  }

  determineClearance(): { xInc: number, yInc: number } {
    return (this.x === 0) ? { xInc: 1, yInc: 0 } :
           (this.x === (this.room.width-1)) ? { xInc: -1, yInc: 0 } :
           (this.y === 0) ? { xInc: 0, yInc: 1 } :
           { xInc: 0, yInc: -1 }
  }
}
