import * as creoturBgFront from 'assets/tilesets/worlds/creotur/creotur-bg-front.png';
import * as creoturBgMid from 'assets/tilesets/worlds/creotur/creotur-bg-mid.png';
import * as creoturBgBack from 'assets/tilesets/worlds/creotur/creotur-bg-back.png';
import * as creoturOutOfBounds from 'assets/tilesets/worlds/creotur/creotur-out-of-bounds.png';
import * as creoturGroundTiles from 'assets/tilesets/worlds/creotur/creotur-ground-tiles.png';
import * as creoturBackTiles from 'assets/tilesets/worlds/creotur/creotur-back-tiles.png';

import * as lahiriBgFront from 'assets/tilesets/worlds/lahiri/lahiri-bg-front.png';
import * as lahiriBgMid from 'assets/tilesets/worlds/lahiri/lahiri-bg-mid.png';
import * as lahiriBgBack from 'assets/tilesets/worlds/lahiri/lahiri-bg-back.png';
import * as lahiriGroundTiles from 'assets/tilesets/worlds/lahiri/lahiri-ground-tiles.png';
import * as lahiriOutOfBounds from 'assets/tilesets/worlds/lahiri/lahiri-out-of-bounds.png';
import * as lahiriBackTiles from 'assets/tilesets/worlds/lahiri/lahiri-back-tiles.png';

import * as suophusBgFront from 'assets/tilesets/worlds/suophus/suophus-bg-front.png';
import * as suophusBgMid from 'assets/tilesets/worlds/suophus/suophus-bg-mid.png';
import * as suophusBgBack from 'assets/tilesets/worlds/suophus/suophus-bg-back.png';
import * as suophusGroundTiles from 'assets/tilesets/worlds/suophus/suophus-ground-tiles.png';
import * as suophusOutOfBounds from 'assets/tilesets/worlds/suophus/suophus-out-of-bounds.png';
import * as suophusBackTiles from 'assets/tilesets/worlds/suophus/suophus-back-tiles.png';

import * as playerSpriteSheet from 'assets/tilesets/player-atlas.png';
import * as playerSpriteAtlas from 'assets/tilesets/player-atlas.json';
import * as enemySpriteSheet from 'assets/tilesets/enemy-atlas.png';
import * as enemySpriteAtlas from 'assets/tilesets/enemy-atlas.json';
import * as projectileAtlas from 'assets/tilesets/projectile-atlas.json';
import * as projectileSpriteSheet from 'assets/tilesets/projectile-atlas.png';
import * as effectsAtlas from 'assets/tilesets/effects-atlas.json';
import * as effectsSpriteSheet from 'assets/tilesets/effects-atlas.png';
import * as pickupsAtlas from 'assets/tilesets/pickups-atlas.json';
import * as pickupsSpriteSheet from 'assets/tilesets/pickups-atlas.png';
import * as doorsAtlas from 'assets/tilesets/doors-atlas.json';
import * as doorsSpriteSheet from 'assets/tilesets/doors-atlas.png';

import * as beams from 'assets/tilesets/beams.png';
import * as beamPickups from 'assets/tilesets/beam-pickups.png';

import * as marioFontPng from 'assets/fonts/font.png';
import * as marioFont from 'assets/fonts/font.fnt';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    this.load.image("creotur-bg-front", creoturBgFront);
    this.load.image("creotur-bg-mid", creoturBgMid);
    this.load.image("creotur-bg-back", creoturBgBack);
    this.load.image("creotur-out-of-bounds", creoturOutOfBounds);

    this.load.image("lahiri-out-of-bounds", lahiriOutOfBounds);
    this.load.image("lahiri-bg-front", lahiriBgFront);
    this.load.image("lahiri-bg-mid", lahiriBgMid);
    this.load.image("lahiri-bg-back", lahiriBgBack);

    this.load.image("suophus-out-of-bounds", suophusOutOfBounds);
    this.load.image("suophus-bg-front", suophusBgFront);
    this.load.image("suophus-bg-mid", suophusBgMid);
    this.load.image("suophus-bg-back", suophusBgBack);

    this.load
      .atlas('player', playerSpriteSheet, playerSpriteAtlas)
      .atlas('enemies', enemySpriteSheet, enemySpriteAtlas)
      .atlas('projectiles', projectileSpriteSheet, projectileAtlas)
      .atlas('effects', effectsSpriteSheet, effectsAtlas)
      .atlas('pickups', pickupsSpriteSheet, pickupsAtlas)
      .atlas('door-gates', doorsSpriteSheet, doorsAtlas)
      
      .bitmapFont('mario-font', marioFontPng, marioFont)

      // Creotur
      .spritesheet("creotur-ground", creoturGroundTiles, { frameWidth: 16, frameHeight: 16 })
      .spritesheet("creotur-back", creoturBackTiles, { frameWidth: 16, frameHeight: 16 })

      // Lahiri
      .spritesheet("lahiri-ground", lahiriGroundTiles, { frameWidth: 16, frameHeight: 16 })
      .spritesheet("lahiri-back", lahiriBackTiles, { frameWidth: 16, frameHeight: 16 })

      // Suophus
      .spritesheet("suophus-ground", suophusGroundTiles, { frameWidth: 16, frameHeight: 16 })
      .spritesheet("suophus-back", suophusBackTiles, { frameWidth: 16, frameHeight: 16 })

      .spritesheet('beams', beams, { frameWidth: 16, frameHeight: 16 })
      .spritesheet('beam-pickups', beamPickups, { frameWidth: 16, frameHeight: 16 })
  }

  create() {
    this.scene.start('MainScene');
  }
}
