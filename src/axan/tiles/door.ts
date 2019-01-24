import Tile from "./tile";
import { Room } from "../rooms/room";

export default class Door extends Tile {
  clearance: { axis: string, inc: number };

  constructor(x: number, y: number, room: Room) {
    super(x, y, room)
    this.clearance = this.determineClearance();
  }

  placeTile(): void {
    this.tileIndex = 23;
    return super.placeTile();
  }

  determineClearance(): { axis: string, inc: number } {
    return (this.x === 0) ? { axis: 'x', inc: 1 } :
           (this.x === this.room.width) ? { axis: 'x', inc: -1 } :
           (this.y === 0) ? { axis: 'y', inc: 1 } :
           { axis: 'y', inc: -1 }
  }
}
