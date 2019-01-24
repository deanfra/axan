import { Room } from ".";

export class SmallRoom extends Room {
  constructor(room, scene) {
    super(room, scene);
    this.type = "small";
  }

  instantiatePlatforms() {
    return
  }
}