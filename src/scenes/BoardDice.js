import Dice from '../entity/Dice';
import {socket} from '../index'

export default class BoardDice extends Phaser.Scene {
  constructor() {
    super('BoardDice');
  }

  preload() {
    this.load.spritesheet('dice', 'assets/spriteSheets/dice.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    // Preload Sounds
  }

  diceRollAnimations() {
    this.anims.create({
      key: 'roll',
      frames: this.anims.generateFrameNumbers('dice', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    // this.anims.create({
    //   key: 'random',
    //   frames: [{ key: 'dice', frame: Math.floor(Math.random() * 6) }],
    //   frameRate: 10,
    // });
    // this.anims.create({
    //   key: 'reset',
    //   frames: [{ key: 'dice', frame: 1 }],
    //   frameRate: 10,
    // });
    this.anims.create({
      key: '1',
      frames: [{ key: 'dice', frame: 0 }],
      frameRate: 10,
    });
    this.anims.create({
      key: '2',
      frames: [{ key: 'dice', frame: 1 }],
      frameRate: 10,
    });
    this.anims.create({
      key: '3',
      frames: [{ key: 'dice', frame: 2 }],
      frameRate: 10,
    });
    this.anims.create({
      key: '4',
      frames: [{ key: 'dice', frame: 3 }],
      frameRate: 10,
    });
    this.anims.create({
      key: '5',
      frames: [{ key: 'dice', frame: 4 }],
      frameRate: 10,
    });
    this.anims.create({
      key: '6',
      frames: [{ key: 'dice', frame: 5 }],
      frameRate: 10,
    });
  }

  create() {
    this.dice = new Dice(this, 900, 100, 'dice').setScale(1.75)

    this.diceRollAnimations();
    this.dice.setInteractive();
    // Create sounds
    // placeholder for dice roll sound
    // this.diceSound = this.sound.add('dice');
    this.dice.on('pointerup', function () {
      // console.log('dice clicked');
      this.dice.rollDice()
      socket.emit('diceRoll', this.dice.rolledNum)
      //console.log(this.dice.rolledNum)
    }, this);
  }


  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // this.dice.update(this.cursors, this.diceSound); // Add a parameter for the diceSound
    // this.dice.update()

  }
}
