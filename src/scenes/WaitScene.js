import "phaser";

export default class WaitScene extends Phaser.Scene {
  constructor() {
    super("WaitScene");
  }

  preload() {
  }

  create(data) {
    this.scene.launch("WaitBg", data); //passing it roomCreator data
    this.scene.launch("WaitFg");
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.cursors = this.input.keyboard.createCursorKeys();



  }

  update() {}
}
