import { Beam } from "./beams";

export default class Inventory {
  activeBeam: string = "LASER";
  beams: string[] = ["LASER"];
  health: number = 100;
  maxHealth: number = 100;

  addBeam(beam: Beam) {
    if(this.beams.indexOf(beam.name) === -1){
      this.beams.push(beam.name);
    }
    console.log(this.beams)
  }

  heal(amount: number = 0) {
    if ((this.health+amount) < this.maxHealth) {
      this.health += amount;
    } else {
      this.health = this.maxHealth;
    }
  }

  hurt(amount: number = 0) {
    if (this.health > amount) {
      this.health -= amount;
    } else {
      this.health = 0;
    }
  }
}