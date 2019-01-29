import { Gun, GunProps, ProjectileConfig } from './gun';
import { DungeonScene } from 'scenes/dungeon.scene';

export class Pistol extends Gun implements GunProps {
  static id = 'PISTOL';
  private direction: string;
  id = 'PISTOL';

  cooldown = 300;
  shootTimer = 200;
  recoil = 200;
  damage = 3;
  size = 10;

  projectile: ProjectileConfig = {
    velocity: 400,
    size: 10,
    gravity: false,
    key: 'projectile',
    anim: 'beam-photon'
  };

  scene: DungeonScene;

  constructor(scene, x, y, key = 'guns', frame = 1) {
    super(scene, x, y, key, frame);
    this.body.setSize(this.size, this.size).allowGravity = false;
  }

}
