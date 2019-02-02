import { Enemy } from './enemy';

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
  // isFirst = true;
  canDamage = true;
  isMoving = false;
  animWalk: string = 'vroll';
  animMad: string = 'vroll-down';

  smoke: Phaser.GameObjects.Particles.ParticleEmitter;

  // goingToPit = false;
  moveEvent: Phaser.Time.TimerEvent;

  constructor(scene, x, y, public dir) {
    super(scene, x, y, dir, 'vroll-down');
  }

  firstUpdate(): void {
    this.anims.play(this.animWalk);
    this.body.setBounce(1, 1.5).setSize(16, 12).allowGravity = false;
    this.isFirst = false;
  }

  update(time: number, delta: number) {
    if (this.isFirst) {
      this.firstUpdate();
    }

    if (this.isDead) {
      return;
    }

    if (!this.isMoving) {
      this.isMoving = true;

      let x = 200;
      let y = 240;
      const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
      // distance to room ceiling
      const distanceToCiel = Phaser.Math.Distance.Between(this.x, this.y, 120, 400) - 180;

      if (distanceToPlayer < distanceToCiel && this.y < 170) {
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
          if (this.anims) {
            this.anims.play(this.animMad);
            this.body.setAcceleration(10, 10).setVelocity(this.body.velocity.x, 5);
            this.scene.time.addEvent({
              delay: Phaser.Math.Between(2000, 3000),
              callbackScope: this,
              callback: (p) => {
                this.anims.play(this.animWalk);
                this.isMoving = false;
              },
            });
          }
        }
      });

    }

  }

}
