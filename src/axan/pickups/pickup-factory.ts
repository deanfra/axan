import Pickup from "./pickup";
import SuitPickup from "../pickups/suit-pickup";
import BeamPickup from "../pickups/beam-pickup";
import * as _ from "lodash";

const beamLib: Array<string> = ["QUANTUM", "LASER", "RANG", "ICE", "FIRE"];
const suitLib: Array<string> = ["HIJUMPBOOTS", "DASHBOOTS", "WALLJUMPBOOTS", "HEALTHTANK"];

export default class PickupFactory {
  static createRandomPickup(scene, worldX: number, worldY: number): Pickup | null {
    // Difference will filter out items in inventory
    const inventoryItems = [...scene.inventory.beams, ...scene.inventory.suit];
    const pickupArray = _.difference(beamLib.concat(suitLib), inventoryItems);
    const randPickup = _.sample(pickupArray);
    const pickupFrame = {
      HEALTHTANK: "health-upgrade",
      HIJUMPBOOTS: "hi-jump-boots",
      WALLJUMPBOOTS: "wall-jump-boots",
      DASHBOOTS: "dash-boots",
      QUANTUM: "plasma",
      RANG: "wave",
      ICE: "ice",
      FIRE: "spazer",
      LASER: "charge",
    }[randPickup];

    if (randPickup) {
      let pickupInstance;
      if (beamLib.indexOf(randPickup) > -1) {
        pickupInstance = new BeamPickup(scene, worldX, worldY, "beam-pickups");
      } else if (suitLib.indexOf(randPickup) > -1) {
        pickupInstance = new SuitPickup(scene, worldX, worldY, "beam-pickups");
      }

      pickupInstance.name = randPickup;
      pickupInstance.play(pickupFrame);

      this.enablePickupInWorld(pickupInstance, scene);
      this.placePickupHolder(scene, worldX, worldY);

      return pickupInstance;
    } else {
      return null;
    }
  }

  static placePickupHolder(scene, x: number, y: number) {
    const pickupHolder = scene.add.sprite(x, y + 16, "pickups");
    pickupHolder.depth = 3;

    scene.physics.world.enable(pickupHolder, Phaser.Physics.Arcade.STATIC_BODY);
    scene.physics.add.collider(scene.player, pickupHolder);
    pickupHolder.play("pickup-holder");
  }

  static enablePickupInWorld(pickup, scene) {
    scene.pickupGroup.add(pickup, true);
    scene.physics.world.enable(pickup, Phaser.Physics.Arcade.STATIC_BODY);
  }
}
