import { Enemy } from "./enemy";
import { Room } from "../rooms/room";

export class Gnid extends Enemy {
  baseVel: number = 50;
  vel: number = 50;
  health = 1;
  damage = 20;
  killAt: number = 0;
  animWalk: string = "gnid";
  wasOnFloor: boolean;

  constructor(scene, x, y, dir) {
    super(scene, x, y, dir, "enemies");
  }

  firstUpdate(): void {
    this.body.setSize(8, 8);
    this.anims.play(this.animWalk);
    // this.vel = this.dir === 1 ? -this.baseVel : this.baseVel;
    // this.body.allowGravity = false;
    this.isFirst = false;

    this.body.setVelocityY(50);
    this.wasOnFloor = this.body.onFloor();
  }

  update(time: number, delta: number) {
    if (this.isFirst) {
      this.firstUpdate();
    }
    if (this.isDead || this.isFrozen) {
      return;
    }

    const { left, right } = this.body.blocked;

    if (!this.body.onFloor() && this.wasOnFloor) {
      this.vel = -this.vel;
      const xBack = this.vel < 0 ? 1 : -1;
      this.y -= 1;
      this.x -= xBack;
      this.body.setVelocityX(this.vel);
    } else if (this.body.onFloor() && !this.wasOnFloor) {
      this.body.setVelocityY(50);
    } else if (left) {
      this.vel = -this.vel;
    } else if (right) {
      this.vel = -this.vel;
    } else if (this.body.onFloor()) {
      this.body.setVelocityX(this.vel);
    }

    this.wasOnFloor = this.body.onFloor();
  }
}
