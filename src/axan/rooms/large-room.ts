import { Room } from ".";
import Wall from "../tiles/wall";
import * as Cellular from "cellular-dungeon";

export class LargeRoom extends Room {
  constructor(room, scene) {
    super(room, scene);
    this.type = "large";
  }

  instantiatePlatforms() {
    const { width: roomWidth, height: roomHeight } = this.room;
    const cellularMap = Cellular(this.room.width, this.room.height, { aliveThreshold: 4.12 });

    for (let y = 1; y < roomHeight - 1; y++) {
      for (let x = 1; x < roomWidth - 1; x++) {
        const cellularMapTile = cellularMap.grid[y][x];
        if (cellularMapTile) {
          this.tiles[y][x] = new Wall(x, y, this);
        }
      }
    }
    this.clearDoorways();
  }
}
