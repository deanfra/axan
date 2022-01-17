import { Enemy } from "./enemy";
import { Room } from "../rooms/room";

export class GnidPatrol extends Enemy {
  baseVel: number = 90;
  vel: number = 90;
  health = 1;
  damage = 20;
  killAt: number = 0;
  animWalk: string = "gnid";
  wasOnDoor: boolean;
  wasOnFloor: boolean;
  wasOnCeiling: boolean;
  wasBlocked: { [key: string]: boolean };

  constructor(scene, x, y, dir) {
    super(scene, x, y, dir, "enemies");
    this.name = "GnidPatrol";
  }

  touchedDoor() {
    this.wasOnDoor = true;
  }

  firstUpdate(): void {
    this.body.setSize(8, 8);
    this.anims.play(this.animWalk);
    this.isFirst = false;

    this.body.setGravity(0, -600);

    this.wasOnDoor = false;
    this.wasOnFloor = this.body.onFloor();
    this.wasOnCeiling = this.body.onCeiling();
    this.wasBlocked = this.body.blocked;

    this.goDown();
  }

  update(time: number, delta: number) {
    if (this.isFirst) {
      this.firstUpdate();
    }
    if (this.isDead || this.isFrozen) {
      return;
    }

    const { left, right } = this.body.blocked;
    const { left: wasLeft, right: wasRight } = this.wasBlocked;

    const onSomething = this.body.onFloor() || this.body.onCeiling() || left || right;
    const wasOnSomething = this.wasOnFloor || this.wasOnCeiling || wasLeft || wasRight;

    if (left) {
      if (this.body.onFloor()) {
        this.goDownRight();
      } else {
        this.goDownLeft();
      }
    } else if (right) {
      if (this.body.onCeiling()) {
        this.goUpLeft();
      } else {
        this.goUpRight();
      }
    } else if (this.body.onFloor()) {
      this.goDownRight();
    } else if (this.body.onCeiling()) {
      this.goUpLeft();
    } else if (this.wasOnFloor && !onSomething) {
      this.goDownLeft();
    } else if (this.wasOnCeiling && !onSomething) {
      this.goUpRight();
    } else if (wasRight && !onSomething) {
      this.goDownRight();
    } else if (wasLeft && !onSomething) {
      this.goUpLeft();
    } else if (!onSomething && this.wasOnDoor) {
      this.wasOnDoor = false;
      if (wasLeft) {
        this.x -= 1;
        this.goDown();
        this.stopX();
      } else if (wasRight) {
        this.x += 1;
        this.goUp();
        this.stopX();
      } else if (this.wasOnFloor) {
        this.goRight();
        this.stopY();
      } else if (this.wasOnCeiling) {
        this.goLeft();
        this.stopY();
      }
    }

    // Falling
    /*if (!onSomething && !wasOnSomething) {
      console.log("mid air");
      this.goDown();
      this.stopX();
    } else if (!this.body.onFloor() && this.wasOnFloor && (!left && !right)) {
      console.log("was on floor - no left or right");
      this.goDown();
      this.stopX();
    } else if (this.body.onFloor() && right) {
      console.log("on floor + right");
      this.goUpRight();
    } else if (this.body.onCeiling() && right) {
      console.log("on onCeiling + right");
      this.goUpLeft();
    } else if (this.body.onCeiling() && left) {
      console.log("on onCeiling + left");
      this.goDownLeft();
    } else if (this.body.onFloor() && left) {
      console.log("on floor + right");
      this.goDownRight();
    } else if (this.body.onCeiling() && (!left && !right)) {
      console.log("on onCeiling + !left + !right");
      this.goUpLeft();
    } else if (this.body.onFloor() && (!left && !right)) {
      console.log("on floor + !left + !right");
      this.goDownRight();
    // } else if (left) {
    //   this.vel = -this.vel;
    // } else if (right) {
    //   this.vel = -this.vel;
    }*/

    this.wasOnFloor = this.body.onFloor();
    this.wasOnCeiling = this.body.onCeiling();
    this.wasBlocked = Object.assign({}, this.body.blocked);
  }

  goDown() {
    this.body.setVelocityY(this.vel);
  }

  goUp() {
    this.body.setVelocityY(-this.vel);
  }

  goRight() {
    this.body.setVelocityX(this.vel);
  }

  goLeft() {
    this.body.setVelocityX(-this.vel);
  }

  stopX() {
    this.body.setVelocityX(0);
  }

  stopY() {
    this.body.setVelocityY(0);
  }

  goUpLeft() {
    this.goLeft();
    this.goUp();
  }

  goDownLeft() {
    this.goLeft();
    this.goDown();
  }

  goUpRight() {
    this.goRight();
    this.goUp();
  }

  goDownRight() {
    this.goRight();
    this.goDown();
  }
}
