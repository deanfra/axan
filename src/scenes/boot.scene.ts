import * as crateriaSprite from 'assets/tilesets/crateria.png';
import * as crateria from 'assets/tilesets/crateria.png';
import * as caves from 'assets/tilesets/caves.png';
import * as axanTiles from 'assets/tilesets/16x16-crateria.png';
import * as enemySprite from 'assets/tilesets/enemies.png';
import * as playerSpriteSheet from 'assets/tilesets/player-atlas.png';
import * as playerSpriteAtlas from 'assets/tilesets/player-atlas.json';

import * as projectiles from 'assets/tilesets/projectiles.png';
import * as guns from 'assets/tilesets/guns.png';
import * as beams from 'assets/tilesets/beams.png';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    this.load.image("caves", caves);
    this.load.image("crateria", crateria);
    this.load
      .atlas('player', playerSpriteSheet, playerSpriteAtlas)
      .spritesheet('axan', axanTiles, { frameWidth: 64, frameHeight: 64 })
      .spritesheet('crateriaSprite', crateriaSprite, { frameWidth: 256, frameHeight: 193 })
      .spritesheet('enemies', enemySprite, { frameWidth: 20, frameHeight: 20 })
      .spritesheet('projectiles', projectiles, { frameWidth: 16, frameHeight: 16 })
      .spritesheet('guns', guns, { frameWidth: 16, frameHeight: 16 })
      .spritesheet('beams', beams, { frameWidth: 16, frameHeight: 16 })
  }

  create() {
    this.scene.start('DungeonScene');
  }
}
