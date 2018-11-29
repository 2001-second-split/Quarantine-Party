import 'phaser'

let player;
let groundGroup;
let cursors;
let gun;
let armed = false;
let left = false;
let brandon;
let lasers;
let lastFired = 0;

function createGround(x, y) {
  let ground = groundGroup.create(x, y, 'ground');
}

function collectGun(player, gun) {
  gun.disableBody(true, true);
  armed = true;
  // player.setVelocityX(0)
  // player.anims.play('pickupGun')
}

function hit(brandon, laser) {
  laser.setActive(false);
  laser.setVisible(false);
}

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
    // this.player;
    // this.groundGroup;
    // this.cursors;
    // this.gun;
    // this.armed = false;
    // this.left = false;
    // this.brandon;
    // this.lasers;
    // this.lastFired = 0;
  }

  preload() {
    // Fg layer
    this.load.image('ground', 'assets/sprites/ground.png');
    this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
      frameWidth: 340,
      frameHeight: 460,
    });
    this.load.image('gun', 'assets/sprites/gun.png');
    this.load.image('brandon', 'assets/sprites/brandon.png');
    this.load.image('laserBolt', 'assets/sprites/laserBolt.png');
  }

  create() {
    //ground
    groundGroup = this.physics.add.staticGroup();
    groundGroup.enableBody = true;
    createGround(160, 540);
    createGround(600, 540);

    // Brandon. The enemy.
    brandon = this.physics.add.sprite(600, 400, 'brandon').setScale(0.25)
    // setImmovable(true) will make him not "pushable"
    // brandon = brandon.setImmovable(true).setGravityY(-300);

    this.physics.add.collider(brandon, groundGroup);
    brandon.flipX = !brandon.flipX;

    // Josh. The player.
    player = this.physics.add.sprite(20, 400, 'josh').setScale(0.25);
    //ensure player can't walk off camera
    player.setCollideWorldBounds(true);
    //allow the player to collide with ground
    this.physics.add.collider(player, groundGroup);
    //gun
    gun = this.physics.add.sprite(300, 400, 'gun').setScale(0.25);
    //allow the gun to be collided with
    this.physics.add.collider(gun, groundGroup);

    this.physics.add.collider(player, brandon);

    // create a checker to see if the player collides with the gun
    this.physics.add.overlap(player, gun, collectGun, null, this);

    //gun stuff
    let Laser = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
      initialize: function Laser(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'laserBolt');
        this.speed = Phaser.Math.GetSpeed(800, 1);
      },
      fire: function(x, y) {
        if (!left) {
          this.setPosition(x + 56, y + 14);
          this.setActive(true);
          this.setVisible(true);
          this.setScale(0.25);
          this.body.allowGravity = false;
          this.direction = 'right';
        } else {
          this.setPosition(x - 56, y + 14);
          this.setActive(true);
          this.setVisible(true);
          this.setScale(0.25);
          this.body.allowGravity = false;
          this.direction = 'left';
        }
      },
      update: function(time, delta) {
        if (this.direction === 'right') {
          this.x += this.speed * delta;
          if (this.x > 800) {
            this.setActive(false);
            this.setVisible(false);
          }
        } else {
          this.x -= this.speed * delta;
          if (this.x < 0) {
            this.setActive(false);
            this.setVisible(false);
          }
        }
      },
    });
    lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 40,
      runChildUpdate: true,
    });

    this.physics.add.collider(lasers, brandon);
    this.physics.add.overlap(brandon, lasers, hit, null, this);
    // create player's animations
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('josh', { start: 17, end: 20 }),
      frameRate: 10,
      repeat: -1,
    });

    // this.anims.create({
    //     key: 'attackArmed',
    //     frames: this.anims.generateFrameNumbers('josh', { start: 6, end: 10}),
    //     frameRate: 10,
    //     repeat: -1
    // })

    // this.anims.create({
    //     key: 'attackUnarmed',
    //     frames: this.anims.generateFrameNumbers('josh', { start: 11, end: 16}),
    //     frameRate: 10,
    //     repeat: -1
    // })

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

    // this.anims.create({
    //     key: 'pickupGun',
    //     frames: this.anims.generateFrameNumbers('josh', { start: 1, end: 5}),
    //     frameRate: 10,
    //     repeat: -1
    // })

    // assign the curors
    cursors = this.input.keyboard.createCursorKeys();

    // this.tweens.add({
    //     targets: logo,
    //     y: 450,
    //     duration: 2000,
    //     ease: 'Power2',
    //     yoyo: true,
    //     loop: -1
    // });
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    if (cursors.left.isDown) {
      if (!left) {
        player.flipX = !player.flipX;
        left = true;
      }
      player.setVelocityX(-360);
      if (player.body.touching.down) {
        player.anims.play('run', true);
      }
    } else if (cursors.right.isDown) {
      if (left) {
        player.flipX = !player.flipX;
        left = false;
      }
      player.setVelocityX(360);

      if (player.body.touching.down) {
        player.anims.play('run', true);
      }
    } else {
      player.setVelocityX(0);
      if (!armed) {
        player.anims.play('idleUnarmed');
      } else {
        player.anims.play('idleArmed');
      }
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-800);
    }

    if (!player.body.touching.down) {
      player.anims.play('jump');
    }

    if (cursors.space.isDown && time > lastFired) {
      if (armed) {
        let laser = lasers.get();
        if (laser) {
          laser.fire(player.x, player.y);
          lastFired = time + 100;
        }
      }
    }
  }
}
