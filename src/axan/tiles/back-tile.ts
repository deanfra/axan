import * as _ from "lodash";
import Tile from "./tile";

const TILES = {
  RIGHT: [1],
  LEFT: [2],
  CEILING: [3],
  FLOOR: [4],
  TL_INNER: [6],
  TR_INNER: [5],
  BR_INNER: [7],
  BL_INNER: [8],
  TL_OUTER: [9],
  TR_OUTER: [10],
  BL_OUTER: [11],
  BR_OUTER: [12],
  LEDGE_L: [13],
  LEDGE_M: [14],
  LEDGE_R: [15],
  ROCK: [16],
  POLE_UP: [17],
  POLE_DOWN: [18],
  POLE_M: [19],
  ENCLOSED: [24],
}
 
export default class BackTile extends Tile {
  constructor(x, y, room) {
    super(x, y, room);
    this.tileLabel = "BackTile";
  }

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
  wallIndex() {
    let mappedIndex = null;
    const NESWmappings: Array<{ map: Array<string | null>, t: Array<number> }> = [
      // Better to check only NESW?
      { map: ["None", "BackTile", "BackTile", "None"], t: TILES.TL_OUTER, },
      { map: ["None", "None", "BackTile", "BackTile"], t: TILES.TR_OUTER, },
      { map: ["BackTile", "BackTile", "None", "None"], t: TILES.BL_OUTER, },
      { map: ["BackTile", "None", "None", "BackTile"], t: TILES.BR_OUTER, },

      { map: ["None", "BackTile", "None", "None"], t: TILES.LEDGE_L, },
      { map: ["None", "BackTile", "None|BackTile", "BackTile"], t: TILES.LEDGE_M, },
      { map: ["None", "None", "None", "BackTile"], t: TILES.LEDGE_R, },
      { map: ["None", "None", "BackTile", "None"], t: TILES.POLE_UP, },
      { map: ["BackTile", "None", "None", "None"], t: TILES.POLE_DOWN, },
      { map: ["BackTile", "None", "BackTile", "None"], t: TILES.POLE_M, },
      { map: ["None", "None", "None", "None"], t: [-1], },
      { map: ["BackTile|", "BackTile|", "BackTile|", "BackTile|"], t: TILES.ENCLOSED, },
    ];

    const fullMappings: Array<{ map: Array<string | null>, t: Array<number> }> = [
      // Better to check all N NE E SE S SW W?
      { map: ["None", "BackTile|Door|None", "BackTile|Door", "BackTile|", "BackTile|", "BackTile|", "BackTile|Door", "BackTile|Door|None"], t: TILES.FLOOR, },
      { map: ["BackTile|", "BackTile|", "BackTile|Door", "BackTile|Door|None", "None", "BackTile|Door|None", "BackTile|Door", "BackTile|"], t: TILES.CEILING, },
      { map: ["BackTile|Door", "BackTile|Door|None", "None", "BackTile|Door|None", "BackTile|Door", "BackTile|", "BackTile|", "BackTile|"], t: TILES.LEFT, },
      { map: ["BackTile|Door", "BackTile|", "BackTile|", "BackTile|", "BackTile|Door", "BackTile|Door|None", "None", "BackTile|Door|None"], t: TILES.RIGHT, },
      { map: ["BackTile|", "BackTile|", "BackTile|Door", "None", "BackTile|Door", "BackTile|", "BackTile|", "BackTile|"], t: TILES.TL_INNER, },
      { map: ["BackTile|", "BackTile|", "BackTile|", "BackTile|", "BackTile|Door", "None", "BackTile|Door", "BackTile|"], t: TILES.TR_INNER, },
      { map: ["BackTile|Door", "None", "BackTile|Door", "BackTile|", "BackTile|", "BackTile|", "BackTile|", "BackTile|"], t: TILES.BL_INNER, },
      { map: ["BackTile|Door", "BackTile|", "BackTile|", "BackTile|", "BackTile|", "BackTile|", "BackTile|Door", "None"], t: TILES.BR_INNER, },

      // { map: ["None", "Door", "Wall", "", "Wall", "Door", "None", "None|Door"], t: TILES.TL_OUTER, },
      // { map: ["None", "None|Door", "None", "None", "Wall", "Door", "", "Door"], t: TILES.TR_OUTER, },
    ];

    let fullMapping = null;
    let NESWmapping = null;

    fullMappings.forEach(({ map, t }) => {
      if (this.checkAllNeighbours(map)) {
        fullMapping = t.length < 2 ? t[0] : _.sample(t);
      }
    });

    NESWmappings.forEach(({ map, t }) => {
      if (this.checkNESWNeighbours(map)) {
        fullMapping = t.length < 2 ? t[0] : _.sample(t);
      }
    });

    return fullMapping || NESWmapping || TILES.ENCLOSED; //TILES.ROCK;
  }
}
