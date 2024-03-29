import { Beam } from "./beam";
import { Laser } from "./laser";
import { Quantum } from "./quantum";
import { Rang } from "./rang";
import { Ice } from "./ice";
import { Fire } from "./fire";
// import { Shotbeam } from './shotbeam';
// import { DualPistol } from './dualpistol';
// import { Minibeam } from './minibeam';
// import { GrenadeLauncher } from './grenadelauncher';
// import { RocketLauncher } from './rocketlauncher';
// import { Revolver } from './revolver';
// import { FryingPan } from './fryingpan';
// import { Mines } from './mines';
// import { DiscBeam } from './discbeam';
// import { Flamethrower } from './flamethrower';
// import { LaserBeam } from './laserbeam';

export const DefaultBeam = Laser;

export const beams: Array<typeof Beam> = [
  Laser,
  Quantum,
  Rang,
  Ice,
  Fire,
  // Revolver,
  // DualLaser,
  // Shotbeam,
  // Minibeam,
  // GrenadeLauncher,
  // RocketLauncher,
  // FryingPan,
  // Mines,
  // DiscBeam,
  // Flamethrower,
  // LaserBeam
];

export * from "./beam";
export * from "./beam-factory";
export * from "./laser";
export * from "./quantum";
export * from "./rang";
export * from "./ice";
export * from "./fire";
// export * from './minibeam';
// export * from './shotbeam';
// export * from './dualpistol';
