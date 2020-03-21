import 'phaser'

export default class WaitingScene extends Phaser.Scene {
  constructor() {
    super('WaitingScene');
  }

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch('BgSceneWait');
    this.scene.launch('FgSceneWait');
  }
}
