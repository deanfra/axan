import * as _ from "lodash";
import Tile from "./tile";

export default class Wall extends Tile {
  mapping: { [key: string]: Array<number> };

  constructor(x, y, room) {
    super(x, y, room);
    this.mapping = room.scene.groundTileMapping;
    this.tileLabel = "Wall";
  }

  placeTile(): void {
    this.tileIndex = this.wallIndex();
    return super.placeTile();
  }

  wallIndex() {
    let mappedIndex = null;
    const NESWmappings: Array<{map: Array<string|null>, t:Array<number>}> = [
      // Better to check only NESW?
      { map: ["None", "Wall", "Wall", "None"], t: this.mapping.TL_OUTER, },
      { map: ["None", "None", "Wall", "Wall"], t: this.mapping.TR_OUTER, },
      { map: ["Wall", "Wall", "None", "None"], t: this.mapping.BL_OUTER, },
      { map: ["Wall", "None", "None", "Wall"], t: this.mapping.BR_OUTER, },

      { map: ["None", "Wall", "None", "None"], t: this.mapping.LEDGE_L, },
      { map: ["None", "Wall", "None|Wall", "Wall"], t: this.mapping.LEDGE_M, },
      { map: ["None", "None", "None", "Wall"], t: this.mapping.LEDGE_R, },
      { map: ["None", "None", "Wall", "None"], t: this.mapping.POLE_UP, },
      { map: ["Wall", "None", "None", "None"], t: this.mapping.POLE_DOWN, },
      { map: ["Wall", "None", "Wall", "None"], t: this.mapping.POLE_M, },
      { map: ["None", "None", "None", "None"], t: [-1], },
      { map: ["Wall|", "Wall|", "Wall|", "Wall|"], t: this.mapping.ENCLOSED, },
    ];
      
    const fullMappings: Array<{map: Array<string|null>, t:Array<number>}> = [
      // Better to check all N NE E SE S SW W?
      { map: ["None", "Wall|Door|None", "Wall|Door", "Wall|", "Wall|", "Wall|", "Wall|Door", "Wall|Door|None"], t: this.mapping.FLOOR, },
      { map: ["Wall|", "Wall|", "Wall|Door", "Wall|Door|None", "None", "Wall|Door|None", "Wall|Door", "Wall|"], t: this.mapping.CEILING, },
      { map: ["Wall|Door", "Wall|Door|None", "None", "Wall|Door|None", "Wall|Door", "Wall|", "Wall|", "Wall|"], t: this.mapping.LEFT, },
      { map: ["Wall|Door", "Wall|", "Wall|", "Wall|", "Wall|Door", "Wall|Door|None", "None", "Wall|Door|None"], t: this.mapping.RIGHT, },
      { map: ["Wall|", "Wall|", "Wall|Door", "None", "Wall|Door", "Wall|", "Wall|", "Wall|"], t: this.mapping.TL_INNER, },
      { map: ["Wall|", "Wall|", "Wall|", "Wall|", "Wall|Door", "None", "Wall|Door", "Wall|"], t: this.mapping.TR_INNER, },
      { map: ["Wall|Door", "None", "Wall|Door", "Wall|", "Wall|", "Wall|", "Wall|", "Wall|"], t: this.mapping.BL_INNER, },
      { map: ["Wall|Door", "Wall|", "Wall|", "Wall|", "Wall|", "Wall|", "Wall|Door", "None"], t: this.mapping.BR_INNER, },

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
    
    return fullMapping || NESWmapping || this.mapping.ENCLOSED; //TILES.ROCK;
  }
}
