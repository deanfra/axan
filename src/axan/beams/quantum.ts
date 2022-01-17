import { Laser } from "./laser";
import { BeamProps } from "./beam";

export class Quantum extends Laser implements BeamProps {
  static id = "QUANTUM";
  id = "QUANTUM";
  label = "QUANTUM";

  cooldown = 75;
  shootTimer = 75;
  // recoil = 30;
  damage = 12;
  // pushBackFloor = 40;
  // pushBackAir = 60;
  angleSpread = 25;

  projectileConfig = {
    anim: "beam-pulse",
    damage: this.damage,
    gravity: false,
    key: "projectile",
    size: 5,
    velocity: 500,
  };

  constructor(scene, x, y, key = "beams", frame) {
    super(scene, x, y, key, frame);
  }
  /*  shoot() {
    const x = this.flipX ? this.x - 8 : this.x + 8;

    const projectile =
      this.scene.projectileGroup.create(x, this.y, 'projectiles', this.projectile.key)
        .setData('bypass', true)
        .setData('flipX', this.flipX)
        .setData('dmg', this.damage)
        .setData('onCollide', this.projectileCollide) as Phaser.GameObjects.Sprite;

    projectile.flipX = this.flipX;

    projectile.body
      // .setVelocityX(this.flipX ? -this.projectile.velocity : this.projectile.velocity)
      // .setVelocityY(Phaser.Math.Between(-this.angleSpread, this.angleSpread))
      // .setSize(this.projectile.size, this.projectile.size)
      .setBounceY(1)
      // .allowGravity = this.projectile.gravity;
    this.scene.tweens.add({
      targets: this,
      duration: this.cooldown / 2,
      ease: 'Sine.easeInOut',
      yoyo: true,
      angle: this.flipX ? this.recoil : -this.recoil,
    });
    this.shootTimer = 0;

    super.shoot();
  }*/

  //   if (this.scene.player.body.onFloor()) {
  //     if (this.flipX) {
  //       return this.pushBackFloor;
  //     } else {
  //       return -this.pushBackFloor;
  //     }
  //   } else {
  //     if (this.flipX) {
  //       return this.pushBackAir;
  //     } else {
  //       return -this.pushBackAir;
  //     }
  //   }
  // }
}
