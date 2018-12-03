import player from '../entity/Player';
import brandon from '../entity/Brandon';
import gun from '../entity/Gun';
import Laser from '../entity/Laser';
import Ground from '../entity/Ground';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');

    // Bind callback functions to the object context
    this.hit = this.hit.bind(this);
    this.collectGun = this.collectGun.bind(this);
    this.addLaser = this.addLaser.bind(this);
  }

  preload() {
    // Sprites
    this.load.image('ground', 'assets/sprites/ground.png');
    this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
      frameWidth: 340,
      frameHeight: 460,
    });
    this.load.image('gun', 'assets/sprites/gun.png');
    this.load.image('brandon', 'assets/sprites/brandon.png');
    this.load.image('laserBolt', 'assets/sprites/laserBolt.png');

    // Sounds
    this.load.audio('jump', 'assets/audio/jump.wav');
    this.load.audio('laser', 'assets/audio/laser.wav');
    this.load.audio('scream', 'assets/audio/scream.wav');
  }

  create() {
    // Create the ground and lasers
    this.createGroups();
    // Brandon. The enemy.
    this.brandon = new brandon(this, 600, 400);
    // Josh. The player.
    this.player = new player(this, 20, 400);
    // Gun
    this.gun = new gun(this, 300, 400, 'gun');
    // Create player's animations
    this.createAnimations();

    // Create sounds
    this.jumpSound = this.sound.add('jump');
    this.laserSound = this.sound.add('laser');
    this.laserSound.volume = 0.5;
    this.screamSound = this.sound.add('scream');

    // Assign the curors
    this.cursors = this.input.keyboard.createCursorKeys();
    // Create collions for all entities
    this.createCollisions();
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    this.player.update(this.cursors, this.jumpSound);
    this.gun.update(
      time,
      this.player,
      this.cursors,
      this.addLaser,
      this.laserSound
    );
    this.brandon.update(this.screamSound);
  }
  // Make the ground
  createGround(x, y) {
    let ground = this.groundGroup.create(x, y, 'ground');
  }
  // Make all the groups
  createGroups() {
    this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
    //add ground to group
    this.createGround(160, 540);
    this.createGround(600, 540);
    this.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 40,
      runChildUpdate: true,
    });
  }

  // Callback fn
  collectGun(player, gun) {
    gun.disableBody(true, true);
    this.player.armed = true;
  }
  // Callback fn
  hit(brandon, laser) {
    laser.setActive(false);
    laser.setVisible(false);
  }
  // Make collisions
  createCollisions() {
    this.physics.add.collider(this.gun, this.groundGroup);
    this.physics.add.collider(this.player, this.groundGroup);
    this.physics.add.collider(this.player, this.brandon);
    this.physics.add.collider(this.brandon, this.groundGroup);
    this.physics.add.collider(this.lasers, this.brandon);
    // create a checker to see if the player collides with the gun
    this.physics.add.overlap(
      this.player,
      this.gun,
      this.collectGun,
      null,
      this
    );
    // create a checker to see if the laser hits brandon
    this.physics.add.overlap(this.brandon, this.lasers, this.hit, null, this);
  }
  // Callback fn
  addLaser(x, y, left) {
    let laser = this.lasers.getFirstDead();
    if (!laser) {
      laser = new Laser(this, 0, 0);
      this.lasers.add(laser);
    }
    laser.fire(x, y, left);
  }
  // Player animations
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
}
