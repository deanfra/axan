export default function (scene): void {
  [
    {
      key: 'stand',
      repeat: -1,
      frameRate: 4,
      yoyo: true,
      defaultTextureKey: 'player',
      frames: scene.anims.generateFrameNames('player', { start: 0, end: 3 })
    }, {
      key: 'begin',
      defaultTextureKey: 'player',
      frames: scene.anims.generateFrameNames('player', { start: 4, end: 4 })
    }, {
      key: 'crouch',
      repeat: 0,
      frameRate: 20,
      defaultTextureKey: 'player',
      frames: scene.anims.generateFrameNames('player', { start: 5, end: 6 })
    }, {
      key: 'run',
      defaultTextureKey: 'player',
      repeat: -1,
      frameRate: 15,
      frames: scene.anims.generateFrameNames('player', { start: 10, end: 19 })
    }, {
      key: 'jump-up',
      defaultTextureKey: 'player',
      repeat: 0,
      frameRate: 20,
      frames: scene.anims.generateFrameNames('player', { start: 20, end: 21 })
    }, {
      key: 'jump-down',
      defaultTextureKey: 'player',
      repeat: 0,
      frameRate: 15,
      frames: scene.anims.generateFrameNames('player', { start: 22, end: 25 })
    }
  ].forEach(anim => scene.anims.create(anim))
}