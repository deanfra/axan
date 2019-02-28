import MainScene from "./main.scene";
import RandomPlanetName from "../util/name-gen";

export default class Inventory {
  private scene: MainScene;
  private levelName: string = RandomPlanetName();
  public inventoryText: Phaser.GameObjects.BitmapText;
  public healthText: Phaser.GameObjects.BitmapText;
  public nameText: Phaser.GameObjects.BitmapText;

  constructor(scene: MainScene) {
    this.scene = scene;
    scene.hudGroup = scene.add.group();

    const screenLeft = (window.innerWidth / 3);
    const screenTop = (window.innerHeight / 3);
    this.healthText = scene.add.bitmapText((screenLeft * 2) - 15, (screenTop * 2) - 15, 'mario-font', scene.inventory.health.toString(), 3, 2);
    this.healthText.setDepth(100);
    this.healthText.setScrollFactor(0);

    this.inventoryText = scene.add.bitmapText(screenLeft + 15, (screenTop * 2) - 15, 'mario-font', 'LASER BEAM', 3);
    this.inventoryText.setDepth(100);
    this.inventoryText.setScrollFactor(0);

    this.nameText = scene.add.bitmapText(screenLeft + 15, screenTop + 15, 'mario-font', this.levelName.toUpperCase(), 3);
    this.nameText.setDepth(100);
    this.nameText.setScrollFactor(0);
  }

  setHealth(text) {
    this.healthText.setText(text);
  }
}