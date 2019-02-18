import Tile from "./tile";

const TILES = {
  RIGHT: 1,
  LEFT: 2,
  CEILING: 3,
  FLOOR: 4,
  TL_INNER: 6,
  TR_INNER: 5,
  BR_INNER: 7,
  BL_INNER: 8,
  TL_OUTER: 9,
  TR_OUTER: 10,
  BL_OUTER: 11,
  BR_OUTER: 12,
  LEDGE_L: 13,
  LEDGE_M: 14,
  LEDGE_R: 15,
  ROCK: 16,
  POLE_UP: 17,
  POLE_DOWN: 18,
  POLE_M: 19,
  ENCLOSED: 24,
}

export default class Wall extends Tile {
  placeTile(): void {
    this.tileIndex = this.wallIndex();
    return super.placeTile();
  }
  
  placeBackTile(): void {
    this.tileIndex = this.wallIndex();
    return super.placeBackTile();
  }

  wallIndex() {
    let mappedIndex = null;
    const NESWmappings: Array<{map: Array<string|null>, i:number}> = [
      // Better to check only NESW?
      { map: ["None", "Wall|BackTile", "Wall|BackTile", "None"], i: TILES.TL_OUTER, },
      { map: ["None", "None", "Wall|BackTile", "Wall|BackTile"], i: TILES.TR_OUTER, },
      { map: ["Wall|BackTile", "Wall|BackTile", "None", "None"], i: TILES.BL_OUTER, },
      { map: ["Wall|BackTile", "None", "None", "Wall|BackTile"], i: TILES.BR_OUTER, },

      { map: ["None", "Wall|BackTile", "None", "None"], i: TILES.LEDGE_L, },
      { map: ["None", "Wall|BackTile", "None|Wall|BackTile", "Wall|BackTile"], i: TILES.LEDGE_M, },
      { map: ["None", "None", "None", "Wall|BackTile"], i: TILES.LEDGE_R, },
      { map: ["None", "None", "Wall|BackTile", "None"], i: TILES.POLE_UP, },
      { map: ["Wall|BackTile", "None", "None", "None"], i: TILES.POLE_DOWN, },
      { map: ["Wall|BackTile", "None", "Wall|BackTile", "None"], i: TILES.POLE_M, },
      { map: ["None", "None", "None", "None"], i: -1, },
      { map: ["Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|"], i: TILES.ENCLOSED, },
    ];
      
    const fullMappings: Array<{map: Array<string|null>, i:number}> = [
      // Better to check all N NE E SE S SW W?
      { map: ["None", "Wall|BackTile|Door|None", "Wall|BackTile|Door", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|Door", "Wall|BackTile|Door|None"], i: TILES.FLOOR, },
      { map: ["Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|Door", "Wall|BackTile|Door|None", "None", "Wall|BackTile|Door|None", "Wall|BackTile|Door", "Wall|BackTile|"], i: TILES.CEILING, },
      { map: ["Wall|BackTile|Door", "Wall|BackTile|Door|None", "None", "Wall|BackTile|Door|None", "Wall|BackTile|Door", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|"], i: TILES.LEFT, },
      { map: ["Wall|BackTile|Door", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|Door", "Wall|BackTile|Door|None", "None", "Wall|BackTile|Door|None"], i: TILES.RIGHT, },
      { map: ["Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|Door", "None", "Wall|BackTile|Door", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|"], i: TILES.TL_INNER, },
      { map: ["Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|Door", "None", "Wall|BackTile|Door", "Wall|BackTile|"], i: TILES.TR_INNER, },
      { map: ["Wall|BackTile|Door", "None", "Wall|BackTile|Door", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|"], i: TILES.BL_INNER, },
      { map: ["Wall|BackTile|Door", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|", "Wall|BackTile|Door", "None"], i: TILES.BR_INNER, },

      // { map: ["None", "Wall|Door", "Wall", "Wall|", "Wall", "Wall|Door", "None", "None|Wall|Door"], i: TILES.TL_OUTER, },
      // { map: ["None", "None|Wall|Door", "None", "Wall|None", "Wall", "Wall|Door", "Wall|", "Wall|Door"], i: TILES.TR_OUTER, },
    ];

    let fullMapping = null;
    let NESWmapping = null;
    
    fullMappings.forEach(({ map, i }) => {
      if(this.checkAllNeighbours(map)) {
        fullMapping = i;
      }
    });

    NESWmappings.forEach(({ map, i }) => {
      if(this.checkNESWNeighbours(map)) {
        NESWmapping = i;
      }
    });
    
    return fullMapping || NESWmapping || TILES.ENCLOSED; //TILES.ROCK;
  }
}
