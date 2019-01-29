export default class DoorGate extends Phaser.GameObjects.Sprite {
  playerCollider: Phaser.Physics.Arcade.Collider;
  tilekey: string;

  constructor(scene, x, y, doorTile) {
    const orientation = doorTile.clearance.dir;
    const tilekey = orientation === "n" || orientation === "s" ? "horiz" : "vert";
    super(scene, x, y, "doors-"+tilekey);

    this.tilekey = tilekey;
    this.angle = { n: 0, e: 0, s: 180, w: 180 }[doorTile.clearance.dir];
    scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);
    scene.physics.add.collider(this, scene.enemyGroup);
    this.playerCollider = scene.physics.add.collider(this, scene.player);
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
