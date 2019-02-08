import { Beam } from '.';
import { Quantum } from "./quantum";
import { Laser } from "./laser";
import { Rang } from "./rang";
import { Ice } from "./ice";
import { Fire } from "./fire";

const beamLib: {[key:string]: any} = {
  QUANTUM: Quantum,
  LASER: Laser,
  RANG: Rang,
  ICE: Ice,
  FIRE: Fire
}

export class BeamFactory {
  static createBeam(beamName, scene, x, y): Beam {
    const BeamClass = beamLib[beamName];
    return new BeamClass(scene, x, y);
  }
}
