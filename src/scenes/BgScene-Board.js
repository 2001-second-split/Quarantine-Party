import 'phaser';

export default class BgSceneBoard extends Phaser.Scene {
  constructor() {
    super('BgSceneBoard');
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITE HERE >>
    this.load.image('board', 'assets/backgrounds/board.png');
    // this.load.image('logo', 'assets/backgrounds/fullBlastLogo.png')
  }

  create() {
    // Create Sprites
    // << CREATE SPRITE HERE >>
    this.add.image(-160, 0, 'board').setOrigin(0).setScale(.25);
    // this.add.image(380,80,'logo').setScale(5)
  }
}
