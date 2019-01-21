// MOVE THIS FILE AND IMAGES INTO THE PLAYER FOLDER
// it would be good to make all things folderised like modules

export default function (scene): void {
  [
    {
      key: 'begin',
      frameRate: 1,
      repeat: 0,
      frames: scene.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'begin', zeroPad: 2 })
    },
    {
      key: 'run',
      frameRate: 15,
      repeat: -1,
      frames: scene.anims.generateFrameNames('player', { start: 0, end: 8, prefix: 'run', zeroPad: 2 })
    },
    {
      key: 'run-aim',
      frameRate: 15,
      repeat: -1,
      frames: scene.anims.generateFrameNames('player', { start: 0, end: 9, prefix: 'run-aim', zeroPad: 2 })
    },
    {
      key: 'run-aim-up',
      frameRate: 15,
      repeat: -1,
      frames: scene.anims.generateFrameNames('player', { start: 0, end: 9, prefix: 'run-aim-up', zeroPad: 2 })
    },
    {
      key: 'run-aim-down',
      frameRate: 15,
      repeat: -1,
      frames: scene.anims.generateFrameNames('player', { start: 0, end: 9, prefix: 'run-aim-down', zeroPad: 2 })
    },
    {
      key: 'stand',
      frameRate: 4,
      repeat: -1,
      frames: scene.anims.generateFrameNames('player', { start: 0, end: 3, prefix: 'breathe', zeroPad: 2 })
    },
    {
      key: 'crouch',
      frameRate: 20,
      repeat: 0,
      frames: scene.anims.generateFrameNames('player', { start: 0, end: 3, prefix: 'crouch', zeroPad: 2 })
    },
    {
      key: 'jump-up',
      frameRate: 20,
      repeat: 0,
      frames: scene.anims.generateFrameNames('player', { start: 0, end: 2, prefix: 'jump', zeroPad: 2 })
    },
    {
      key: 'jump-down',
      frameRate: 15,
      repeat: 0,
      frames: scene.anims.generateFrameNames('player', { start: 2, end: 5, prefix: 'jump', zeroPad: 2 })
    },
    {
      key: 'jump-aim-up',
      frameRate: 1,
      repeat: 0,
      frames: scene.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'jump-aim-up', zeroPad: 2 })
    },
    {
      key: 'jump-aim-up-fwd',
      frameRate: 1,
      repeat: 0,
      frames: scene.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'jump-aim-up-fwd', zeroPad: 2 })
    },
    {
      key: 'jump-aim-down',
      frameRate: 1,
      repeat: 0,
      frames: scene.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'jump-aim-down', zeroPad: 2 })
    },
    {
      key: 'jump-aim-down-fwd',
      frameRate: 1,
      repeat: 0,
      frames: scene.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'jump-aim-down-fwd', zeroPad: 2 })
    }
  ].forEach(anim => scene.anims.create(anim))
}