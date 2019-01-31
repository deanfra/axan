import { Pistol } from './pistol';
import { GunProps } from './gun';

export class Smg extends Pistol implements GunProps {
  static id = 'SMG';
  id = 'SMG';
  label = "QUANTUM";

  cooldown = 75;
  shootTimer = 75;
  // recoil = 30;
  damage = 2;
  // pushBackFloor = 40;
  // pushBackAir = 60;
  angleSpread = 25;

  projectile = {
    velocity: 500,
    size: 5,
    gravity: false,
    key: 'projectile',
    anim: 'beam-fire'
  };

  constructor(scene, x, y, key = 'guns', frame) {
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
