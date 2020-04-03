export default class PuzzleScene extends Phaser.Scene {
  constructor(){
    super('PuzzleScene')
  }

  preload(){
    this.load.spritesheet("background", "assets/sprites/bl.jpg",
    {frameWidth: PIECE_WIDTH, frameHeight: PIECE_HEIGHT});
  }
}
