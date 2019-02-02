import { guns, Gun, DefaultGun } from '.';
import { Quantum } from './quantum';
import { Laser } from './laser';

const gunLib: {[key:string]: any} = {
  QUANTUM: Quantum,
  LASER: Laser
}

export class GunFactory {
  static defaultGun = DefaultGun;

  static createGun(gunName, scene, x, y): Gun {
    const GunClass = gunLib[gunName];
    return new GunClass(scene, x, y);
  }

  static createDefaultGun(scene, x, y): Gun {
    return this.createGun('LASER', scene, x, y);
  }

}
