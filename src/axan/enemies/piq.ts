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

  firstUpdate(): void {
    this.anims.play(this.animWalk);
    this.vel = this.dir === 1 ? -this.baseVel : this.baseVel;
    this.body.setVelocityX(this.vel).setBounceY(0.2);
    this.isFirst = false;
    this.body.setSize(20, 20);
  }

}
