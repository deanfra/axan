import { Beam, BeamProps } from "./beam";
import MainScene from "axan/main.scene";
import ProjectileConfig from "../../interfaces/projectile-config";

export class Fire extends Beam implements BeamProps {
  static id = "FIRE";
  private direction: string;
  id = "FIRE";
  label = "FIRE";

  fireEmitter: Phaser.GameObjects.Particles.ParticleEmitterManager;

  cooldown = 300;
  shootTimer = 200;
  recoil = 200;
  damage = 3;
  size = 10;

  projectileConfig: ProjectileConfig = {
    anim: "beam-fire",
    damage: this.damage,
    gravity: false,
    key: "projectile",
    size: 10,
    velocity: 80,
  };

  scene: MainScene;

  constructor(scene, x, y, key = "beams", frame = 1) {
    super(scene, x, y, key, frame);
    this.body.setSize(this.size, this.size).allowGravity = false;
    this.fireEmitter = scene.add.particles("projectiles");
  }

  shoot() {
    const projectile = super.shoot();
    if (projectile) {
      projectile.effects.push("fire");
      this.particleEffect(projectile);
    }
    return projectile;
  }

  particleEffect(projectile) {
    projectile.emitterManager = this.fireEmitter;
    projectile.emitter = this.fireEmitter.createEmitter({
      frame: "fire01",
      follow: projectile,
      lifespan: 100,
      frequency: 30,
      angle: { min: -100, max: 100 },
      alpha: { start: 1, end: 0.5 },
      scale: { start: 0.5, end: 0.1 },
      speed: { min: 50, max: 100 },
      quantity: { min: 1, max: 2 },
    });
  }
}
