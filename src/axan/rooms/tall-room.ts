import { Room } from "./room";
import Tile from "../tiles/tile";
import Wall from "../tiles/wall";
import None from "../tiles/none";

export class TallRoom extends Room {
  constructor(room, scene) {
    super(room, scene);
    this.type = "tall";
  }

  instantiatePlatforms() {
    const { width: roomWidth, height: roomHeight } = this.room;
    const chanceOf = (percent: number): boolean => Math.floor(Math.random() * 10) > ((100 - percent) / 10)
    let curPlatformY = -2;
    let platformWidth = 0;

    for (let y = 1; y < (roomHeight - 1); y++) {
      platformWidth = 0;

      // decide whether or not to place a platform
      if ((curPlatformY < y - 2) && chanceOf(75)) {
        curPlatformY = y;
      }

      for (let x = 1; x < (roomWidth - 1); x++) {
        // chance to place a random platform
        if (curPlatformY === y && platformWidth < 1 && chanceOf(30)) {
          this.tiles[y][x] = new Wall(x, y, this);
          platformWidth++;
        } else {
          // chance to extend tiles into platforms
          if (this.tiles[y][x - 1].constructor.name === 'Wall' && platformWidth > 0 && platformWidth <= 4 && curPlatformY === y) {
            this.tiles[y][x] = new Wall(x, y, this);
            platformWidth++;
          }
        }
      }
    }
  }
}