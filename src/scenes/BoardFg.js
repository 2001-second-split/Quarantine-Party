import Player from '../entity/Player'


export default class BoardFg extends Phaser.Scene {
  constructor() {
    super('BoardFg');

  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITES HERE >>
    this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
      frameWidth: 340,
      frameHeight: 460,
    });

    this.load.image('steph', 'assets/sprites/steph.png');
    // this.load.image('ground', 'assets/sprites/ground.png');

    // Preload Sounds
    // << LOAD SOUNDS HERE >>
    this.load.audio('jump', 'assets/audio/jump.wav');
  }

  createGround(x, y) {
    this.groundGroup.create(x, y, 'ground');
  }


  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>

    // Josh. The player. Our sprite is a little large, so we'll scale it down
    this.player = new Player(this, 50, 400, 'josh').setScale(0.25);
    this.player.setCollideWorldBounds(true);


    // Create the animations during the FgScene's create phase


    // this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
    // this.createGround(160, 540);
    // this.createGround(600, 540);


    // this.cursors = this.input.keyboard.createCursorKeys()

    // Create sounds
    // << CREATE SOUNDS HERE >>
    this.jumpSound = this.sound.add('jump');


    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
    this.physics.add.collider(this.player, this.groundGroup)


    // this.physics.add.collider(this.enemy, this.groundGroup)
    // this.physics.add.collider(this.player, this.enemy)

    // this.physics.add.collider(this.gun, this.groundGroup)
    // this.physics.add.collider(this.player, this.gun)

    // this.physics.add.overlap(
    //   this.player,
    // );


    //testing scene change

    this.input.on('pointerup', function (pointer) { //on click the scene will change
      this.scene.pause('BoardScene')
      this.scene.pause('BoardDice')
      this.scene.start('minigameTPScene');
    }, this);

  }


  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    // this.player.update(this.cursors, this.jumpSound); // Add a parameter for the jumpSound

  }



}
