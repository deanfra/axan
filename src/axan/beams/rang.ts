import { Beam, BeamProps } from "./beam";
import MainScene from "axan/main.scene";
import ProjectileConfig from "../../interfaces/projectile-config";

export class Rang extends Beam implements BeamProps {
  static id = "RANG";
  id = "RANG";
  label = "RANG";

  cooldown = 300;
  shootTimer = 200;
  recoil = 200;
  damage = 3;
  size = 15;

  projectileConfig: ProjectileConfig = {
    anim: "beam-rang",
    damage: this.damage,
    gravity: false,
    key: "projectile",
    size: 10,
    velocity: 400,
  };

  scene: MainScene;

  constructor(scene, x, y, key = "beams", frame = 1) {
    super(scene, x, y, key, frame);
    this.body.setSize(this.size, this.size).allowGravity = false;
  }

  shoot() {
    const projectile = super.shoot();
    if (projectile) {
      projectile.effects.push("pushback");
    }
    return projectile;
  }
}
