export default class BgScene extends Phaser.Scene {
  constructor() {
    super('BgScene');
  }

  preload() {
    // Bg layer
    this.load.image('sky', 'assets/backgrounds/sky.png');
    // this.load.image('logo', 'assets/logo.png');
  }

  create() {
    // this.cameras.main.setViewport(0, 136, 1024, 465);

    // Background
    this.add.image(-160, 0, 'sky').setOrigin(0).setScale(.5);
  }

  update() {}
}
