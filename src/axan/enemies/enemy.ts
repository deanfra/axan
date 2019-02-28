import MainScene from 'axan/main.scene';

export class Enemy extends Phaser.GameObjects.Sprite {
  public scene: MainScene;
  public body: Phaser.Physics.Arcade.Body;

  public health = 6;
  public baseVel: number;
  public vel: number;
  public baseHealth = 6;
  public damage = 0;
  public isFirst = true;
  public isFrozen = false;
  public falling = false;
  public killAt: number = 0;
  public depth: number = 3;
  public isDead = false;
  public canDamage = true;
  public animWalk: string;
  public frozenMask: Phaser.GameObjects.Sprite;
  public deathBang: Phaser.GameObjects.Sprite;

  constructor(scene: MainScene, x: number, y: number, public dir: number, key: string) {
    super(scene, x, y, key);
    this.scene.physics.world.enable(this);
  }

  hurt(amount: number = 0, multiplier = 2, flip = false): void {
    this.canDamage = false;
    this.health -= amount;
    this.setTint(Phaser.Display.Color.GetColor(255, 0, 0));
    this.setScale(1, 1);
    if (flip) {
      this.flip();
    }
    if (this.health <= 0) {
      this.die();
    } else {
      this.scene.tweens.add({
        targets: this,
        duration: 70,
        scaleY: .9,
        yoyo: true,
        onComplete: () => {
          if (!this.isFrozen) {
            this.setTint(Phaser.Display.Color.GetColor(255, 255, 255));
          }
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
    if (this.isFrozen || this.isDead) { return }

    this.anims.stop();
    this.body.gravity.y = -600;
    this.body.setAcceleration(0, 0);
    this.body.setVelocityX(0);
    this.body.setVelocityY(0);
    this.setFrozenMask();
    this.isFrozen = true;

    this.setTint(Phaser.Display.Color.GetColor(0, 185, 255));

    this.scene.time.addEvent({
      delay: 6000,
      callbackScope: this,
      callback: () => { this.unfreeze(); }
    });
  }

  unfreeze(): void {
    if (!this.isFrozen || this.isDead) { return }

    this.isFrozen = false;
    this.removeFrozenMask();
    this.body.gravity.y = 0;
    this.isFirst = true;
    this.setTint(Phaser.Display.Color.GetColor(255, 255, 255));
  }

  setFrozenMask() {
    if (this.isFrozen) { return }

    this.frozenMask = this.scene.add.sprite(this.x-4, this.y-4, 'beams', 1);
    this.frozenMask.depth = 3;
    this.scene.physics.world.enable(this.frozenMask, Phaser.Physics.Arcade.STATIC_BODY);
    this.scene.physics.add.collider(this.scene.player, this.frozenMask);
    this.frozenMask.body.width = this.body.width+2;
    this.frozenMask.body.height = this.body.height+2;
  }

  removeFrozenMask() {
    if (this.frozenMask) {
      this.frozenMask.destroy();
    }
  }

  addDeathBang() {
    this.deathBang = this.scene.add.sprite(this.x, this.y, 'effects');
    this.deathBang.depth = 3;
    this.deathBang.play("enemy-death")
  }

  die() {
    this.removeFrozenMask();
    
    const scene = this.scene;
    this.isDead = true;
    this.body.allowGravity = false;
    scene.enemyGroup.remove(this);
    this.body.setVelocityX(0);
    this.body.setVelocityY(0);

    scene.killedEnemies.add(this);

    this.addDeathBang();

    scene.time.addEvent({
      delay: 300,
      callbackScope: this,
      callback: () => {
        // remove smoke emitter
        scene.killedEnemies.remove(this);
        scene.physics.world.disable(this);
        this.deathBang.destroy();

        // extract to pickup class
        const healthPickup = scene.add.sprite(this.x, this.y, "misc-pickups");
        healthPickup.play("health-pickup");
        healthPickup.depth = 3;
        scene.physics.world.enable(healthPickup, Phaser.Physics.Arcade.STATIC_BODY);
        scene.physics.add.overlap(healthPickup, scene.player, () => {
          scene.inventory.heal(20);
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
