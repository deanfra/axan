import * as creotur from 'assets/tilesets/creotur.png';
import * as doorsTiles from 'assets/tilesets/doors.png';
import * as doorsHorizTiles from 'assets/tilesets/doors-horiz.png';
import * as cavesFront from 'assets/tilesets/caves-front.png';
import * as cavesMid from 'assets/tilesets/caves-mid.png';
import * as cavesBack from 'assets/tilesets/caves-back.png';
import * as axanTiles from 'assets/tilesets/16x16-creotur.png';

import * as playerSpriteSheet from 'assets/tilesets/player-atlas.png';
import * as playerSpriteAtlas from 'assets/tilesets/player-atlas.json';
import * as enemySpriteSheet from 'assets/tilesets/enemy-atlas.png';
import * as enemySpriteAtlas from 'assets/tilesets/enemy-atlas.json';
import * as projectileAtlas from 'assets/tilesets/projectile-atlas.json';
import * as projectileSpriteSheet from 'assets/tilesets/projectile-atlas.png';

import * as beams from 'assets/tilesets/beams.png';
import * as beamPickups from 'assets/tilesets/beam-pickups.png';
import * as miscPickups from 'assets/tilesets/misc-pickups.png';

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
    this.load.image("creotur", creotur);
    this.load
      .atlas('player', playerSpriteSheet, playerSpriteAtlas)
      .atlas('enemies', enemySpriteSheet, enemySpriteAtlas)
      .atlas('projectiles', projectileSpriteSheet, projectileAtlas)
      .spritesheet('axan', axanTiles, { frameWidth: 16, frameHeight: 16 })
      .spritesheet('doors-vert', doorsTiles, { frameWidth: 16, frameHeight: 48 })
      .spritesheet('doors-horiz', doorsHorizTiles, { frameWidth: 48, frameHeight: 16 })
      .spritesheet('beams', beams, { frameWidth: 16, frameHeight: 16 })
      .spritesheet('beam-pickups', beamPickups, { frameWidth: 16, frameHeight: 16 })
      .spritesheet('misc-pickups', miscPickups, { frameWidth: 16, frameHeight: 16 })
      .bitmapFont('mario-font', marioFontPng, marioFont)
  }

  create() {
    this.scene.start('MainScene');
  }
}
