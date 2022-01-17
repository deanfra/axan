import Tile from "./tile";
import { Room } from "../rooms/";

export default class Debug extends Tile {
  placeTile(): void {
    this.tileIndex = 16;
    return super.placeTile();
  }
}
