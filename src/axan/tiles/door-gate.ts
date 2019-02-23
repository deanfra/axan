export default class DoorGate extends Phaser.GameObjects.Sprite {
  tilekey: string;
  isClosed: boolean;

  constructor(scene, x, y, door) {
    super(scene, x, y, "door-gates");

    this.depth = 10;
    this.isClosed = true;
    this.angle = { n: -90, e:0, s: 90, w: 180 }[door.clearance.dir];
    scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);
    this.play("door-closed");
    this.setOffset(door.clearance);
  }

  setOffset(clearance) {
    const _thisdoor = this as any;
    _thisdoor.setCrop(16, 0, 16, 48); // missing fn in TS def
    

    if (clearance.dir === "s") {
      this.body.width = 48;
      this.body.height = 32;
      this.y -= 8;
      this.body.setOffset(-8, 0);
    } else if (clearance.dir === "n") {
      this.body.width = 48;
      this.body.height = 32;
      this.y += 8;
      this.body.setOffset(-8, 16);
    } else if (clearance.dir === "w") {
      this.body.setOffset(8, 0);
      this.x += 8;
    } else if (clearance.dir === "e") {
      this.body.setOffset(-8, 0);
      this.x -= 8;
    }

  }

  open() {
    this.play("door-open");
    this.isClosed = false;

    this.scene.time.addEvent({
      delay: 100,
      callbackScope: this,
      callback() {
        this.body.enable = false;
      }
    });
  }

  shut() {
    if (this.isClosed) {
      this.play("door-closed");
    } else {
      this.isClosed = true;
      this.play("door-close");
      this.body.enable = true;
    }
  }
}
