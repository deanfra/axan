import MainScene from "./main.scene";

export default class Inventory {
  scene: MainScene;

  constructor(scene) {
    this.scene = scene;
    scene.hudGroup = scene.add.group();

    const screenLeft = (window.innerWidth / 3);
    const screenTop = (window.innerHeight / 3);
    scene.healthText = scene.add.bitmapText((screenLeft * 2) - 15, (screenTop * 2) - 15, 'mario-font', scene.inventory.health.toString(), 3, 2);
    scene.healthText.setDepth(100);
    scene.healthText.setScrollFactor(0);

    scene.inventoryText = scene.add.bitmapText(screenLeft + 15, (screenTop * 2) - 15, 'mario-font', 'LASER BEAM', 3);
    scene.inventoryText.setDepth(100);
    scene.inventoryText.setScrollFactor(0);

    scene.nameText = scene.add.bitmapText(screenLeft + 15, screenTop + 15, 'mario-font', scene.levelName.toUpperCase(), 3);
    scene.nameText.setDepth(100);
    scene.nameText.setScrollFactor(0);
  }
}