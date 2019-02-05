import ProjectileConfig from "../../interfaces/projectile-config"
import MainScene from 'axan/main.scene';

export default class Projectile extends Phaser.GameObjects.Sprite {
  gravity: boolean;
  key: string;
  size: number;
  velocity: number;
  scene: MainScene;
  damage: number = 0;
  emitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitter: Phaser.GameObjects.Particles.ParticleEmitter;

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
    if (this.emitter) {
      this.emitter.on = false;

      this.scene.time.addEvent({
        delay: 2000,
        callbackScope: this,
        callback: () => {
          this.emitterManager.emitters.remove(this.emitter);
        }
      });
    }
    this.destroy();
  }
}
