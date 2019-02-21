export default class Pickup extends Phaser.GameObjects.Sprite {
  name: string;

  constructor(scene, x, y, key, frame?) {
    super(scene, x, y, key, frame);
    this.depth = 3;
  }
}