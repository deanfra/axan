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

  wallIndex() {
    let mappedIndex = null;
    const NESWmappings: Array<{map: Array<string|null>, i:number}> = [
      // Better to check only NESW?
      { map: ["None", "Wall", "Wall", "None"], i: TILES.TL_OUTER, },
      { map: ["None", "None", "Wall", "Wall"], i: TILES.TR_OUTER, },
      { map: ["Wall", "Wall", "None", "None"], i: TILES.BL_OUTER, },
      { map: ["Wall", "None", "None", "Wall"], i: TILES.BR_OUTER, },

      { map: ["None", "Wall", "None", "None"], i: TILES.LEDGE_L, },
      { map: ["None", "Wall", "None|Wall", "Wall"], i: TILES.LEDGE_M, },
      { map: ["None", "None", "None", "Wall"], i: TILES.LEDGE_R, },
      { map: ["None", "None", "Wall", "None"], i: TILES.POLE_UP, },
      { map: ["Wall", "None", "None", "None"], i: TILES.POLE_DOWN, },
      { map: ["Wall", "None", "Wall", "None"], i: TILES.POLE_M, },
      { map: ["None", "None", "None", "None"], i: -1, },
      { map: ["Wall|", "Wall|", "Wall|", "Wall|"], i: TILES.ENCLOSED, },
    ];
      
    const fullMappings: Array<{map: Array<string|null>, i:number}> = [
      // Better to check all N NE E SE S SW W?
      { map: ["None", "Wall|Door|None", "Wall|Door", "Wall|", "Wall|", "Wall|", "Wall|Door", "Wall|Door|None"], i: TILES.FLOOR, },
      { map: ["Wall|", "Wall|", "Wall|Door", "Wall|Door|None", "None", "Wall|Door|None", "Wall|Door", "Wall|"], i: TILES.CEILING, },
      { map: ["Wall|Door", "Wall|Door|None", "None", "Wall|Door|None", "Wall|Door", "Wall|", "Wall|", "Wall|"], i: TILES.LEFT, },
      { map: ["Wall|Door", "Wall|", "Wall|", "Wall|", "Wall|Door", "Wall|Door|None", "None", "Wall|Door|None"], i: TILES.RIGHT, },
      { map: ["Wall|", "Wall|", "Wall|Door", "None", "Wall|Door", "Wall|", "Wall|", "Wall|"], i: TILES.TL_INNER, },
      { map: ["Wall|", "Wall|", "Wall|", "Wall|", "Wall|Door", "None", "Wall|Door", "Wall|"], i: TILES.TR_INNER, },
      { map: ["Wall|Door", "None", "Wall|Door", "Wall|", "Wall|", "Wall|", "Wall|", "Wall|"], i: TILES.BL_INNER, },
      { map: ["Wall|Door", "Wall|", "Wall|", "Wall|", "Wall|", "Wall|", "Wall|Door", "None"], i: TILES.BR_INNER, },

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
