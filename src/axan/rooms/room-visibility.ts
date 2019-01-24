export default class RoomVisibility {
  shadowLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  scene: any;

  constructor(shadowLayer, scene) {
    this.shadowLayer = shadowLayer;
    this.scene = scene;
  }

  checkActiveRoom(room) {
    // We only need to update the tiles if the active room has changed
    if (room !== this.scene.activeRoom) {
      room.setup();
      this.setRoomAlpha(room, 0); // Make the new room visible
      if (this.scene.activeRoom) this.setRoomAlpha(this.scene.activeRoom, 0.8); // Dim the old room
      // this.scene.cameraConstrainTo(room);
      this.scene.activeRoom = room;
      this.scene.background.setup();
    }
  }

  // Helper to set the alpha on all tiles within a room
  setRoomAlpha(room, alpha) {
    this.shadowLayer.forEachTile(
      t => (t.alpha = alpha),
      this,
      room.x,
      room.y,
      room.width,
      room.height
    );
  }
}
