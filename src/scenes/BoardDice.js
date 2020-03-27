import Dice from '../entity/Dice';

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
    this.anims.create({
      key: 'random',
      frames: [{ key: 'dice', frame: Math.floor(Math.random() * 6) }],
      frameRate: 10,
    });
    this.anims.create({
      key: 'reset',
      frames: [{ key: 'dice', frame: 1 }],
      frameRate: 10,
    });
  }

  create() {
    this.dice = new Dice(this, 900, 100, 'dice').setScale(1.75)

    this.diceRollAnimations();
    this.dice.setInteractive();

    this.dice.on('pointerup', function () {
      // console.log('dice clicked');
      this.dice.rollDice()
    }, this);

    // Create sounds
    // placeholder for dice roll sound
    // this.diceSound = this.sound.add('dice');
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // this.dice.update(this.cursors, this.diceSound); // Add a parameter for the diceSound
    // this.dice.update()
  }
}
