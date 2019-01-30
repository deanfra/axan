import { DungeonScene } from '../scenes/dungeon.scene';
import { Gun, GunFactory } from './guns';
import { Room } from "./rooms/";
import createPlayerAnimations from './player-animations';

interface Keys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
  x: Phaser.Input.Keyboard.Key;
}

export default class Player extends Phaser.GameObjects.Sprite {
  // input keys
  private hasMoved: boolean;
  private keys: Keys;
  public body: Phaser.Physics.Arcade.Body;
  public scene: DungeonScene;
  private gun: Gun;

  inputs: { [key: string]: boolean };

  // factors
  runSpeed = 150;

  // timers
  jumpTimer = 0;
  shootTimer = 0;
  animTimer = 0;

  // states
  isShooting = false;
  isJumping = false;
  isFalling = false;
  public isMoving = false;
  public isCrouching = false;
  public isRunning = false;

  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.setOrigin(0.5, .8);
    this.scene.physics.world.enable(this);
    
    this.setDepth(10);

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      x: Phaser.Input.Keyboard.KeyCodes.X,
    }) as Keys;

    createPlayerAnimations(this.scene)
    this.resetGun(this.x, this.y);
  }

  update(time: number, delta: number): void {
    this.inputs = {
      up: this.keys.up.isDown,
      down: this.keys.down.isDown,
      left: this.keys.left.isDown,
      right: this.keys.right.isDown,
      jump: this.keys.space.isDown,
      shoot: this.keys.x.isDown
    };

    if (this.body.onFloor() && this.isFalling) {
      this.isFalling = false;
    }
    const leftOrRight = (this.inputs.left || this.inputs.right);

    this.isFalling = this.body.velocity.y > 50;
    this.isCrouching = (this.body.onFloor() && this.inputs.down)
    this.isMoving = (this.body.velocity.x !== 0 && leftOrRight);
    this.isRunning = (this.body.onFloor() && this.isMoving)
    this.isJumping = !this.body.onFloor();

    this.animation();
    this.controls(delta);
    this.updateGun(time, delta);

    const playerRoom = this.getCurrentRoom();
    this.scene.roomVisibility.checkActiveRoom(playerRoom);

  }

  setSizeWithOffset(newX, newY) {
    this.body.setSize(newX, newY)
    this.body.setOffset(4, 0);
    this.setOrigin(0.5, 1);
  }

  getCurrentRoom(): Room {
    // Find the player's room using another helper method from the dungeon that converts from
    // dungeon XY (in grid units) to the corresponding room instance
    const playerTileX = this.scene.groundLayer.worldToTileX(this.x);
    const playerTileY = this.scene.groundLayer.worldToTileY(this.y);
    const roomInstance = this.scene.level.dungeonInstance.getRoomAt(playerTileX, playerTileY);
    return this.scene.level.byId(roomInstance.id);
  }

  animation() {
    // Run on every second frame, prevents crazy jitters
    const {left, right, up, down} = this.inputs;
    let anim: string;
    let tileSize: Array<number> = [16, 43];
    this.animTimer = (this.animTimer === 3) ? 0 : this.animTimer+1;

    // airborne
    if (!this.body.onFloor()) {
      if (down && (left || right)) {
        anim = 'jump-aim-down-fwd';
      } else if (up && (left || right)) {
        anim = 'jump-aim-up-fwd';
      } else if (up) {
        anim = 'jump-aim-up';
      } else if (down) {
        anim = 'jump-aim-down';
      } else if (this.body.velocity.y <= 0) {
        anim = 'jump-up';
      } else if (this.body.velocity.y > 80) {
        anim = 'jump-down';
      }
    // running
    } else if (this.body.velocity.x !== 0 && (left || right)) {
      if (down) {
        tileSize = [16, 28];
        anim = 'run-aim-down';
      } else if (up) {
        tileSize = [16, 54];
        anim = 'run-aim-up';
      } else {
        anim = 'run';
      }
    // crouching
    } else if (this.body.velocity.x === 0) {
      if(down) {
        tileSize = [16, 28];
        anim = 'crouch';
      } else if (up) {
        tileSize = [16, 54];
        anim = 'stand-aim-up';
      } else if (!this.hasMoved) {
        anim = 'begin';
      } else {
        anim = 'stand';
      }
    }
    

    if (anim && this.anims.getCurrentKey() !== anim) {
      // console.log(anim)
      try {
        this.anims.play(anim);
      } catch {
        console.error("Error playing "+ anim);
      }
    }
    if(down) {
      tileSize = [16, 28];
    }
    this.setSizeWithOffset(tileSize[0], tileSize[1]);
  }

  controls(delta: number): void {
    const { left, right, up, down, shoot, jump } = this.inputs;

    if (this.body.onCeiling() && this.body.onFloor()) {
      console.log('----------------- JAMMED')
    }

    if (shoot) {
      this.hasMoved = true;
      if (this.gun.shootTimer > this.gun.cooldown) {
        this.shoot();
      }
    } else {
      this.gun.unShoot();
    }

    if (left && !right) {
      this.hasMoved = true;
      this.body.setVelocityX(-this.runSpeed);
      this.flipX = true;
    } else if (right && !left) {
      this.hasMoved = true;
      this.body.setVelocityX(this.runSpeed);
      this.flipX = false;
    } else {
      this.body.setVelocityX(0);
    }

    if (jump) {
      this.hasMoved = true;
      // if (this.body.onFloor() && this.jumpTimer === 0) {
        this.jumpTimer = 1;
        this.body.setVelocityY(-150);
      // } else if (this.jumpTimer > 0 && this.jumpTimer < 301 && !this.body.onCeiling()) {
      //   this.jumpTimer += delta;
      //   this.body.setVelocityY(-160);
      // } else if (this.body.onCeiling()) {
      //   this.jumpTimer = 301;
      // }
    } else {
      this.jumpTimer = 0;
    }
  }

  jump(): void {
    if (this.body.onFloor() && this.jumpTimer === 0) {
      this.jumpTimer = 1;
      this.body.setVelocityY(-150);
    }
  }

  pickupGet = (pickup: Phaser.GameObjects.Sprite) => {
    this.changeGun(pickup.name);
    pickup.destroy();
  }

  updateGun(time, delta): void {
    this.gun.update(time, delta);
  }

  changeGun(gunName): void {
    this.gun.destroy();
    this.gun = GunFactory.createGun(gunName, this.scene, this.x, this.y);
    this.scene.add.existing(this.gun);
  }

  resetGun(x, y): void {
    if (this.gun) {
      this.gun.preDestroy();
      this.gun.destroy();
    }
    this.gun = GunFactory.createDefaultGun(this.scene, x + 16, y);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this.gun);
  }

  shoot() {
    this.gun.shoot();
  }
}
