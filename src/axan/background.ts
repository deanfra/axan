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

  parallaxUpdating() {
    // Parallax background:
    // 1. Create a Phaser.Group of sprites
    // 2. Use array of like 9999 locationpoints(x, y)
    // 3. Keep track of array index for head locations
    // 4. For each frame, save value of head locations at index position in array
    // 5. Update positions of the following sprites accordingly in .update()
    // 6. index + 1(if larger than say 9999 then index = 0)

    // const bg: any = this.add.image(300, 300, "crateria");
    // OR - look at cratebox example
  }
}
