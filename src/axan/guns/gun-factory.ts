import { guns, Gun, DefaultGun } from '.';
import { Quantum } from './quantum';
import { Laser } from './laser';

const gunLib: {[key:string]: any} = {
  QUANTUM: Quantum,
  LASER: Laser
}

export class GunFactory {
  static roll = 0;
  static defaultGun = DefaultGun;

  static createGun(gunName, scene, x, y): Gun {
    const GunClass = gunLib[gunName];
    return new GunClass(scene, x, y);
  }

  static createDefaultGun(scene, x, y): Gun {
    return this.createGun('LASER', scene, x, y);
  }

  static getRandomGun(): typeof Gun {
    const roll = Phaser.Math.Between(0, guns.length - 1);
    if (roll !== this.roll) {
      this.roll = roll;
      return guns[roll];
    } else {
      return this.getRandomGun();
    }
  }

  static getNextGun(scene, x, y, currentGun: Gun): Gun {
    let nextIndex: number;
    const currentIndex = guns.findIndex(gun => gun.id === currentGun.id);
    nextIndex = currentIndex + 1;
    if (currentIndex >= guns.length - 1) {
      nextIndex = 0;
    }
    return this.createGun(scene, x, y, guns[nextIndex]);
  }

}
