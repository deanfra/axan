import Tile from "./tile";

export default class Door extends Tile {
  placeTile(): void {
    this.tileIndex = 23;
    return super.placeTile();
  }
}
