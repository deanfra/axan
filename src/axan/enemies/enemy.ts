import MainScene from 'axan/main.scene';

export class Enemy extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  body: Phaser.Physics.Arcade.Body;

  public health = 6;

  baseVel: number;
  vel: number;
  baseHealth = 6;
  damage = 0;
  isFirst = true;
  isFrozen = false;
  falling = false;
  killAt: number = 0;
  isDead = false;
  canDamage = true;
  animWalk: string;
  animMad: string;
  smoke: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: MainScene, x: number, y: number, public dir: number, key: string) {
    super(scene, x, y, key);
    this.scene.physics.world.enable(this);
  }

  firstUpdate(): void {
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

  hurt(amount: number = 0, fromRight: boolean, multiplier = 2, flip = false): void {
    this.canDamage = false;
    this.health -= amount;
    this.setTint(Phaser.Display.Color.GetColor(255, 0, 0));
    this.setScale(1, 1);
    if (flip) {
      this.flip();
    }
    if (this.health <= 0) {
      this.die(fromRight);
    } else {
      this.scene.tweens.add({
        targets: this,
        duration: 70,
        scaleY: .9,
        yoyo: true,
        onComplete: () => {
          // this.setTint(Phaser.Display.Color.GetColor(255, 255, 255));
          this.setScale(1, 1);
          this.canDamage = true;
        }
      });
    }
  }

  flip(): void {
    this.body.setVelocityX(-this.body.velocity.x);
  }

  freeze(): void {
    this.isFrozen = true;
    this.anims.stop();
    this.body.gravity.y = -600;
    this.body.setVelocityX(0);
    this.body.setVelocityY(0);
    this.setTint(Phaser.Display.Color.GetColor(0, 185, 255));
  }

  die(fromRight) {
    const scene = this.scene;
    this.isDead = true;
    this.body.allowGravity = false;
    scene.enemyGroup.remove(this);
    this.body.setVelocityX(0);
    this.body.setVelocityY(0);

    scene.killedEnemies.add(this);
    // this.body.setAngularVelocity(Phaser.Math.Between(100, 1000));
    scene.time.addEvent({
      delay: 300,
      callbackScope: this,
      callback: () => {
        // remove smoke emitter
        scene.killedEnemies.remove(this);
        scene.physics.world.disable(this);

        // extract to pickup class
        const healthPickup = scene.add.sprite(this.x, this.y, "misc-pickups");
        healthPickup.play("health-large");
        scene.physics.world.enable(healthPickup, Phaser.Physics.Arcade.STATIC_BODY);
        scene.physics.add.overlap(healthPickup, scene.player, () => {
          scene.inventory.heal(20);
          scene.healthText.setText(scene.inventory.health.toString());
          healthPickup.destroy();
        });

        scene.time.addEvent({
          delay: 5000,
          callbackScope: this,
          callback: () => {
            if (healthPickup) {
              healthPickup.destroy();
            }
          }
      });

        this.destroy();
      }
    });

  }

}
