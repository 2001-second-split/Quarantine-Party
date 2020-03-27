import 'phaser'

export default class WaitScene extends Phaser.Scene {
  constructor() {
    super('WaitScene');

  }

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch('WaitBg');
    this.scene.launch('WaitFg');

  }

}

