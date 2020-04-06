import "phaser";

export default class WaitScene extends Phaser.Scene {
  constructor() {
    super("WaitScene");
  }

  create(data) {
    //launch wait bg and fg in parallel
    this.scene.launch("WaitBg", data); //passing it roomCreator data
    this.scene.launch("WaitFg");
  }
}
