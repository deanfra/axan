import Tile from "./tile";
import Wall from "../tiles/wall";
import None from "../tiles/none";
import { Room } from "../rooms/room";

export default class Door extends Tile {
  clearance?: { xInc?: number, yInc?: number, dir?: string };

  constructor(x: number, y: number, room: Room) {
    super(x, y, room)
    this.clearance = this.determineClearance();
  }

  placeTile(): void {
    this.tileIndex = 23;
    return super.placeTile();
  }

  // Calculate which way the door is facing
  determineClearance?(): { xInc: number, yInc: number, dir: string } {
    return (this.x === 0) ? { xInc: 1, yInc: 0, dir: "e" } :
           (this.x === (this.room.width-1)) ? { xInc: -1, yInc: 0, dir: "w" } :
           (this.y === 0) ? { xInc: 0, yInc: 1, dir: "s" } :
           { xInc: 0, yInc: -1, dir: "n" }
  }

  clearDoorway(room) {
    const doorTile: Door = room.tiles[this.y][this.x];

    // what direction to head in
    const { xInc, yInc } = doorTile.clearance;
    let [x, y] = [xInc, yInc];

    // walk in a direction and check for blocking walls
    let clear = false;
    while (!clear) {
      const tileY = room.tiles[this.y + y] || [];
      const nextTile = tileY[this.x + x];

      if (!nextTile) {
        // if we hit the edge of the room, step back and place wall
        const lastY = (this.y + y) - yInc;
        const lastX = (this.x + x) - xInc;
        room.tiles[lastY][lastX] = new Wall(lastX, lastY, room);
        clear = true;
      } else if (nextTile.constructor.name === "Wall") {
        room.tiles[nextTile.y][nextTile.x] = new None(nextTile.x, nextTile.y, room);
        x += xInc;
        y += yInc;
      } else {
        clear = true;
      }
    }
  }
}
