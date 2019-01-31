import { DungeonScene } from '../scenes/dungeon.scene';

export default class Background extends Phaser.GameObjects.TileSprite {
  public scene: DungeonScene;
  public body: Phaser.Physics.Arcade.Body;

  constructor(scene, layer) {
    super(scene, 0, 0, 0, 0, "caves", 0);
    this.scene = scene;
    this.setDepth(-1);
    this.setAlpha(1);
    this.scene.add.existing(this);
    // Parallax
    this.setScrollFactor(0.8, 0.8);
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
