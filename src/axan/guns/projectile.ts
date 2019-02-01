// import { ProjectileConfig } from "../../interfaces/projectile-config"
import { DungeonScene } from 'scenes/dungeon.scene';

export default class Projectile extends Phaser.GameObjects.Sprite {
  gravity: boolean;
  key: string;
  size: number;
  velocity: number;
  scene: DungeonScene;
  // damage: number;

  constructor(scene, x, y, frame, damage) {
    super(scene, x, y, "projectiles", frame);
    this.scene.physics.world.enable(this as Phaser.GameObjects.Sprite);
    this.scene.projectileGroup.add(this, true);
    this.setData('onCollide', this.projectileCollide);
    this.setData('damage', damage);
  }

  projectileCollide = () => {
    this.destroy();
  }
}
