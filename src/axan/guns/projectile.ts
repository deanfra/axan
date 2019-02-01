import ProjectileConfig from "../../interfaces/projectile-config"
import { DungeonScene } from 'scenes/dungeon.scene';

export default class Projectile extends Phaser.GameObjects.Sprite {
  gravity: boolean;
  key: string;
  size: number;
  velocity: number;
  scene: DungeonScene;
  damage: number = 0;

  constructor(scene, x, y, config: ProjectileConfig) {
    super(scene, x, y, "projectile", config.key);
    this.scene.projectileGroup.add(this, true);
    this.scene.physics.world.enable(this);
    this.anims.play(config.anim);
    this.flipX = config.flipX;
    this.damage = config.damage;

    this.body
      .setSize(config.size, config.size)
      .allowGravity = config.gravity;
  }

  projectileCollide = () => {
    this.destroy();
  }
}
