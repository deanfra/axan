import { Beam } from "./beams";

export default class Inventory {
  activeBeam: string = "LASER";
  beams: string[] = ["LASER"];
  health: 100;

  addBeam(beam: Beam) {
    if(this.beams.indexOf(beam.id) === -1){
      this.beams.push(beam.id);
    }
  }
}