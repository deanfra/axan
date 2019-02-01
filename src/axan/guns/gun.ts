import MainScene from 'axan/main.scene';
import Projectile from "./projectile";
import ProjectileConfig from "../../interfaces/projectile-config"

export interface GunProps {
  id: string;
  sfx: string;
  cooldown: number;
  recoil: number;
  damage: number;
  size: number;
  canShoot: boolean;
}

export class Gun extends Phaser.GameObjects.Sprite implements GunProps {
  public static id: string;
  id: string;
  sfx: string;
  cooldown: number;
  canShoot = true;
  released = true;
  recoil: number;
  damage: number;
  size: number;
  body: Phaser.Physics.Arcade.Body;
  scene: MainScene;
  label: string;
  
  projectileConfig: ProjectileConfig = {
    velocity: 600,
    size: 10,
    gravity: false,
    key: 'projectile',
    anim: 'beam2'
  };

  shootTimer: number;

  // TODO: lots of shared code can go in this class
  constructor(scene, x, y, key = 'guns', frame?) {
    super(scene, x, y, key, frame);
    this.scene.physics.world.enable(this as Phaser.GameObjects.Sprite);
  }
  
  shoot() {
    if (this.canShoot) {
      this.canShoot = false;
      this.released = false;

      // refactor
      let x = this.x;
      const player = this.scene.player;
      const { up, down } = player.inputs;
      const { velocity } = this.projectileConfig;

      if (!up && !down) {
        x = this.flipX ? this.x - 16 : this.x + 16;
      }

      const projectile = new Projectile(this.scene, x, this.y, this.projectileConfig)

      if (up && player.isMoving) { // run - up
        projectile.angle = this.flipX ? 45 : -45;
        projectile.body.setVelocityY(-velocity)
        projectile.body.setVelocityX(this.flipX ? -velocity : velocity)
      } else if (down && player.isMoving) { // run - down
        if (player.isJumping) {
          projectile.angle = this.flipX ? -45 : 45;
          projectile.body.setVelocityY(velocity)
        }
        projectile.body.setVelocityX(this.flipX ? -velocity : velocity)
        
      } else if (up) {
        projectile.angle = 90;
        projectile.body.setVelocityY(-velocity)
      } else if (down && !player.body.onFloor()) {
        projectile.angle = 90;
        projectile.body.setVelocityY(velocity)
      } else {
        projectile.body.setVelocityX(this.flipX ? -velocity : velocity)
      }

      this.scene.time.addEvent({
        delay: this.cooldown,
        callbackScope: this,
        callback() {
          // if (this.active && this.released) {
          if (this.active) {
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
    return;
  }

  projectileCollide = (projectile, scene) => {
    projectile.destroy();
  }

  unShoot(...args: any[]): void {
    this.released = true;
  }

  update(time: number, delta: number): void {
    const player = this.scene.player;
    const { up, down } = player.inputs;
    this.y = player.isCrouching ? player.y - 10 : player.y - 25;

    // refactor
    if (!up && !down) {
      this.x = this.flipX ? player.x - 8 : player.x + 8;
    } else if (up && player.isMoving) {
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

  preDestroy(): void { /* */ }
}
