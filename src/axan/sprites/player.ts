import { DungeonScene } from '../../scenes/dungeon.scene';
import { Gun, GunFactory } from './guns';
import Room from "../room";
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
  knockback = 0;

  // timers
  jumpTimer = 0;
  shootTimer = 0;

  // states
  isShooting = false;
  isJumping = false;
  isFalling = false;
  public isCrouching = false;

  constructor(scene, x, y, key, layer) {
    super(scene, x, y, key);
    this.scene.physics.world.enable(this);
    this.scene.physics.add.collider(this, layer);
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

    // crouch walking
    // if (this.inputs.down && (this.keys.left.isDown || this.keys.right.isDown)) {
    //   this.body.setSize(16, 30)
    // } else {
    //   this.body.setSize(16, 40)
    // }
    
    if (this.body.onFloor() && this.isFalling) {
      this.isFalling = false;
    }
    this.isFalling = this.body.velocity.y > 50;
    this.isCrouching = (this.body.onFloor() && this.inputs.down)

    this.animation();
    this.controls(delta);
    this.updateGun(time, delta);

    const playerRoom = this.getCurrentRoom();
    this.scene.roomVisibility.checkActiveRoom(playerRoom);
    if(this.inputs.down) {
      this.body.setSize(16, 30);
    } else {
      this.body.setSize(16, 43);
    }
  }

  getCurrentRoom(): Room {
    // Find the player's room using another helper method from the dungeon that converts from
    // dungeon XY (in grid units) to the corresponding room instance
    const playerTileX = this.scene.groundLayer.worldToTileX(this.x);
    const playerTileY = this.scene.groundLayer.worldToTileY(this.y);
    const roomInstance = this.scene.rooms.dungeonInstance.getRoomAt(playerTileX, playerTileY);
    return this.scene.rooms.byId(roomInstance.id);
  }

  animation() {
    let anim: string;
    const leftOrRight = (this.inputs.left || this.inputs.right);

    // airborne
    if (!this.body.onFloor()) {
      if (this.inputs.down && leftOrRight) {
        anim = 'jump-aim-down-fwd';
      } else if (this.inputs.up && leftOrRight) {
        anim = 'jump-aim-up-fwd';
      } else if (this.inputs.up) {
        anim = 'jump-aim-up';
      } else if (this.inputs.down) {
        anim = 'jump-aim-down';
      } else if (this.body.velocity.y <= 0) {
        anim = 'jump-up';
      } else if (this.body.velocity.y > 0) {
        anim = 'jump-down';
      }
    // running
    } else if (this.body.velocity.x !== 0 && (this.inputs.left || this.inputs.right)) {
      if (this.inputs.down) {
        anim = 'run-aim-down';
      } else if (this.inputs.up) {
        anim = 'run-aim-up';
      } else {
        anim = 'run';
      }
    // crouching
    } else if (this.body.onFloor() && this.body.velocity.x === 0 && this.inputs.down) {
      anim = 'crouch';
    } else if (this.inputs.up) {
      anim = 'stand-aim-up';
    } else if (!this.hasMoved) {
      anim = 'begin';
    } else {
      anim = 'stand';
    }

    if (this.anims.getCurrentKey() !== anim) {
      console.log(anim)        
      try {
        this.anims.play(anim);
      } catch {
        console.error("Error playing "+ anim);
      }
    }

  }

  controls(delta: number): void {
    if (this.inputs.shoot) {
      this.hasMoved = true;
      if (this.gun.shootTimer > this.gun.cooldown) {
        this.knockback = this.shoot();
        if (!this.knockback) {
          this.knockback = 0;
        }
      }
    } else {
      this.gun.unShoot();
      this.knockback = 0;
    }

    if (this.inputs.left && !this.inputs.right) {
      this.hasMoved = true;
      this.body.setVelocityX(-this.runSpeed + this.knockback);
      this.flipX = true;
    } else if (this.inputs.right && !this.inputs.left) {
      this.hasMoved = true;
      this.body.setVelocityX(this.runSpeed + this.knockback);
      this.flipX = false;
    } else {
      this.body.setVelocityX(this.knockback);
    }

    if (this.inputs.jump) {
      this.hasMoved = true;
      if (this.body.onFloor() && this.jumpTimer === 0) {
        this.jumpTimer = 1;
        this.body.setVelocityY(-150);
      } else if (this.jumpTimer > 0 && this.jumpTimer < 301 && !this.body.onCeiling()) {
        this.jumpTimer += delta;
        this.body.setVelocityY(-160);
      } else if (this.body.onCeiling()) {
        this.jumpTimer = 301;
      }
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

  shoot(): number {
    return this.gun.shoot();
  }
}
