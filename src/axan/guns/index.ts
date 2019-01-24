import { Gun } from './gun';
import { Pistol } from './pistol';
import { Smg } from './smg';
// import { Shotgun } from './shotgun';
// import { DualPistol } from './dualpistol';
// import { Minigun } from './minigun';
// import { GrenadeLauncher } from './grenadelauncher';
// import { RocketLauncher } from './rocketlauncher';
// import { Revolver } from './revolver';
// import { FryingPan } from './fryingpan';
// import { Mines } from './mines';
// import { DiscGun } from './discgun';
// import { Flamethrower } from './flamethrower';
// import { LaserGun } from './lasergun';

export const DefaultGun = Pistol;

export const guns: Array<typeof Gun> = [
  Pistol,
  // Revolver,
  // DualPistol,
  Smg,
  // Shotgun,
  // Minigun,
  // GrenadeLauncher,
  // RocketLauncher,
  // FryingPan,
  // Mines,
  // DiscGun,
  // Flamethrower,
  // LaserGun
];

export * from './gun';
export * from './gun-factory';
export * from './pistol';
export * from './smg';
// export * from './minigun';
// export * from './shotgun';
// export * from './dualpistol';
