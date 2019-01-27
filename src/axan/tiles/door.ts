import Tile from "./tile";
import { Room } from "../rooms/room";

export default class Door extends Tile {
  clearance: { xInc?: number, yInc?: number, dir?: string };

  constructor(x: number, y: number, room: Room) {
    super(x, y, room)
    this.clearance = this.determineClearance();
  }

  placeTile(): void {
    this.tileIndex = 23;
    return super.placeTile();
  }

  determineClearance(): { xInc: number, yInc: number, dir: string } {
    return (this.x === 0) ? { xInc: 1, yInc: 0, dir: "e" } :
           (this.x === (this.room.width-1)) ? { xInc: -1, yInc: 0, dir: "w" } :
           (this.y === 0) ? { xInc: 0, yInc: 1, dir: "s" } :
           { xInc: 0, yInc: -1, dir: "n" }
  }
}
