import 'phaser';

export default class BgSceneWait extends Phaser.Scene {
  constructor() {
    super('WaitBg');
  }

  preload() {
    // Preload Sprites
    this.load.image('sky', 'assets/backgrounds/sky.png');

    // placeholder text
    // this.load.image('waitingRoomBanner', 'assets/backgrounds/waitingRoomBanner.png')
  }

  create() {
    // Create Sprites
    this.add.image(-160, 0, 'sky').setOrigin(0).setScale(.5);
    // this.add.image(380,80,'waitingRoomBanner').setScale(5)

    this.header = this.add.text(250, 50, 'Waiting Room!!', { fontSize: '32px', fill: '#000' });
  }
}
