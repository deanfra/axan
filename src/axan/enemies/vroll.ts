import { Enemy } from "./enemy";

export class Vroll extends Enemy {
  baseVel: number = 50;
  madVel: number = 70;
  vel: number = 50;
  baseAccel: number = 70;
  madAccel: number = 100;
  accel: number = 70;

  baseHealth = 6;
  health = 6;
  damage = 5;
  isMoving = false;
  animFly: string = "vroll";
  animAttack: string = "vroll-down";
  smoke: Phaser.GameObjects.Particles.ParticleEmitter;
  moveEvent: Phaser.Time.TimerEvent;

  constructor(scene, x, y, public dir) {
    super(scene, x, y, dir, "vroll-down");
  }

  firstUpdate(): void {
    this.anims.play(this.animFly);
    this.body.setBounce(1, 1.5).allowGravity = false;
    this.body.setSize(20, 20);
    this.isFirst = false;
  }

  update(time: number, delta: number) {
    if (this.isFirst) {
      this.firstUpdate();
    }

    if (this.isDead || this.isFrozen) {
      return;
    }

    if (!this.isMoving) {
      this.isMoving = true;

      let x = 200;
      let y = 240;

      const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
      const distanceToCeiling = Phaser.Math.Distance.Between(this.x, this.y, 120, 400) - 180;

      if (distanceToPlayer < distanceToCeiling && this.y < 170) {
        // go to player
        x = this.scene.player.x;
        y = this.scene.player.y - 16;
      } else {
        // go ceiling
        if (this.y > 80 && this.y < 160) {
          if (this.dir !== 1) {
            x = Phaser.Math.Between(40, 60);
          } else {
            x = Phaser.Math.Between(310, 350);
          }
        }
      }

      this.scene.physics.accelerateTo(this, x, y, this.accel, this.vel, this.vel);
      this.moveEvent = this.scene.time.addEvent({
        delay: Phaser.Math.Between(500, 2000),
        callbackScope: this,
        callback: () => {
          if (this.isDead || this.isFrozen) {
            return;
          }

          this.anims.play(this.animAttack);
          this.body.setAcceleration(10, 10).setVelocity(this.body.velocity.x, 5);
          this.scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 3000),
            callbackScope: this,
            callback: (p) => {
              if (this.isDead || this.isFrozen) {
                return;
              }
              this.anims.play(this.animFly);
              this.isMoving = false;
            },
          });
        },
      });
    }
  }
}
