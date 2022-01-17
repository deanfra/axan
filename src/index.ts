import "phaser";

import BootScene from "boot.scene";
import MainScene from "./axan/main.scene";

const config: Opt<GameConfig> = {
  type: Phaser.WEBGL,
  backgroundColor: "#121619",
  parent: "game",
  width: window.innerWidth,
  height: window.innerHeight,
  zoom: 2,
  render: { pixelArt: true },
  // autoRound: true,
  scale: {
    mode: Phaser.DOM.RESIZE,
    parent: "game",
    width: "100%",
    height: "100%",
  },
  input: {
    gamepad: true,
  },
  // fps: {
  //   min: 1,
  //   target: 30,
  //   forceSetTimeOut: true,
  //   panicMax: 20
  // },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
  scene: [BootScene, MainScene],
};

const game = new Phaser.Game(config);
