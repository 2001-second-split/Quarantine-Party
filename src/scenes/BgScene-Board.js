import 'phaser';

export default class BgSceneBoard extends Phaser.Scene {
  constructor() {
    super('BgSceneBoard');
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITE HERE >>
    this.load.image('sky', 'assets/backgrounds/sky.png');
    // this.load.image('logo', 'assets/backgrounds/fullBlastLogo.png')
  }

  create() {
    // Create Sprites
    // << CREATE SPRITE HERE >>
    this.add.image(-160, 0, 'sky').setOrigin(0).setScale(.5);
    // this.add.image(380,80,'logo').setScale(5)
  }
}
