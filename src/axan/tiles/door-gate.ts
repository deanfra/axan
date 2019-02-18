export default class DoorGate extends Phaser.GameObjects.Sprite {
  tilekey: string;

  constructor(scene, x, y, doorTile) {
    const orientation = doorTile.clearance.dir;
    const tilekey = orientation === "n" || orientation === "s" ? "horiz" : "vert";
    super(scene, x, y, "doors-"+tilekey);

    this.depth = 9;
    this.tilekey = tilekey;
    this.angle = { n: 0, e: 0, s: 180, w: 180 }[doorTile.clearance.dir];
    scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);
    this.play("idle-" + tilekey);
  }

  open() {
    this.setAlpha(0);
    this.body.enable = false;
  }

  shut() {
    this.setAlpha(1);
    this.body.enable = true;
  }
}
