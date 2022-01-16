import Tile from "./tile";
import { Room } from "../rooms/";

export default class None extends Tile {
  constructor(x, y, room) {
    super(x, y, room);
    this.tileLabel = "None";
  }

  placeTile(): void {
    // TODO: noneIndex() for back tiles
    //       to determine inner corners
    this.tileIndex = -1;
    return super.placeTile();    
  }

  placeBackTile(): void {
    const worldX = this.x + this.room.x;
    const worldY = this.y + this.room.y;
    this.room.backLayer.putTileAt(this.tileIndex, worldX, worldY);
  }
}
