import { Enemy } from "./enemy";

export class Jumper extends Enemy {
  baseVel: number = 40;
  vel: number = 40;
  health = 10;
  damage = 10;
  killAt: number = 0;
  animIdle: string = "jumper-idle";
  animJump: string = "jumper-jump";
  isJumping: boolean = false;

  constructor(scene, x, y, dir) {
    super(scene, x, y, dir, "enemies");
  }

  jumpTimer(scene) {
    scene.time.addEvent({
      delay: 2000,
      callbackScope: this,
      callback: () => {
        this.jump(scene);
      },
    });
  }

  jump(scene) {
    if (this.isDead || this.isFrozen || this.isJumping) {
      return;
    }

    const playerX = scene.player.x;
    const velX = playerX > this.x ? 150 : -150;

    this.isJumping = true;
    this.anims.play(this.animJump);
    this.body.setVelocityY(-200);
    this.body.setVelocityX(velX);

    this.jumpTimer(scene);
  }

  stopJump() {
    if (this.isDead || this.isFrozen) {
      return;
    }
    this.body.setVelocityX(0);
    this.isJumping = false;
    this.anims.play(this.animIdle);
  }

  firstUpdate(): void {
    this.body.setSize(35, 24);
    this.body.setOffset(0, 0); // Bugs without it
    this.anims.play(this.animIdle);
    this.isFirst = false;
    this.jumpTimer(this.scene);
  }

  update(time: number, delta: number) {
    if (this.isFirst) {
      this.firstUpdate();
    }

    if (this.isJumping && this.body.onFloor()) {
      this.stopJump();
    }

    if (this.isDead || this.isFrozen) {
      return;
    }
  }
}
