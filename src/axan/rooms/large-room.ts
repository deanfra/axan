import { Room } from ".";
import Wall from "../tiles/wall";
import Cellular from "cellular-dungeon";

export class LargeRoom extends Room {
  constructor(room, scene) {
    super(room, scene);
    this.type = "large";
  }

  instantiatePlatforms() {
    const cellularMap = Cellular(this.room.width, this.room.height, { aliveThreshold: 4.7 });
    cellularMap.grid.forEach((tiles, y) => {
      tiles.map((place, x) => {
        if (place) {
          this.tiles[y][x] = new Wall(x, y, this);
        }
      });
    });
  }

}