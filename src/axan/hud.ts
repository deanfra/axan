import MainScene from "./main.scene";
import RandomPlanetName from "../util/name-gen";

const FONT = "mario-font";
const ALIGN_RIGHT = 3;
const HUD_SIZE = 3;
const LINE_HEIGHT = 4.5;

export default class Inventory {
  private scene: MainScene;
  private levelName: string = RandomPlanetName();
  public beamText: Phaser.GameObjects.BitmapText;
  public healthText: Phaser.GameObjects.BitmapText;
  public nameText: Phaser.GameObjects.BitmapText;
  public inventoryTexts: string[];
  public screenLeft: number;
  public screenRight: number;
  public screenTop: number;
  public screenBottom: number;

  constructor(scene: MainScene) {
    this.scene = scene;
    scene.hudGroup = scene.add.group();
    this.inventoryTexts = [];

    this.screenLeft = window.innerWidth / 3 + 15;
    this.screenRight = (window.innerWidth / 3) * 2 - 25;
    this.screenTop = window.innerHeight / 3 + 15;
    this.screenBottom = (window.innerHeight / 3) * 2 - 15;

    // Inventory label text
    const inventoryLabel = scene.add.bitmapText(this.screenLeft, this.screenTop + LINE_HEIGHT * 4, FONT, "INVENTORY", HUD_SIZE);
    inventoryLabel.setDepth(100);
    inventoryLabel.setScrollFactor(0);
    inventoryLabel.setAlpha(0.5);

    this.healthText = scene.add.bitmapText(this.screenRight, this.screenBottom, FONT, scene.inventory.health.toString(), HUD_SIZE, ALIGN_RIGHT);
    this.healthText.setDepth(100);
    this.healthText.setScrollFactor(0);

    this.beamText = scene.add.bitmapText(this.screenLeft, this.screenBottom, FONT, "LASER BEAM", HUD_SIZE);
    this.beamText.setDepth(100);
    this.beamText.setScrollFactor(0);

    // World label text
    const worldLabel = scene.add.bitmapText(this.screenLeft, this.screenTop, FONT, "WORLD", HUD_SIZE);
    worldLabel.setDepth(100);
    worldLabel.setScrollFactor(0);
    worldLabel.setAlpha(0.5);

    this.nameText = scene.add.bitmapText(this.screenLeft, this.screenTop + LINE_HEIGHT, FONT, this.levelName.toUpperCase(), HUD_SIZE);
    this.nameText.setDepth(100);
    this.nameText.setScrollFactor(0);
  }

  setHealthText(text) {
    this.healthText.setText(text);
  }

  addToInventoryText(item: string) {
    const offset = this.inventoryTexts.length * LINE_HEIGHT;
    const topPosition = this.screenTop + LINE_HEIGHT * 5 + offset;

    // Inventory text
    const bitmapText = this.scene.add.bitmapText(this.screenLeft + 0.4, topPosition, FONT, item, HUD_SIZE);
    bitmapText.setDepth(100);
    bitmapText.setScrollFactor(0);
    this.inventoryTexts.push(item);
  }
}
