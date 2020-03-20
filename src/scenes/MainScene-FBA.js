import 'phaser'

export default class MainSceneFBA extends Phaser.Scene {
  constructor() {
    super('MainSceneFBA');
  }

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch('BgSceneFBA');
    this.scene.launch('FgSceneFBA');
  }
}
