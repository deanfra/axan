import { Enemy } from './enemy';

export class Piq extends Enemy {

  // BUG: enemy 'patrols' doors on the floor

  baseVel: number = 40;
  vel: number = 40;
  health = 6;
  damage = 10;
  killAt: number = 0;
  animWalk: string = 'piq';

  constructor(scene, x, y, dir) {
    super(scene, x, y, dir, 'enemies');
  }

}
