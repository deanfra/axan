import MainScene from "./main.scene";
import RandomPlanetName from "../util/name-gen";

const FONT = "mario-font";
const ALIGN_RIGHT = 3;
const HUD_SIZE = 3;
const LINE_HEIGHT = 4.5;

export default class Inventory {
  private scene: MainScene;
  private levelName: string = RandomPlanetName();
  public healthText: Phaser.GameObjects.BitmapText;
  public nameText: Phaser.GameObjects.BitmapText;
  public inventoryTexts: string[];
  public beamTexts: Phaser.GameObjects.BitmapText[];

  public screenLeft: number;
  public screenRight: number;
  public screenTop: number;
  public screenBottom: number;

  constructor(scene: MainScene) {
    this.scene = scene;
    scene.hudGroup = scene.add.group();
    this.inventoryTexts = [];
    this.beamTexts = [];

    this.screenLeft = window.innerWidth / 3 + 15;
    this.screenRight = (window.innerWidth / 3) * 2 - 25;
    this.screenTop = window.innerHeight / 3 + 15;
    this.screenBottom = (window.innerHeight / 3) * 2 - 15;

    // Inventory label text
    const inventoryLabel = scene.add.bitmapText(this.screenLeft, this.screenTop + LINE_HEIGHT * 4, FONT, "INVENTORY", HUD_SIZE);
    inventoryLabel.setDepth(100);
    inventoryLabel.setScrollFactor(0);
    inventoryLabel.setAlpha(0.5);

    // Beam label text
    const beamsLabel = scene.add.bitmapText(this.screenLeft, this.screenTop + LINE_HEIGHT * 10, FONT, "BEAMS", HUD_SIZE);
    beamsLabel.setDepth(100);
    beamsLabel.setScrollFactor(0);
    beamsLabel.setAlpha(0.5);

    scene.inventory.beams.forEach((beam) => {
      this.addToBeamsText(beam);
    });
    this.setCurrentBeam(scene.inventory.beams[0]);

    this.healthText = scene.add.bitmapText(this.screenRight, this.screenTop, FONT, scene.inventory.health.toString(), HUD_SIZE, ALIGN_RIGHT);
    this.healthText.setDepth(100);
    this.healthText.setScrollFactor(0);

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

  addToBeamsText(item: string) {
    const offset = this.beamTexts.length * LINE_HEIGHT;
    const topPosition = this.screenTop + LINE_HEIGHT * 11 + offset;

    // Beam text
    const bitmapText = this.scene.add.bitmapText(this.screenLeft, topPosition, FONT, `${item} BEAM`, HUD_SIZE);
    bitmapText.setDepth(100);
    bitmapText.setScrollFactor(0);
    this.beamTexts.push(bitmapText);
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

  setCurrentBeam(currentName: string) {
    this.beamTexts.forEach((beam) => {
      if (beam.text === `${currentName} BEAM`) {
        beam.setTint(0xa5ff33);
      } else {
        beam.setTint(0xffffff);
      }
    });
  }
}
