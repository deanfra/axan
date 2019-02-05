import { Beam, BeamProps } from "./beam";
import MainScene from "axan/main.scene";
import ProjectileConfig from "../../interfaces/projectile-config"

export class Ice extends Beam implements BeamProps {
  static id = "ICE";
  private direction: string;
  id = "ICE";
  label = "ICE";

  cooldown = 300;
  shootTimer = 200;
  recoil = 200;
  damage = 3;
  size = 10;

  iceEmitter: Phaser.GameObjects.Particles.ParticleEmitterManager;

  projectileConfig: ProjectileConfig = {
    anim: "beam-ice",
    damage: this.damage,
    gravity: false,
    key: "projectile",
    size: 10,
    velocity: 400
  };

  scene: MainScene;

  constructor(scene, x, y, key = "beams", frame = 1) {
    super(scene, x, y, key, frame);
    this.iceEmitter = scene.add.particles('projectiles');
    this.body.setSize(this.size, this.size).allowGravity = false;
  }

  shoot() {
    const projectile = super.shoot();
    projectile.effects.push('ice');
    this.particleEffect(projectile);

    return projectile;
  }

  particleEffect(projectile) {
    projectile.emitterManager = this.iceEmitter;
    projectile.emitter = this.iceEmitter
      .createEmitter({
        frame: 'ice01',
        follow: projectile,
        lifespan: 400,
        frequency: 30,
        angle: { min: 80, max: 100 },
        alpha: { start: 1, end: .5 },
        scale: { start: 0.5, end: 0.1 },
        speed: { min: 50, max: 100 },
        quantity: { min: 1, max: 5 },
      });
  }
}
