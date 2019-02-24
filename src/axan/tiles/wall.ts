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

export default class Wall extends Tile {
  placeTile(): void {
    this.tileIndex = this.wallIndex();
    return super.placeTile();
  }

  wallIndex() {
    let mappedIndex = null;
    const NESWmappings: Array<{map: Array<string|null>, t:Array<number>}> = [
      // Better to check only NESW?
      { map: ["None", "Wall|BackTile", "Wall|BackTile", "None"], t: TILES.TL_OUTER, },
      { map: ["None", "None", "Wall|BackTile", "Wall|BackTile"], t: TILES.TR_OUTER, },
      { map: ["Wall|BackTile", "Wall|BackTile", "None", "None"], t: TILES.BL_OUTER, },
      { map: ["Wall|BackTile", "None", "None", "Wall|BackTile"], t: TILES.BR_OUTER, },

      { map: ["None", "Wall|BackTile", "None", "None"], t: TILES.LEDGE_L, },
      { map: ["None", "Wall|BackTile", "None|Wall|BackTile", "Wall|BackTile"], t: TILES.LEDGE_M, },
      { map: ["None", "None", "None", "Wall|BackTile"], t: TILES.LEDGE_R, },
      { map: ["None", "None", "Wall|BackTile", "None"], t: TILES.POLE_UP, },
      { map: ["Wall|BackTile", "None", "None", "None"], t: TILES.POLE_DOWN, },
      { map: ["Wall|BackTile", "None", "Wall|BackTile", "None"], t: TILES.POLE_M, },
      { map: ["None", "None", "None", "None"], t: [-1], },
      { map: ["Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|"], t: TILES.ENCLOSED, },
    ];
      
    const fullMappings: Array<{map: Array<string|null>, t:Array<number>}> = [
      // Better to check all N NE E SE S SW W?
      { map: ["None", "Wall|BackTile|Door|None", "Wall|BackTile|Door", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|Door", "Wall|BackTile|Door|None"], t: TILES.FLOOR, },
      { map: ["Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|Door", "Wall|BackTile|Door|None", "None", "Wall|BackTile|Door|None", "Wall|BackTile|Door", "Wall|BackTile|"], t: TILES.CEILING, },
      { map: ["Wall|BackTile|Door", "Wall|BackTile|Door|None", "None", "Wall|BackTile|Door|None", "Wall|BackTile|Door", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|"], t: TILES.LEFT, },
      { map: ["Wall|BackTile|Door", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|Door", "Wall|BackTile|Door|None", "None", "Wall|BackTile|Door|None"], t: TILES.RIGHT, },
      { map: ["Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|Door", "None", "Wall|BackTile|Door", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|"], t: TILES.TL_INNER, },
      { map: ["Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|Door", "None", "Wall|BackTile|Door", "Wall|BackTile|"], t: TILES.TR_INNER, },
      { map: ["Wall|BackTile|Door", "None", "Wall|BackTile|Door", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|"], t: TILES.BL_INNER, },
      { map: ["Wall|BackTile|Door", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|Door", "None"], t: TILES.BR_INNER, },

      // { map: ["None", "Wall|Door", "Wall", "Wall|", "Wall", "Wall|Door", "None", "None|Wall|Door"], t: TILES.TL_OUTER, },
      // { map: ["None", "None|Wall|Door", "None", "Wall|None", "Wall", "Wall|Door", "Wall|", "Wall|Door"], t: TILES.TR_OUTER, },
    ];

    let fullMapping = null;
    let NESWmapping = null;
    
    fullMappings.forEach(({ map, t }) => {
      if(this.checkAllNeighbours(map)) {
        fullMapping = t.length < 2 ? t[0] : _.sample(t);
      }
    });

    NESWmappings.forEach(({ map, t }) => {
      if(this.checkNESWNeighbours(map)) {
        fullMapping = t.length < 2 ? t[0] : _.sample(t);
      }
    });
    
    return fullMapping || NESWmapping || TILES.ENCLOSED; //TILES.ROCK;
  }
}
