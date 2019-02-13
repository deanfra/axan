import MainScene from './main.scene';
import Pickup from './pickups/pickup';
import BeamPickup from './pickups/beam-pickup';
import SuitPickup from './pickups/suit-pickup';
import { Beam, BeamFactory } from './beams';
import { Room } from "./rooms/";
import Inventory from "./inventory";
import createPlayerAnimations from './player-animations';
import { Enemy } from './enemies';

interface Keys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
  c: Phaser.Input.Keyboard.Key;
  x: Phaser.Input.Keyboard.Key;
  z: Phaser.Input.Keyboard.Key;
}

export default class Player extends Phaser.GameObjects.Sprite {
  private inventory: Inventory;
  // input keys
  private hasMoved: boolean = false;
  private canMove: boolean = true;
  private keys: Keys;
  public body: Phaser.Physics.Arcade.Body;
  public scene: MainScene;
  private beam: Beam;

  public inputs: { [key: string]: boolean };

  // factors
  private runSpeed = 150;
  private dashSpeed = 0;
  private knockbackX = 0;
  private knockbackY = 0;

  // timers
  private jumpTimer = 0;
  private animTimer = 0;
  private switchWeaponTimer = 0;
  private hurtCooldown = 900;

  // states
  public isJumping = false;
  private isFalling = false;
  public isMoving = false;
  public isCrouching = false;
  public isRunning = false;
  private isDashing = false;
  private canHurt = true;
  
  
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.setOrigin(0.5, .8);
    this.scene.physics.world.enable(this);
    this.inventory = scene.inventory;
    
