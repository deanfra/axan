import 'phaser';

import { BootScene } from 'scenes/boot.scene';
import { DungeonScene } from './scenes/dungeon.scene';

const config: Opt<GameConfig> = {
  type: Phaser.WEBGL,
  backgroundColor: '#121619',
  parent: 'game',
  width: window.innerWidth,
  height: window.innerHeight,
  zoom: 2,
  render: { pixelArt: true },
  input: {
    gamepad: true
  },
  // fps: {
  //   min: 1,
  //   target: 30,
  //   forceSetTimeOut: true,
  //   panicMax: 20
  // },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
    }
  },
  scene: [
    BootScene,
    DungeonScene
  ]
};

const game = new Phaser.Game(config);

window.addEventListener("resize", () => {
  game.resize(window.innerWidth, window.innerHeight);
});
