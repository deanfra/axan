import { beams, Beam, DefaultBeam } from '.';
import { Quantum } from './quantum';
import { Laser } from './laser';

const beamLib: {[key:string]: any} = {
  QUANTUM: Quantum,
  LASER: Laser
}

export class BeamFactory {
  static defaultBeam = DefaultBeam;

  static createBeam(beamName, scene, x, y): Beam {
    const BeamClass = beamLib[beamName];
    return new BeamClass(scene, x, y);
  }

  static createDefaultBeam(scene, x, y): Beam {
    return this.createBeam('LASER', scene, x, y);
  }

}
