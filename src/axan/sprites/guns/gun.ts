import { DungeonScene } from 'scenes/dungeon.scene';

export interface GunProps {
  id: string;
  sfx: string;
  cooldown: number;
  recoil: number;
  damage: number;
  size: number;
  canShoot: boolean;
}

export interface ProjectileConfig {
  velocity: number;
  size: number;
  gravity: boolean;
  amount?: number;
  key: string;
  anim?: string;
}

export class Gun extends Phaser.GameObjects.Sprite implements GunProps {
  public static id: string;
  id: string;
  sfx: string;
  cooldown: number;
  canShoot = true;
  recoil: number;
  damage: number;
  size: number;
  body: Phaser.Physics.Arcade.Body;
  scene: DungeonScene;

  shootTimer: number;

  constructor(scene, x, y, key = 'guns', frame?) {
    super(scene, x, y, key, frame);
    this.scene.physics.world.enable(this as Phaser.GameObjects.Sprite);
  }
  
  shoot(...args: any[]): undefined | number {
    return;
  }

  unShoot(...args: any[]): void {
    return;
  }

  update(time: number, delta: number): void {
    //
  }

  preDestroy(): void { /* */ }
}
