import MainScene from './main.scene';

export default class Background extends Phaser.GameObjects.TileSprite {
  public scene: MainScene;
  public body: Phaser.Physics.Arcade.Body;

  constructor(scene, key, scrollFactor, depth) {
    super(scene, 0, 0, 0, 0, key, 0);
    this.scene = scene;
    this.setDepth(depth);
    this.setAlpha(1);
    this.scene.add.existing(this);
    // Parallax
    this.setScrollFactor(scrollFactor, scrollFactor);
  }

  setup() {
    this.positionToActiveRoom();
  }
  
  positionToActiveRoom() {
    const { x, y, width, height } = this.scene.activeRoom;
    this.width = 1900;
    this.height = 1900;
    this.x = this.scene.map.tileToWorldX(x + (height/2)); 
    this.y = this.scene.map.tileToWorldY(y + (width/2));
  }
}
