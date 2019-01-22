import { Gun, GunProps, ProjectileConfig } from './gun';
import { DungeonScene } from 'scenes/dungeon.scene';

export class Pistol extends Gun implements GunProps {
  static id = 'PISTOL';
  private direction: string;
  id = 'PISTOL';
  sfx = 'pistolshoot';

  cooldown = 200;
  shootTimer = 200;
  recoil = 200;
  damage = 3;
  size = 10;

  canShoot = true;
  released = true;

  projectile: ProjectileConfig = {
    velocity: 600,
    size: 10,
    gravity: false,
    key: 'projectile',
    anim: 'beam2'
  };

  scene: DungeonScene;

  constructor(scene, x, y, key = 'guns', frame = 1) {
    super(scene, x, y, key, frame);
    this.body.setSize(this.size, this.size).allowGravity = false;
  }

  update(time: number, delta: number): void {
    const player = this.scene.player;
    const { up, down } = player.inputs;
    this.y = player.isCrouching ? player.y - 10 : player.y - 25;

    // refactor
    if (!player.inputs.up && !player.inputs.down) {
      this.x = this.flipX ? player.x - 8 : player.x + 8;
    } else if(up && player.isMoving) {
      // Run aim up
      this.y = player.y - 50;
      this.x = this.flipX ? player.x - 14 : player.x + 14;
    } else if (up) {
      // Standing aim up
      this.y = player.y - 50;
      this.x = player.x;
    } else if (down && player.isMoving) {
      // Run aim down
      this.y = player.y - 20;
      this.x = this.flipX ? player.x - 14 : player.x + 14;
    } else if (down && !player.body.onFloor()) {
      this.y = player.y;
      this.x = player.x;
    } else {
      this.x = player.x;
    }

    this.flipX = player.flipX;
    this.setDepth(this.flipX ? 11 : 9);
    this.shootTimer += delta;
  }

  shoot(shake = false) {
    if (this.canShoot) {
      // refactor
      let x = this.x;
      const player = this.scene.player;
      const {up, down} = player.inputs;

      if (!this.scene.player.inputs.up && !this.scene.player.inputs.down) {
        x = this.flipX ? this.x - 16 : this.x + 16;
      }

      this.canShoot = false;
      this.released = false;
      this.scene.events.emit('sfx', this.sfx, Phaser.Math.FloatBetween(0.7, 1));
      const projectile =
        this.scene.projectileGroup.create(x, this.y, 'projectiles', this.projectile.key)
          .setData('dmg', this.damage)
          .setData('onCollide', this.projectileCollide) as Phaser.GameObjects.Sprite;

      projectile.anims.play('beam1');
      
      // shoot direction
      projectile.flipX = this.flipX;
      if(up && player.isMoving) {
        projectile.angle = this.flipX ? 45 : -45;
        projectile.body
          .setVelocityY(-this.projectile.velocity)
        projectile.body
          .setVelocityX(this.flipX ? -this.projectile.velocity : this.projectile.velocity)
      } else if(down && player.isMoving) {
        projectile.angle = this.flipX ? -45 : 45;
        projectile.body
          .setVelocityY(this.projectile.velocity)
        projectile.body
          .setVelocityX(this.flipX ? -this.projectile.velocity : this.projectile.velocity)
      } else if(up) {
        projectile.angle = 90;
        projectile.body
          .setVelocityY(-this.projectile.velocity)
      } else if (down && !player.body.onFloor()) {
        projectile.angle = 90;
        projectile.body
          .setVelocityY(this.projectile.velocity)
      } else {
        projectile.body
          .setVelocityX(this.flipX ? -this.projectile.velocity : this.projectile.velocity)
      }

      projectile.body
        .setSize(this.projectile.size, this.projectile.size)
        .allowGravity = this.projectile.gravity;

      this.scene.time.addEvent({
        delay: this.cooldown,
        callbackScope: this,
        callback() {
          if (this.active && this.released) {
            this.canShoot = true;
          }
        }
      });

      this.scene.tweens.add({
        targets: this,
        duration: 100,
        ease: 'Sine.easeIn',
        yoyo: true,
        angle: this.flipX ? 70 : -70,
        callbackScope: this,
        onComplete() {
          this.setAngle(0);
        }
      });

      // this.body.setAngularVelocity(this.flipX ? this.recoil : -this.recoil);
      this.shootTimer = 0;
    } else {
      this.scene.time.addEvent({
        delay: this.cooldown,
        callbackScope: this,
        callback() {
          if (this.active && this.released) {
            this.canShoot = true;
          }
        }
      });
    }
    return 0;
  }

  unShoot(): void {
    this.released = true;
  }

  projectileCollide = (projectile, scene) => {
    scene.events.emit('sfx', 'foley');
    projectile.destroy();
  }

}
