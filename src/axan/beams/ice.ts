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
    this.body.setSize(this.size, this.size).allowGravity = false;
  }

}
