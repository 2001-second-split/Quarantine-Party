
import gs from '../GameState'

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');

    // Bind callback functions to the object context
    this.hit = this.hit.bind(this)
    this.collectGun = this.collectGun.bind(this)
    this.createGround = this.createGround.bind(this)
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
    gs.groundGroup = this.physics.add.staticGroup();
    gs.groundGroup.enableBody = true;
    this.createGround(160, 540);
    this.createGround(600, 540);

    // Brandon. The enemy.
    gs.brandon = this.physics.add.sprite(600, 400, 'brandon').setScale(0.25)
    // setImmovable(true) will make him not "pushable"
    // brandon = brandon.setImmovable(true).setGravityY(-300);

    this.physics.add.collider(gs.brandon, gs.groundGroup);
    gs.brandon.flipX = !gs.brandon.flipX;

    // Josh. The player.
    gs.player = this.physics.add.sprite(20, 400, 'josh').setScale(0.25);
    //ensure player can't walk off camera
    gs.player.setCollideWorldBounds(true);
    //allow the player to collide with ground
    this.physics.add.collider(gs.player, gs.groundGroup);
    //gun
    gs.gun = this.physics.add.sprite(300, 400, 'gun').setScale(0.25);
    //allow the gun to be collided with the ground
    this.physics.add.collider(gs.gun, gs.groundGroup);

    this.physics.add.collider(gs.player, gs.brandon);

    // create a checker to see if the player collides with the gun
    this.physics.add.overlap(gs.player, gs.gun, this.collectGun, null, this);

    //gun stuff
    let Laser = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
      initialize: function Laser(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'laserBolt');
        this.speed = Phaser.Math.GetSpeed(800, 1);
      },
      fire: function(x, y) {
        if (!gs.left) {
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
    gs.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 40,
      runChildUpdate: true,
    });

    this.physics.add.collider(gs.lasers, gs.brandon);
    this.physics.add.overlap(gs.brandon, gs.lasers, this.hit, null, this);
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
    gs.cursors = this.input.keyboard.createCursorKeys();

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
    if (gs.cursors.left.isDown) {
      if (!gs.left) {
        gs.player.flipX = !gs.player.flipX;
        gs.left = true;
      }
      gs.player.setVelocityX(-360);
      if (gs.player.body.touching.down) {
        gs.player.anims.play('run', true);
      }
    } else if (gs.cursors.right.isDown) {
      if (gs.left) {
        gs.player.flipX = !gs.player.flipX;
        gs.left = false;
      }
      gs.player.setVelocityX(360);

      if (gs.player.body.touching.down) {
        gs.player.anims.play('run', true);
      }
    } else {
      gs.player.setVelocityX(0);
      if (!gs.armed) {
        gs.player.anims.play('idleUnarmed');
      } else {
        gs.player.anims.play('idleArmed');
      }
    }

    if (gs.cursors.up.isDown && gs.player.body.touching.down) {
      gs.player.setVelocityY(-800);
    }

    if (!gs.player.body.touching.down) {
      gs.player.anims.play('jump');
    }

    if (gs.cursors.space.isDown && time > gs.lastFired) {
      if (gs.armed) {
        // console.log('gs.lasers:', gs.lasers)
        let laser = gs.lasers.get();
        // console.log('laser:', laser)
        if (laser) {
          laser.fire(gs.player.x, gs.player.y);
          gs.lastFired = time + 100;
        }
      }
    }
  }

  // Callback fn
  createGround(x, y) {
    let ground = gs.groundGroup.create(x, y, 'ground');
  }

  // Callback fn
  collectGun(player, gun) {
    gun.disableBody(true, true);
    gs.armed = true;
    // player.setVelocityX(0)
    // player.anims.play('pickupGun')
  }

  // Callback fn
  hit(brandon, laser) {
    laser.setActive(false);
    laser.setVisible(false);
  }
}
