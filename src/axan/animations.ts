import MainScene from "./main.scene";
import * as _ from "lodash";

const pickups = (scene: MainScene) => {
  const repeat = -1;
  const frameRate = 15;

  [
    {
      key: "health-pickup",
      frameRate: 7,
      yoyo: true,
      frames: scene.anims.generateFrameNames("pickups", { start: 1, end: 3, prefix: "health-pickup" }),
    },
    {
      key: "hi-jump-boots",
      frameRate: 7,
      frames: scene.anims.generateFrameNames("pickups", { start: 1, end: 2, prefix: "boot-pickup" }),
    },
    {
      key: "dash-boots",
      frameRate: 7,
      frames: scene.anims.generateFrameNames("pickups", { start: 1, end: 2, prefix: "dash-pickup" }),
    },
    {
      key: "wall-jump-boots",
      frameRate: 7,
      frames: scene.anims.generateFrameNames("pickups", { start: 1, end: 2, prefix: "walljump-pickup" }),
    },
    {
      key: "health-upgrade",
      frameRate: 7,
      frames: scene.anims.generateFrameNames("pickups", { start: 1, end: 2, prefix: "globe" }),
    },
    {
      key: "health-upgrade-2",
      frameRate: 7,
      frames: scene.anims.generateFrameNames("pickups", { start: 1, end: 2, prefix: "globe-steel" }),
    },
    {
      key: "pickup-holder",
      frames: scene.anims.generateFrameNames("pickups", { start: 1, end: 1, prefix: "pickup-holder" }),
    },
    {
      key: "charge",
      frames: scene.anims.generateFrameNames("beam-pickups", { start: 0, end: 1 }),
    },
    {
      key: "spazer",
      frames: scene.anims.generateFrameNames("beam-pickups", { start: 2, end: 3 }),
    },
    {
      key: "wave",
      frames: scene.anims.generateFrameNames("beam-pickups", { start: 4, end: 5 }),
    },
    {
      key: "ice",
      frames: scene.anims.generateFrameNames("beam-pickups", { start: 6, end: 7 }),
    },
    {
      key: "plasma",
      frames: scene.anims.generateFrameNames("beam-pickups", { start: 8, end: 9 }),
    },
  ].forEach((anim) => scene.anims.create(_.merge({ repeat, frameRate }, anim)));
};

const enemies = (scene: MainScene) => {
  [
    {
      key: "piq",
      frameRate: 15,
      repeat: -1,
      frames: scene.anims.generateFrameNames("enemies", { start: 0, end: 4, prefix: "piq", zeroPad: 2 }),
    },
    {
      key: "gnid",
      frameRate: 15,
      repeat: -1,
      frames: scene.anims.generateFrameNames("enemies", { start: 1, end: 8, prefix: "gnid" }),
    },
    {
      key: "jumper-idle",
      frameRate: 4,
      repeat: -1,
      frames: scene.anims.generateFrameNames("enemies", { start: 0, end: 4, prefix: "jumper-idle", zeroPad: 2 }),
    },
    {
      key: "jumper-jump",
      frameRate: 4,
      repeat: 0,
      frames: scene.anims.generateFrameNames("enemies", { start: 1, end: 1, prefix: "jumper-jump", zeroPad: 2 }),
    },
    {
      key: "vroll",
      frameRate: 4,
      repeat: -1,
      frames: scene.anims.generateFrameNames("enemies", { start: 0, end: 2, prefix: "vroll-idle", zeroPad: 2 }),
    },
    {
      key: "vroll-down",
      frameRate: 4,
      repeat: -1,
      frames: scene.anims.generateFrameNames("enemies", { start: 0, end: 2, prefix: "vroll-attack", zeroPad: 2 }),
    },
    {
      key: "enemy-death",
      frameRate: 20,
      repeat: 0,
      frames: scene.anims.generateFrameNames("effects", { start: 0, end: 6, prefix: "enemy-death", zeroPad: 2 }),
    },
  ].forEach((anim) => scene.anims.create(anim));
};

const projectiles = (scene: MainScene) => {
  [
    {
      key: "beam-photon",
      frames: scene.anims.generateFrameNames("projectiles", { start: 1, end: 1, prefix: "photon", zeroPad: 2 }),
    },
    {
      key: "beam-pulse",
      frames: scene.anims.generateFrameNames("projectiles", { start: 1, end: 1, prefix: "pulse", zeroPad: 2 }),
    },
    {
      key: "beam-rang",
      frames: scene.anims.generateFrameNames("projectiles", { start: 1, end: 1, prefix: "rang", zeroPad: 2 }),
    },
    {
      key: "beam-orb",
      frames: scene.anims.generateFrameNames("projectiles", { start: 1, end: 1, prefix: "orb", zeroPad: 2 }),
    },
    {
      key: "beam-ice",
      frames: scene.anims.generateFrameNames("projectiles", { start: 1, end: 1, prefix: "ice", zeroPad: 2 }),
    },
    {
      key: "beam-fire",
      frameRate: 7,
      frames: scene.anims.generateFrameNames("projectiles", { start: 1, end: 3, prefix: "fire", zeroPad: 2 }),
    },
    {
      key: "beam-impact",
      frameRate: 20,
      repeat: 0,
      frames: scene.anims.generateFrameNames("effects", { start: 0, end: 5, prefix: "beam-impact" }),
    },
  ].forEach((anim) => scene.anims.create(anim));
};

const doorGates = (scene: MainScene) => {
  [
    {
      key: "door-open",
      repeat: 0,
      frameRate: 20,
      frames: scene.anims.generateFrameNames("door-gates", { start: 1, end: 3, prefix: "door-open" }),
    },
    {
      key: "door-close",
      repeat: 0,
      frameRate: 20,
      frames: scene.anims
        .generateFrameNames("door-gates", { start: 1, end: 3, prefix: "door-open" })
        .reverse()
        .concat(scene.anims.generateFrameNames("door-gates", { start: 1, end: 1, prefix: "door-active" }))
        .concat(scene.anims.generateFrameNames("door-gates", { start: 1, end: 1, prefix: "door-active" }))
        .concat(scene.anims.generateFrameNames("door-gates", { start: 1, end: 1, prefix: "door-active" }))
        .concat(scene.anims.generateFrameNames("door-gates", { start: 1, end: 1, prefix: "door-active" }))
        .concat(scene.anims.generateFrameNames("door-gates", { start: 1, end: 1, prefix: "door-closed" })),
    },
    {
      key: "door-closed",
      repeat: -1,
      frames: scene.anims.generateFrameNames("door-gates", { start: 1, end: 1, prefix: "door-closed" }),
    },
    {
      key: "door-active",
      repeat: -1,
      frames: scene.anims.generateFrameNames("door-gates", { start: 1, end: 1, prefix: "door-active" }),
    },
  ].forEach((anim) => scene.anims.create(anim));
};

export default function (scene: MainScene): void {
  doorGates(scene);
  pickups(scene);
  enemies(scene);
  projectiles(scene);
}
