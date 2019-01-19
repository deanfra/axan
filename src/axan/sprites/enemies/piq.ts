import { Enemy } from './enemy';

export class Piq extends Enemy {
  baseVel: number = 40;
  vel: number = 40;
  health = 6;
  isFirst = true;
  falling = false;
  killAt: number = 0;
  canDamage = true;
  isMad = false;
  animWalk: string = 'piq';

  constructor(scene, x, y, dir) {
    super(scene, x, y, dir, 'enemies');
  }

}
