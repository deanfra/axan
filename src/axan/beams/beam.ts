import MainScene from 'axan/main.scene';
import Projectile from "./projectile";
import ProjectileConfig from "../../interfaces/projectile-config"

export interface BeamProps {
  id: string;
  sfx: string;
  cooldown: number;
  recoil: number;
  damage: number;
  size: number;
  canShoot: boolean;
}

export class Beam extends Phaser.GameObjects.Sprite implements BeamProps {
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
    key: '',
    anim: ''
  };

  shootTimer: number;

  // TODO: lots of shared code can go in this class
  constructor(scene, x, y, key = 'beams', frame?) {
    super(scene, x, y, key, frame);
    this.scene.physics.world.enable(this as Phaser.GameObjects.Sprite);
  }
  
  shoot() {
    if (this.canShoot) {
      this.canShoot = false;
      this.released = false;

      const player = this.scene.player;
      const { up, down } = player.inputs;
      const { velocity } = this.projectileConfig;

      const projectile = new Projectile(this.scene, this.x, this.y, this.projectileConfig);

      if (up && player.isMoving) { // run - up
        projectile.angle = this.flipX ? -135 : -45;
        projectile.body.setVelocityY(-velocity)
        projectile.body.setVelocityX(this.flipX ? -velocity : velocity)
      } else if (down && player.isMoving) { // run - down
        if (player.isJumping) {
          projectile.angle = this.flipX ? 135 : 45;
          projectile.body.setVelocityY(velocity)
        }
        projectile.body.setVelocityX(this.flipX ? -velocity : velocity)
        
      } else if (up) {
        projectile.angle = -90;
        projectile.body.setVelocityY(-velocity)
      } else if (down && !player.body.onFloor()) {
        projectile.angle = 90;
        projectile.body.setVelocityY(velocity)
      } else {
        projectile.angle = this.flipX ? 180 : 0;
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

      this.shootTimer = 0;

      return projectile;
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
    } else if (down && player.isMoving && !player.body.onFloor()) {
      this.y = player.y;
      this.x = this.flipX ? player.x - 14 : player.x + 14;
    } else if (down && !player.body.onFloor()) {
      this.y = player.y;
      this.x = this.flipX ? player.x - 5 : player.x;
    } else if (down) {
      // crouch
      this.y = player.y - 15;
      this.x = this.flipX ? player.x - 14 : player.x + 14;
    } else {
      this.x = player.x;
    }

    this.flipX = player.flipX;
    this.setDepth(this.flipX ? 11 : 9);
    this.shootTimer += delta;
  }

  preDestroy(): void { /* */ }
}
