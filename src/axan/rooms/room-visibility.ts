import { Room } from "./room";
import Background from "../background";
import { DungeonScene } from "../../scenes/dungeon.scene";

export default class RoomVisibility {
  shadowLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  scene: DungeonScene;

  constructor(shadowLayer, scene) {
    this.shadowLayer = shadowLayer;
    this.scene = scene;
  }

  checkActiveRoom(room: Room) {
    const { activeRoom } = this.scene;
    // We only need to update the tiles if the active room has changed
    if (room !== activeRoom) {
      room.setup();
      this.setRoomAlpha(room, 0); // Make the new room visible
      this.setRoomAlpha(activeRoom, 0.8); // Dim the old room
      room.movePlayerIntoRoom(activeRoom);
      
      // this.scene.cameraConstrainTo(room);
      this.scene.activeRoom = room;

      this.scene.backgroundGroup.children.entries.forEach(
        (background: Background) => background.setup(), this
      );
    }
  }

  // Helper to set the alpha on all tiles within a room
  setRoomAlpha(room, alpha) {
    if(room) {
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
}
