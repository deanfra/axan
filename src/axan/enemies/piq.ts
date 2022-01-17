import { Enemy } from "./enemy";

export class Piq extends Enemy {
  baseVel: number = 40;
  vel: number = 40;
  health = 6;
  damage = 10;
  killAt: number = 0;
  animWalk: string = "piq";

  constructor(scene, x, y, dir) {
    super(scene, x, y, dir, "enemies");
  }

  firstUpdate(): void {
    this.anims.play(this.animWalk);
    this.vel = this.dir === 1 ? -this.baseVel : this.baseVel;
    this.body.setVelocityX(this.vel).setBounceY(0.2);
    this.isFirst = false;
    this.body.setSize(20, 20);
  }

  update(time: number, delta: number) {
    if (this.isFirst) {
      this.firstUpdate();
    }
    if (this.isDead || this.isFrozen) {
      return;
    }

    this.flipX = this.body.velocity.x < 0;

    if (this.body.velocity.x === 0) {
      this.vel = -this.vel;
      this.body.setVelocityX(this.vel);
    }

    this.falling = this.body.velocity.y > 50;
  }
}
