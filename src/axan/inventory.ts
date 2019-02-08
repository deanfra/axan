import BeamPickup from "./pickups/beam-pickup";

export default class Inventory {
  activeBeam: string = "LASER";
  beams: string[] = ["LASER"];
  health: number = 100;
  maxHealth: number = 100;

  addBeam(beam: BeamPickup) {
    if(this.beams.indexOf(beam.name) === -1){
      this.beams.push(beam.name);
    }
  }

  nextBeam() {
    const activeIndex = this.beams.indexOf(this.activeBeam);
    const nextBeam = this.beams[activeIndex+1];
    return (nextBeam) ? nextBeam : this.beams[0];
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