    this.setDepth(10);

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      c: Phaser.Input.Keyboard.KeyCodes.C,
      x: Phaser.Input.Keyboard.KeyCodes.X,
      z: Phaser.Input.Keyboard.KeyCodes.Z,
    }) as Keys;

    // world / pickups hit detection
    this.scene.physics.add.overlap(
      this.scene.pickupGroup,
      this,
      (pickup: Pickup) => {
        this.pickupGet(pickup);
      }, undefined, this);


    createPlayerAnimations(this.scene)
    this.resetBeam(this.x, this.y);
  }

  update(time: number, delta: number): void {
    this.inputs = {
      up: this.keys.up.isDown,
      down: this.keys.down.isDown,
      left: this.keys.left.isDown,
      right: this.keys.right.isDown,
      jump: this.keys.space.isDown,
      dash: this.keys.c.isDown,
      shoot: this.keys.x.isDown,
      cycleWeapon: this.keys.z.isDown,
    };

    if (this.body.onFloor() && this.isFalling) {
      this.isFalling = false;
    }
    const leftOrRight = (this.inputs.left || this.inputs.right);

    this.isFalling = this.body.velocity.y > 50;
    this.isCrouching = (this.body.onFloor() && this.inputs.down)
    this.isMoving = (this.body.velocity.x !== 0 && leftOrRight);
    this.isRunning = (this.body.onFloor() && this.isMoving)

    this.animation();
    this.controls(delta);
    this.updateBeam(time, delta);

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

  animation(): void {
    // Run on every second frame, prevents crazy jitters
    const {left, right, up, down} = this.inputs;
    let anim: string;
    this.animTimer = (this.animTimer === 3) ? 0 : this.animTimer+1;

    if (this.isRunning) {
      // run
      this.isJumping = false;
      if (down) {
        anim = 'crouch-run';
      } else if (up) {
        anim = 'run-aim-up';
      } else {
        anim = 'run';
      }
    } else if (this.body.onFloor() && this.body.velocity.x === 0) {
      // crouching
      this.isJumping = false;
      if(down) {
        anim = 'crouch';
      } else if (up) {
        anim = 'stand-aim-up';
      } else if (!this.hasMoved) {
        anim = 'begin';
      } else {
        anim = 'stand';
      }
    } else if (!this.body.onFloor() && this.isJumping) {
      // airborne
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
    } 

    if (anim && this.anims.getCurrentKey() !== anim) {
      try {
        this.anims.play(anim);
      } catch {
        console.error("Error playing "+ anim);
      }
    }

    let tileYSize: number = (down) ? 30 : (up) ? 54 : 43;
    this.setSizeWithOffset(16, tileYSize[1]);
  }

  controls(delta: number): void {
    const { left, right, up, down, shoot, jump, cycleWeapon, dash } = this.inputs;

    if(!this.canMove) { return; }

    if (this.body.onCeiling() && this.body.onFloor()) {
      console.log('----------------- JAMMED')
    }

    if (shoot) {
      this.hasMoved = true;
      if (this.beam.shootTimer > this.beam.cooldown) {
        this.shoot();
      }
    } else {
      this.beam.unShoot();
    }

    this.dashSpeed = (dash) ? 150 : 0;

    if(cycleWeapon) {
      this.nextBeam();
    }

    if (left && !right) {
      this.hasMoved = true;
      this.body.setVelocityX(-this.runSpeed + this.knockbackX + -this.dashSpeed);
      this.flipX = true;
    } else if (right && !left) {
      this.hasMoved = true;
      this.body.setVelocityX(this.runSpeed + this.knockbackX + this.dashSpeed);
      this.flipX = false;
    } else {
      this.body.setVelocityX(0 + this.knockbackX);
    }

    if (jump) {
      this.jump(delta);
    } else {
      this.body.setVelocityY(this.body.velocity.y + this.knockbackY);
      this.jumpTimer = 0;
    }
  }

  jump(delta: number): void {
    // const { left, right, up, down, shoot } = this.inputs;

    const hiJumpVelocity = (this.inventory.hiJump) ? -100 : 0;
    const hiJumpTimer = (this.inventory.hiJump) ? 100 : 0;

    // Floor jump
    if (this.body.onFloor() && this.jumpTimer === 0) {
      this.jumpTimer = 1;
      this.body.setVelocityY(-150 + hiJumpVelocity);
      this.isJumping = true;

    // Jump rising
    } else if (this.jumpTimer > 0 && this.jumpTimer < (301 + hiJumpTimer) && !this.body.onCeiling()) {
      this.jumpTimer += delta;
      this.body.setVelocityY(-160 + hiJumpVelocity);

    // Jump fall
    } else if (this.body.onCeiling()) {
      this.jumpTimer = (301 + hiJumpTimer);
    }
  }

  wallJump(delta: number) {

  }
  


      // this.scene.time.addEvent({
      //   delay: 80,
      //   callbackScope: this,
      //   callback() {
      //     this.knockbackX = 0;
      //     this.knockbackY = 0;
      //   }
      // });


  pickupGet(pickup: Pickup): void {
    if (pickup instanceof BeamPickup) {
      this.scene.inventory.addBeam(pickup);
      this.changeBeam(pickup.name);
    } else if (pickup instanceof SuitPickup) {
      this.scene.inventory.suitUpgrade(pickup);
    }
    pickup.destroy();
  }

  nextBeam() {
    if (this.switchWeaponTimer === 0) {
      const nextBeam = this.scene.inventory.nextBeam();
      this.changeBeam(nextBeam);
      this.switchWeaponTimer = 1;
      
      this.scene.time.addEvent({
        delay: 300,
        callbackScope: this,
        callback() {
          this.switchWeaponTimer = 0;
        }
      });
    }
  }

  updateBeam(time, delta): void {
    this.beam.update(time, delta);
  }

  changeBeam(beamName): void {
    this.beam.destroy();
    this.beam = BeamFactory.createBeam(beamName, this.scene, this.x, this.y);
    this.scene.inventory.activeBeam = this.beam.label;
    this.scene.inventoryText.setText(this.beam.label + " BEAM");
    this.scene.add.existing(this.beam);
  }

  resetBeam(x, y): void {
    if (this.beam) {
      this.beam.preDestroy();
      this.beam.destroy();
    }

    this.beam = BeamFactory.createBeam(this.scene.inventory.activeBeam, this.scene, x + 16, y);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this.beam);
  }

  shoot() {
    this.beam.shoot();
  }

  die() {
    this.canMove = false;
    this.body.stop();
  }

  enemyHurtPlayer = (player, enemy: Enemy) => {
    if (this.canHurt && !enemy.isFrozen) {
      this.canHurt = false;
      this.setTint(Phaser.Display.Color.GetColor(255, 0, 0));
      this.inventory.hurt(enemy.damage);
      this.hurtKnockback(enemy);

      if (this.inventory.health < 1) {
        this.die();
      }

      // Red tint timer
      this.scene.time.addEvent({
        delay: 200,
        callbackScope: this,
        callback() {
          this.setTint(Phaser.Display.Color.GetColor(255, 255, 255));
        }
      });
      // Invincible timer
      this.scene.time.addEvent({
        delay: this.hurtCooldown,
        callbackScope: this,
        callback() {
          this.canHurt = true;
        }
      });

    }
  }

  hurtKnockback(enemy): void {
    const fromLeft = (enemy.x - this.x) > 1;
    const fromBottom = (enemy.y - this.y) > 1;

    this.knockbackX = (fromLeft) ? -300 : 300;
    this.knockbackY = (fromBottom) ? -70 : 50;

    this.scene.time.addEvent({
      delay: 80,
      callbackScope: this,
      callback() {
        this.knockbackX = 0;
        this.knockbackY = 0;
      }
    });

  }

}
