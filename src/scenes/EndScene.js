import 'phaser'

export default class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene');
  }

  init(data) {
    // setting data passed from board to variables
    this.first = data.first;
    this.second = data.second;
    this.third = data.third;
    this.fourth = data.fourth;
  }

  preload() {
    // LOAD SPRITES
    this.load.spritesheet("ayse", "assets/spriteSheets/ayse-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });
    this.load.spritesheet("stephanie", "assets/spriteSheets/stephanie-sheet.png",{
        frameWidth: 300,
        frameHeight: 300,
        endFrame: 8
      }
    );
    this.load.spritesheet("tiffany", "assets/spriteSheets/tiffany-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });
    this.load.spritesheet("patty", "assets/spriteSheets/patty-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });

    // LOAD FG athings
    // this.load.image('podium', 'assets/sprites/podium.png')

    // LOAD BACKGROUND IMAGE
    this.load.image('background', 'assets/backgrounds/sky.png');
  }

  createCelebrations() {
    //add jumping anims so person in first place can look like they're celebrating?
  }

  create() {

    // Create Background
    this.add.image(-160, 0, 'background').setOrigin(0).setScale(0.5);

    // Static Text for now
    const header = this.add.text(250, 50, `${this.first.toUpperCase()} WINS!`, { fontSize: '32px', fill: '#000' });
    const credits = this.add.text(10, 600, 'Game Created by 2001-GH: Ayse, Patty, Tiffany, Stephanie')

    // Display players based on how well they placed
    this.add.sprite(400,250, this.first).setScale(1)
    this.add.sprite(200,450, this.second).setScale(0.5)
    this.add.sprite(400,450, this.third).setScale(0.5)
    this.add.sprite(600,450, this.fourth).setScale(0.5)

    // Create podium

    // Create celebration music

    // Play Again Button?
    const playAgainButton = this.add.text(50, 250, 'PLAY AGAIN?', { fontSize: '32px', fill: '#FFF' });
    playAgainButton.setInteractive();

    // if Play Again is hit, restart game from beginning
    playAgainButton.on('pointerup', () => {
      console.log('playagain pressed')

      // stopping all scenes for now
      // refactor tasks: stop scenes as they're not necessary
      // this.scene.stop('WaitBg')
      // this.scene.stop('WaitFg')
      // this.scene.stop('WaitScene')

      // this.scene.stop('BoardBg')
      // this.scene.stop('BoardScene')
      // this.scene.stop('BoardDice')

      // this.scene.stop('EndScene')

      // this.scene.start('StartingScene');

    const gameUrl = 'https://super-quarantine-party.herokuapp.com/'
    const s = window.open(gameUrl, '_blank');
    if (s && s.focus){
      s.focus()
    } else if (!s){
      window.location.href = gameUrl
    }
    })
  }

  update() {
  }
}
