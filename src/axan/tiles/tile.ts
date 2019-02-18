import { Room } from "../rooms/";
import Wall from "./wall";

export enum TileType {
  None,
  Wall,
  Door
}

export default class Tile {
  public readonly collides: boolean;
  public readonly type: TileType;
  public readonly room: Room;
  public readonly x: number;
  public readonly y: number;
  public tileIndex: number;
  private neighbours: { [dir: string]: Tile | null}

  constructor(x: number, y: number, room: Room) {
    // this.collides = type !== TileType.None;
    this.room = room;
    this.x = x;
    this.y = y;
  }

  placeTile(): void {
    const worldX = this.x + this.room.x;
    const worldY = this.y + this.room.y;
    this.room.groundLayer.putTileAt(this.tileIndex, worldX, worldY);
  }

  placeBackTile(): void {
    const worldX = this.x + this.room.x;
    const worldY = this.y + this.room.y;
    this.room.backLayer.putTileAt(this.tileIndex, worldX, worldY);
  }

  getNeighbours(): { [dir: string]: Tile | null } {
    return {
      n: this.room.tileAt(this.x, this.y - 1),
      s: this.room.tileAt(this.x, this.y + 1),
      w: this.room.tileAt(this.x - 1, this.y),
      e: this.room.tileAt(this.x + 1, this.y),
      nw: this.room.tileAt(this.x - 1, this.y - 1),
      ne: this.room.tileAt(this.x + 1, this.y - 1),
      sw: this.room.tileAt(this.x - 1, this.y + 1),
      se: this.room.tileAt(this.x + 1, this.y + 1)
    };
  }

  getNeighboursTypes(): Array<string> {
    const neighbours = this.getNeighbours();

    const n = (neighbours.n) ? neighbours.n.constructor.name : "";
    const s = (neighbours.s) ? neighbours.s.constructor.name : "";
    const w = (neighbours.w) ? neighbours.w.constructor.name : "";
    const e = (neighbours.e) ? neighbours.e.constructor.name : "";
    const nw = (neighbours.nw) ? neighbours.nw.constructor.name : "";
    const ne = (neighbours.ne) ? neighbours.ne.constructor.name : "";
    const sw = (neighbours.sw) ? neighbours.sw.constructor.name : "";
    const se = (neighbours.se) ? neighbours.se.constructor.name : "";

    return [n, ne, e, se, s, sw, w, nw];
  }

  getNESWNeighboursTypes(): Array<string> {
    const neighbours = this.getNeighbours();

    const n = (neighbours.n) ? neighbours.n.constructor.name : "";
    const s = (neighbours.s) ? neighbours.s.constructor.name : "";
    const w = (neighbours.w) ? neighbours.w.constructor.name : "";
    const e = (neighbours.e) ? neighbours.e.constructor.name : "";

    return [n, e, s, w];
  }

  // Pass in an array of tile types to check if the neighbours match
  checkAllNeighbours(checkNeighbours: Array<string|null>) {
    this.neighbours = this.neighbours || this.getNeighbours();
    const actualNeighbours = this.getNeighboursTypes();

    return checkNeighbours.every((tileName, i) => {
      // Basically stringifies nulls so we can call split
      let actualTile = actualNeighbours[i];
      if (tileName === null) { tileName = "" }
      // Split factors in a tile being multiple types
      return tileName.split("|").indexOf(actualTile) >= 0
    })
  }

  checkNESWNeighbours(checkNeighbours: Array<string|null>) {
    this.neighbours = this.neighbours || this.getNeighbours();
    const actualNeighbours = this.getNESWNeighboursTypes();

    return checkNeighbours.every((tileName, i) => {
      let actualTile = actualNeighbours[i];
      if (tileName === null) { tileName = "" }
      return tileName.split("|").indexOf(actualTile) >= 0
    })
  }
}
