import { Gun, GunProps } from "./gun";
import { DungeonScene } from "scenes/dungeon.scene";
import ProjectileConfig from "../../interfaces/projectile-config"

export class Pistol extends Gun implements GunProps {
  static id = "PISTOL";
  private direction: string;
  id = "PISTOL";
  label = "LASER";

  cooldown = 300;
  shootTimer = 200;
  recoil = 200;
  damage = 3;
  size = 10;

  projectileConfig: ProjectileConfig = {
    anim: "beam-photon",
    damage: this.damage,
    gravity: false,
    key: "projectile",
    size: 10,
    velocity: 400
  };

  scene: DungeonScene;

  constructor(scene, x, y, key = "guns", frame = 1) {
    super(scene, x, y, key, frame);
    this.body.setSize(this.size, this.size).allowGravity = false;
  }

}
