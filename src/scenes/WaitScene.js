import 'phaser'

export default class WaitScene extends Phaser.Scene {
  constructor() {
    super('WaitScene');

    this.gameOver = false;
  }

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch('WaitBg');
    this.scene.launch('WaitFg');

  }

  update() {
    if (this.gameOver === true) {
      this.scene.start('EndScene')
    }

  }

}

