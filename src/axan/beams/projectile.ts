import ProjectileConfig from "../../interfaces/projectile-config";
import MainScene from "axan/main.scene";

export default class Projectile extends Phaser.GameObjects.Sprite {
  public effects: Array<string> = [];

  depth: number = 3;
  gravity: boolean;
  key: string;
  size: number;
  velocity: number;
  scene: MainScene;
  damage: number = 0;
  emitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  impactBang: Phaser.GameObjects.Sprite;

  constructor(scene, x, y, config: ProjectileConfig) {
    super(scene, x, y, "projectile", config.key);
    this.scene.projectileGroup.add(this, true);
    this.scene.physics.world.enable(this);
    this.anims.play(config.anim);
    this.damage = config.damage;

    this.body.setSize(config.size, config.size).allowGravity = config.gravity;
  }

  projectileCollide = () => {
    this.addBeamImpact();

    if (this.emitter) {
      this.emitter.on = false;
    }

    this.scene.time.addEvent({
      delay: 2000,
      callbackScope: this,
      callback: () => {
        this.impactBang.destroy();
        if (this.emitter) {
          this.emitterManager.emitters.remove(this.emitter);
        }
      },
    });
    this.destroy();
  };

  addBeamImpact() {
    this.impactBang = this.scene.add.sprite(this.x, this.y, "effects");
    this.impactBang.depth = 3;
    this.impactBang.play("beam-impact");
    this.impactBang.angle = this.angle;
  }
}
