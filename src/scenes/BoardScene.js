import 'phaser'

export default class BoardScene extends Phaser.Scene {
  constructor() {
    super('BoardScene');
  }

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch('BoardBg');
    this.scene.launch('BoardDice');


  }
}
