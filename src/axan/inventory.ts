import BeamPickup from "./pickups/beam-pickup";
import SuitPickup from "./pickups/suit-pickup";
import MainScene from "./main.scene";

export default class Inventory {
  scene: MainScene;
  
  activeBeam: string = "LASER";
  beams: string[] = ["LASER"];
  suit: string[] = [];
  
  health: number = 100;
  maxHealth: number = 100;
  hiJump: boolean = false;
  wallJump: boolean = false;
  dash: boolean = false;

  constructor(scene) {
    this.scene = scene;
  }

  suitUpgrade(suitPickup: SuitPickup) {
    if(suitPickup.name === "HIJUMPBOOTS") {
      this.hiJump = true;
      this.suit.push(suitPickup.name);
    } else if(suitPickup.name === "WALLJUMPBOOTS") {
      this.wallJump = true;
      this.suit.push(suitPickup.name);
    } else if(suitPickup.name === "DASHBOOTS") {
      this.dash = true;
      this.suit.push(suitPickup.name);
    } else if(suitPickup.name === "HEALTHTANK") {
      this.maxHealth += 100;
      this.heal(100);
    }
  }

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
    this.scene.healthText.setText(this.health.toString());
  }

  hurt(amount: number = 0) {
    if (this.health > amount) {
      this.health -= amount;
    } else {
      this.health = 0;
    }

    this.scene.healthText.setText(this.health.toString());
  }
}