import * as crateriaSprite from 'assets/tilesets/crateria.png';
import * as crateria from 'assets/tilesets/crateria.png';
import * as doorsTiles from 'assets/tilesets/doors.png';
import * as doorsHorizTiles from 'assets/tilesets/doors-horiz.png';
import * as cavesFront from 'assets/tilesets/caves-front.png';
import * as cavesMid from 'assets/tilesets/caves-mid.png';
import * as cavesBack from 'assets/tilesets/caves-back.png';
import * as axanTiles from 'assets/tilesets/16x16-crateria.png';
import * as enemySprite from 'assets/tilesets/enemies.png';
import * as playerSpriteSheet from 'assets/tilesets/player-atlas.png';
import * as playerSpriteAtlas from 'assets/tilesets/player-atlas.json';

import * as projectiles from 'assets/tilesets/projectiles.png';
import * as guns from 'assets/tilesets/guns.png';
import * as beams from 'assets/tilesets/beams.png';

import * as marioFontPng from 'assets/fonts/font.png';
import * as marioFont from 'assets/fonts/font.fnt';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    this.load.image("caves-front", cavesFront);
    this.load.image("caves-mid", cavesMid);
    this.load.image("caves-back", cavesBack);
    this.load.image("crateria", crateria);
    this.load
      .atlas('player', playerSpriteSheet, playerSpriteAtlas)
      .spritesheet('axan', axanTiles, { frameWidth: 16, frameHeight: 16 })
      .spritesheet('doors-vert', doorsTiles, { frameWidth: 16, frameHeight: 48 })
      .spritesheet('doors-horiz', doorsHorizTiles, { frameWidth: 48, frameHeight: 16 })
      .spritesheet('crateriaSprite', crateriaSprite, { frameWidth: 256, frameHeight: 193 })
      .spritesheet('enemies', enemySprite, { frameWidth: 20, frameHeight: 20 })
      .spritesheet('projectiles', projectiles, { frameWidth: 16, frameHeight: 16 })
      .spritesheet('guns', guns, { frameWidth: 16, frameHeight: 16 })
      .spritesheet('beams', beams, { frameWidth: 16, frameHeight: 16 })
      .bitmapFont('mario', marioFontPng, marioFont)
  }

  create() {
    this.scene.start('MainScene');
  }
}
