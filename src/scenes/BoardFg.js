import Player from '../entity/Player'
import Ground from '../entity/Ground'
import Phaser from 'phaser'



export default class BoardFg extends Phaser.Scene {
  constructor() {
    const sceneConfig = {
      key: "IsoInteractionExample",
      mapAdd: { isoPlugin: "iso" }
    }
    super('BoardFg');

  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITES HERE >>
    this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
      frameWidth: 340,
      frameHeight: 460,
    });

    // this.load.spritesheet('ayse', 'assets/spriteSheets/ayse-sprite.png', {
    //   frameWidth: 2000,
    //   frameHeight: 2000
    // })

    this.load.image('steph', 'assets/sprites/steph.png');
    this.load.image('ground', 'assets/sprites/platform.png');

    // Preload Sounds
    // << LOAD SOUNDS HERE >>
    this.load.audio('jump', 'assets/audio/jump.wav');
  }




  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>

    // Josh. The player. Our sprite is a little large, so we'll scale it down
    this.player = new Player(this, 375, 375, 'josh').setScale(0.2);
    this.player.setCollideWorldBounds(true);

    this.steph = new Player(this, 875, 250, 'steph').setScale(1.5);
    this.steph.setCollideWorldBounds(true);

    // Ayse. The player. Scaling it down
    // const ayseSprite = this.add.sprite(50,50,"ayse").setScale(.1)
    // this.ayse = new Player(this, 50, 50, 'ayse').setScale(0.1)

    // platform/ground correlating to tile locations
    this.platform = this.physics.add.staticGroup();
    //           .create(x-axis, y-axis, image to use)
    this.platform.create(375, 450, 'platform').setScale(.1);
    this.platform.create(500, 375, 'platform').setScale(.1);
    this.platform.create(625, 425, 'platform').setScale(.1);
    this.platform.create(755, 375, 'platform').setScale(.1);
    this.platform.create(875, 300, 'platform').setScale(.1);

    // Creating Movements

    // moveUp()
    // moveDown()
    // moveLeft()
    // moveRight()

    // this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
    // this.createGround(160, 540);
    // this.createGround(600, 540);


    // this.cursors = this.input.keyboard.createCursorKeys()

    // Create sounds
    // << CREATE SOUNDS HERE >>
    this.jumpSound = this.sound.add('jump');


    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
    // this.physics.add.collider(this.player, this.groundGroup)
    this.physics.add.collider(this.steph, this.platform)
    this.physics.add.collider(this.player, this.platform)


    // this.physics.add.overlap(

    // );


    //testing scene change
    // this.input.on('pointerup', function (pointer) { //on click the scene will change
    //   this.scene.pause('BoardScene')
    //   this.scene.pause('BoardDice')
    //   this.scene.start('minigameTPScene');
    // }, this);

  }

  // createGround(x, y) {
  //   this.groundGroup.create(x, y, 'platform');
  // }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    // this.player.update(this.cursors, this.jumpSound); // Add a parameter for the jumpSound

  }



}
