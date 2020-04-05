import 'phaser'
import Align from '../entity/Align'

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
    const spriteKeys = ["ayse", "stephanie", "tiffany", "patty"]
    spriteKeys.forEach(key => {
      this.load.spritesheet(key, `assets/spriteSheets/${key}-sheet.png`, {
        frameWidth: 300,
        frameHeight: 300,
        endFrame: 8
      });
    })

    // LOAD BACKGROUND IMAGE
    this.load.image('background', 'assets/backgrounds/sky.png');
  }

  create() {

    // Create Background
    const bg = this.add.image(-0, 0, 'background');
    // Resize screen to match
    Align.scaleToGame(bg, 1)
    Align.center(bg)

    // Static Text for now
    const header = this.add.text(250, 50, `${this.first.toUpperCase()} WINS!`, { fontSize: '32px', fill: '#000' });
    const credits = this.add.text(50, 750, 'Game Created by 2001-GH: Ayse, Patty, Tiffany, Stephanie', {fontSize: '32px', fill: '#000'})

    // Display players based on how well they placed
    this.add.sprite(400,250, this.first).setScale(1)
    this.add.sprite(200,450, this.second).setScale(0.5)
    this.add.sprite(400,450, this.third).setScale(0.5)
    this.add.sprite(600,450, this.fourth).setScale(0.5)

    // Create podium

    // Create celebration music

    // Play Again Button?
    const playAgainButton = this.add.text(50, 250, 'PLAY AGAIN?', { fontSize: '32px', fill: '#000000' });
    playAgainButton.setInteractive();

    // if Play Again is hit, restart game from beginning
    playAgainButton.on('pointerup', () => {
    const gameUrl = 'https://super-quarantine-party.herokuapp.com/'
    const s = window.open(gameUrl, '_blank');
    if (s && s.focus){
      s.focus()
    } else if (!s){
      window.location.href = gameUrl
    }
    })
  }
}
