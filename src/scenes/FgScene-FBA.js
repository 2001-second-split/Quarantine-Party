import Player from '../entity/Player'
import Ground from '../entity/Ground'
import Enemy from '../entity/Enemy';
import Gun from '../entity/Gun'
import Laser from '../entity/Laser'

export default class FgSceneFBA extends Phaser.Scene {
  constructor() {
    super('FgSceneFBA');

    this.collectGun = this.collectGun.bind(this);
    this.fireLaser = this.fireLaser.bind(this);
    this.hit = this.hit.bind(this);
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITES HERE >>
    this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
      frameWidth: 340,
      frameHeight: 460,
    });

    this.load.image('steph', 'assets/sprites/steph.png');
    this.load.image('gun', 'assets/sprites/gun.png');
    this.load.image('laserBolt', 'assets/sprites/laserBolt.png');
    this.load.image('ground', 'assets/sprites/ground.png');

    // Preload Sounds
    // << LOAD SOUNDS HERE >>
    this.load.audio('jump', 'assets/audio/jump.wav');
    this.load.audio('laser', 'assets/audio/laser.wav');
    this.load.audio('scream', 'assets/audio/scream.wav');
  }

  createGround(x, y) {
    this.groundGroup.create(x, y, 'ground');
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

    // Josh. The player. Our sprite is a little large, so we'll scale it down
    this.player = new Player(this, 50, 400, 'josh').setScale(0.25);
    this.enemy = new Enemy(this, 600, 400, 'steph').setScale(2);
    this.gun = new Gun(this, 300, 400, 'gun').setScale(0.25);

    // Create the animations during the FgScene's create phase
    this.createAnimations();

    // Define the single frame in the tilesheet that represents the player idle and holding a gun
    // this.anims.create({
    //   key: 'idleArmed',
    //   frames: [{ key: 'josh', frame: 6 }],
    //   frameRate: 10,
    // });

    this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
    this.createGround(160, 540);
    this.createGround(600, 540);

    this.lasers = this.physics.add.group({
      classType: Laser,
      runChildUpdate: true,
      allowGravity: false,   // Important! When an obj is added to a group, it will inherit
                          // the group's attributes. So if this group's gravity is enabled,
                          // the individual lasers will also have gravity enabled when they're
                          // added to this group
      maxSize: 40
    });

    this.cursors = this.input.keyboard.createCursorKeys()

    // Create sounds
    // << CREATE SOUNDS HERE >>
    this.jumpSound = this.sound.add('jump');
    this.laserSound = this.sound.add('laser');
    this.screamSound = this.sound.add('scream');

    // The laser sound is a bit too loud so we're going to turn it down
    this.laserSound.volume = 0.5;

    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
    this.physics.add.collider(this.player, this.groundGroup)

    this.physics.add.collider(this.enemy, this.groundGroup)
    this.physics.add.collider(this.player, this.enemy)

    this.physics.add.collider(this.gun, this.groundGroup)
    // this.physics.add.collider(this.player, this.gun)

    this.physics.add.overlap(
      this.player,
      this.gun,
      this.collectGun,    // Our callback function that will handle the collision logic
      null,               // processCallback. Can specify a function that has custom collision
                          // conditions. We won't be using this so you can ignore it.
      this                // The context of 'this' for our callback. Since we're binding
                          // our callback, it doesn't really matter.
    );

    // When the laser collides with the enemy
    this.physics.add.overlap(
      this.lasers,
      this.enemy,
      this.hit,
      null,
      this
    );

    //testing scene change
    // this.input.on('pointerup', function (pointer) { //on click the scene will change
    //   this.scene.get('minigameScene');
    //   this.scene.start('minigameScene');
    // }, this);


  }

  collectGun(player, gun) {
    // Make the gun disappear from the ground.
    gun.disableBody(true, true); // (disableGameObj, hideGameObj)
    // Set the player to 'armed'
    this.player.armed = true;
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    this.player.update(this.cursors, this.jumpSound); // Add a parameter for the jumpSound

    // this.player.update(this.cursors);

    this.gun.update(
      time,
      this.player,
      this.cursors,
      this.fireLaser,  // Callback fn for creating lasers
      this.laserSound
    );

    this.enemy.update(this.screamSound)
  }

  // Callback fn. We implement it here b/c our scene has references to the lasers group and the player
  fireLaser(x, y, left) {
    // These are the offsets from the player's position that make it look like
    // the laser starts from the gun in the player's hand
    const offsetX = 56;
    const offsetY = 14;
    const laserX =
      this.player.x + (this.player.facingLeft ? -offsetX : offsetX);
    const laserY = this.player.y + offsetY;

    // Get the first available laser object that has been set to inactive
    let laser = this.lasers.getFirstDead();
    // Check if we can reuse an inactive laser in our pool of lasers
    if (!laser) {
      // Create a laser bullet and scale the sprite down
      laser = new Laser(
        this,
        laserX,
        laserY,
        'laserBolt',
        this.player.facingLeft
      ).setScale(0.25);
      this.lasers.add(laser);
    }
    // Reset this laser to be used for the shot
    laser.reset(laserX, laserY, this.player.facingLeft);
  }

  // make the laser inactive and insivible when it hits the enemy
  hit(enemy, laser) {
    laser.setActive(false);
    laser.setVisible(false);
  }
}
