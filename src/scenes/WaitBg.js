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

  create(data) {

    console.log('data in waitbg', data)
    // Create Sprites
    this.add.image(-160, 0, 'sky').setOrigin(0).setScale(.5);
    // this.add.image(380,80,'waitingRoomBanner').setScale(5)

    this.header = this.add.text(250, 50, 'Waiting Room!!', { fontSize: '32px', fill: '#000' });

    //create a "start button" but this is actually just text for now
    const startButton = this.add.text(250, 250, 'Start Button', { fontSize: '32px', fill: '#FFF' });

    //make it interactive! so when we click it...
    startButton.setInteractive();

    // when we release the mouse, it'll log a message and change scenes
    startButton.on('pointerup', () => {
      console.log('startbutton pressed')
      this.scene.stop('WaitBg')
      this.scene.stop('WaitFg')
      this.scene.stop('WaitScene')

      this.scene.start('BoardScene');
    })
  }
}
