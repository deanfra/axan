import Room from "../rooms/room";
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

  // Pass in an array of tile types to check if the neighbours match
  checkAllNeighbours(checkNeighbours: Array<string|null>) {
    this.neighbours = this.neighbours || this.getNeighbours();

    const n =  (this.neighbours.n)  ? this.neighbours.n.constructor.name: "";
    const s =  (this.neighbours.s)  ? this.neighbours.s.constructor.name: "";
    const w =  (this.neighbours.w)  ? this.neighbours.w.constructor.name: "";
    const e =  (this.neighbours.e)  ? this.neighbours.e.constructor.name: "";
    const nw = (this.neighbours.nw) ? this.neighbours.nw.constructor.name: "";
    const ne = (this.neighbours.ne) ? this.neighbours.ne.constructor.name: "";
    const sw = (this.neighbours.sw) ? this.neighbours.sw.constructor.name: "";
    const se = (this.neighbours.se) ? this.neighbours.se.constructor.name : "";

    const actualNeighbours = [n, ne, e, se, s, sw, w, nw];

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

    const n =  (this.neighbours.n)  ? this.neighbours.n.constructor.name: "";
    const s =  (this.neighbours.s)  ? this.neighbours.s.constructor.name: "";
    const w =  (this.neighbours.w)  ? this.neighbours.w.constructor.name: "";
    const e =  (this.neighbours.e)  ? this.neighbours.e.constructor.name: "";

    const actualNeighbours = [n, e, s, w];

    return checkNeighbours.every((tileName, i) => {
      let actualTile = actualNeighbours[i];
      if (tileName === null) { tileName = "" }
      return tileName.split("|").indexOf(actualTile) >= 0
    })
  }
}
