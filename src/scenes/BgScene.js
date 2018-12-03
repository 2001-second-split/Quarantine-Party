import 'phaser'

export default class BgScene extends Phaser.Scene {
  constructor() {
    super('BgScene');
  }

  preload() {
    this.load.image('sky', 'assets/backgrounds/sky.png');
    this.load.image('logo', 'assets/backgrounds/fullBlastLogo.png')
  }

  create() {
    // Background
    this.add.image(-160, 0, 'sky').setOrigin(0).setScale(.5);
    this.add.image(380,80,'logo').setScale(5)
  }
}
