import 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    // Load scenes in parallel
    this.scene.launch('BgScene');
    this.scene.launch('FgScene');
  }
}
