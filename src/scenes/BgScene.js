import 'phaser'

export default class BgScene extends Phaser.Scene {
  constructor() {
    super('BgScene');
  }

  preload() {
    // Bg layer
    this.load.image('sky', 'assets/backgrounds/sky.png');
  }

  create() {
    // Background
    this.add.image(-160, 0, 'sky').setOrigin(0).setScale(.5);
  }
}
