import 'phaser'

export default class BoardScene extends Phaser.Scene {
  constructor() {
    super('BoardScene');
  }

  init(que){
    this.que = que
  }

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch('BoardBg', {que: this.que});
    this.scene.launch('BoardDice');


  }
}
