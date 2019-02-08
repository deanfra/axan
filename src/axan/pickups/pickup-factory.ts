import Pickup from "./pickup";
import SuitPickup from "../pickups/suit-pickup";
import BeamPickup from "../pickups/beam-pickup";
import * as _ from "lodash";

const beamLib: Array<string> = ["QUANTUM", "LASER", "RANG", "ICE", "FIRE"];
const suitLib: Array<string> = ["HIJUMPBOOTS"];

export default class PickupFactory {

  static randPickup(scene, worldX: number, worldY: number): Pickup | null {
    // Difference will filter out items in inventory
    const inventoryItems = [...scene.inventory.beams, ...scene.inventory.suit];
    const pickupArray = _.difference(beamLib.concat(suitLib), inventoryItems);
    const randPickup = _.sample(pickupArray);
    const pickupFrame = {
      "HIJUMPBOOTS": "hi-jump-boots",
      "QUANTUM": "plasma",
      "RANG": "wave",
      "ICE": "ice",
      "FIRE": "spazer",
      "LASER": "charge",
    }[randPickup];

    if (randPickup) {
      let pickupInstance;
      if (beamLib.indexOf(randPickup) > -1) {
        pickupInstance = new BeamPickup(scene, worldX, worldY, 'beam-pickups')
      } else if (suitLib.indexOf(randPickup) > -1) {
        pickupInstance = new SuitPickup(scene, worldX, worldY, 'beam-pickups')
      }

      pickupInstance.name = randPickup;
      pickupInstance.play(pickupFrame);

      return pickupInstance;
    } else {
      return null;
    }
  }
}

