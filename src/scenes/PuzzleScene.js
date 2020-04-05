import { socket } from "../index";


export default class PuzzleScene extends Phaser.Scene {
  constructor(){
    super('PuzzleScene')
  }

  preload(){
    this.load.spritesheet("background", "assets/spriteSheets/puzzle.png",
    {frameWidth: 250, frameHeight: 250});
    this.load.image("black", "assets/sprites/blackBlock.png")
  }
  create(){
    this.allowClick = true;
    this.blockGroup = this.add.group()
    let count = 0;
    //Divide the background image into a 3x4 grid
    for (let row=0; row<3; row++){
      for(let col=0; col<4; col++){
        this.block = this.add.sprite(col*252 + 250, row*252 + 150, 'background').setFrame(count++)
        //keep track of original locations of pieces to check for win condition
        this.block.origX = this.block.x
        this.block.origY = this.block.y
        this.blockGroup.add(this.block)
      }
    }
    //make each block interactive
    this.blockGroup.getChildren().forEach(block => {
      block.setInteractive()
      block.on('pointerdown', () => {
        this.selectBlock(block)
      })
    })
    //make the last block black, to enable block movement
    this.endBlock = this.block;
    this.endBlock.setTexture("black")
    //scramble the blocks to set up the puzzle
    this.scrambleBlocks()

    //listen for keyboard event and trigger socket
    var keyObj = scene.input.keyboard.addKey('Q');  // Get key object
    keyObj.on('down', () => {
      socket.emit('quitPuzzle')
    })
    //sockets
    socket.on('fromPuzzleToBoard', () => {
      this.scene.stop('PuzzleScene')

      this.scene.wake('BoardScene')
      this.scene.wake('BoardBg');
      this.scene.wake('BoardDice')
    })
  }

  selectBlock(block){
    if(!this.allowClick){
      return;
    }
    if(this.endBlock === block){
      return;
    }
    const diffX = Math.abs(this.endBlock.x - block.x)
    const diffY = Math.abs(this.endBlock.y - block.y)
    if(diffX > 252 || diffY > 252){
      return;
    }
    if(diffX === 252 && diffY === 252){
      return;
    }
    this.allowClick = false
    block.setDepth(1)
    const tempX = block.x;
    const tempY = block.y;

    this.moveBlock(block, this.endBlock.x, this.endBlock.y)
    this.moveBlock(this.endBlock, tempX, tempY)
  }
  moveBlock(block, xx, yy){
    this.tweens.add({
      targets: block,
      x: xx,
      y: yy,
      duration: 100,
      ease: 'linear',
      onComplete: () => {
        this.allowClick = true
        this.checkWin()
      }

    })
  }

  scrambleBlocks(){
    for (let i = 0; i < 10; i++){
      //get random int btw 0 & num of blocks
      const index1 = Phaser.Math.Between(0, this.blockGroup.getChildren().length - 1);
      const index2 = Phaser.Math.Between(0, this.blockGroup.getChildren().length - 1);

      const block1 = this.blockGroup.getChildren()[index1]
      const block2 = this.blockGroup.getChildren()[index2]
      this.swapBlocks(block1, block2)
    }
  }

  swapBlocks(block1, block2){
    const tempX = block1.x
    const tempY = block1.y

    block1.x = block2.x
    block1.y = block2.y

    block2.x = tempX
    block2.y = tempY
  }

  checkWin(){
    let win = true
    this.blockGroup.getChildren().forEach(block => {
      if(block.x !== block.origX || block.y !== block.origY){
        win = false
      }
    })
    //return win
    if(win){
      socket.emit('wonPuzzle')
    }
  }
}
