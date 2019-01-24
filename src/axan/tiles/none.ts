import Tile from "./tile";
import { Room } from "../rooms/";

export default class None extends Tile {
  placeTile(): void {
    this.tileIndex = -1;
    return super.placeTile();    
  }
}