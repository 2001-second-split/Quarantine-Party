import Player from '../entity/Player'
import Ground from '../entity/Ground'
import Enemy from '../entity/Enemy';


export default class WaitFg extends Phaser.Scene {
  constructor() {
    super('WaitFg');

  }

  preload() {

    // << LOAD SPRITES HERE >>
    this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
      frameWidth: 340,
      frameHeight: 460,
    });

    this.load.image('steph', 'assets/sprites/steph.png');
    this.load.image('platform', 'assets/sprites/platform.png');

    // << LOAD SOUNDS HERE >>
    this.load.audio('jump', 'assets/audio/jump.wav');

  }

  createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('josh', { start: 17, end: 20 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'jump',
      frames: [{ key: 'josh', frame: 17 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'idleUnarmed',
      frames: [{ key: 'josh', frame: 11 }],
      frameRate: 10,
    });
    this.anims.create({
      key: 'idleArmed',
      frames: [{ key: 'josh', frame: 6 }],
      frameRate: 10,
    });
  }

  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>

    this.player = new Player(this, 50, 400, 'josh').setScale(0.25);
    this.enemy = new Enemy(this, 600, 400, 'steph').setScale(2);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.enemy.setCollideWorldBounds(true);

    // Create the animations during the FgScene's create phase
    this.createAnimations();

    this.cursors = this.input.keyboard.createCursorKeys()

    //create ground
    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 600, 'platform').setScale(2).refreshBody();



    // Create sounds
    this.jumpSound = this.sound.add('jump');


    // Create collisions for all entities
    this.physics.add.collider(this.player, this.ground)
    this.physics.add.collider(this.enemy, this.ground)
    this.physics.add.collider(this.player, this.enemy)
    //testing scene change
    this.input.on('pointerup', function (pointer) { //on click the scene will change
      //this.scene.stop()
      this.scene.get('BoardScene');
      this.scene.start('BoardScene');
    }, this);
  }

  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    this.player.update(this.cursors, this.jumpSound); // Add a parameter for the jumpSound
  }


}
