import Wall from "./wall";
import Tile from "./tile";
// import { Room } from "../rooms";

export default class BackTile extends Wall {
  placeBackTile(): void {
    const worldX = this.x + this.room.x;
    const worldY = this.y + this.room.y;
    this.tileIndex = this.wallIndex();
    this.room.backLayer.putTileAt(this.tileIndex, worldX, worldY);
  }

  getNeighbours(): { [dir: string]: Tile | null } {
    return {
      n: this.room.backTileAt(this.x, this.y - 1),
      s: this.room.backTileAt(this.x, this.y + 1),
      w: this.room.backTileAt(this.x - 1, this.y),
      e: this.room.backTileAt(this.x + 1, this.y),
      nw: this.room.backTileAt(this.x - 1, this.y - 1),
      ne: this.room.backTileAt(this.x + 1, this.y - 1),
      sw: this.room.backTileAt(this.x - 1, this.y + 1),
      se: this.room.backTileAt(this.x + 1, this.y + 1)
    };
  }

}
