import Dice from '../entity/Dice';

export default class BoardDice extends Phaser.Scene {
  constructor() {
    super('BoardDice');

    this.numRolls = 0;
    // this.rollDice = this.rollDice.bind(this)

  }

  preload() {
    // Preload Sprites
    this.load.spritesheet('dice', 'assets/spriteSheets/dice.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Preload Sounds

  }

  // rollDice() {

  //   console.log(this.numRolls)
  //   this.numRolls++;
  // }

  diceRollAnimations() {

    this.anims.create({
      key: 'roll',
      frames: this.anims.generateFrameNumbers('dice', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'unrolled',
      frames: [{ key: 'dice', frame: 0 }],
      frameRate: 10,
    });
    this.anims.create({
      key: 'random',
      frames: [{ key: 'dice', frame: Math.floor(Math.random() * 6) }],
      frameRate: 10,
    });


  }

  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>

    this.dice = new Dice(this, 900, 100, 'dice').setScale(1.75)
    // this.dice.setCollideWorldBounds(true);


    // Create the animations during the FgScene's create phase
    this.diceRollAnimations();



    // this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
    // this.createGround(160, 540);
    // this.createGround(600, 540);

    this.cursors = this.input.keyboard.createCursorKeys()
    this.dice.setInteractive();

    this.dice.on('pointerup', function (pointer) {

      console.log('down');

  }, this);
    // Create sounds
    // placeholder for dice roll sound
    // this.diceSound = this.sound.add('dice');

    // Create collisions for all entities
    // this.physics.add.collider(this.dice, this.groundGroup)

  }


  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    // this.dice.update(this.cursors, this.diceSound); // Add a parameter for the diceSound
    this.dice.update(this.cursors)

  }



}
