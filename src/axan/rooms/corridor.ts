import { Room } from "./room";

export class Corridor extends Room {
  constructor(room, scene) {
    super(room, scene);
    this.type = "corridor";
  }

  instantiatePlatforms() {
    return
  }

}