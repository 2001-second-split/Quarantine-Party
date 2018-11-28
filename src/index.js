/** @type {import("../typings/phaser")} */
/* The above loads the phaser.d.ts file so that VSCode has autocomplete for the Phaser API.
If you experience problems with autocomplete, try opening the phaser.d.ts file and scrolling up and down in it.
That may fix the problem -- some weird quirk with VSCode. A new typing file is released with
every new release of Phaser. Make sure it's up-to-date!

At some point, the typings will
be officially added to the official release so that all you'll have to do is do:

npm install @types/phaser

But this hasn't happened yet!
*/

import 'phaser';

import BgScene from './BgScene';
import FgScene from './FgScene';


// This will be our initial configuration for when we create the game instance
const config = {
  type: Phaser.AUTO,  // Specify the underlying browser rendering engine (AUTO, CANVAS, WEBGL)
                      // AUTO will attempt to use WEBGL, but if not available it'll default to CANVAS
  // parent: 'phaser-example',
  width: 800,   // Game width in pixels
  height: 600,  // Game height in pixels
  physics: {    // Optional: specify physics engine and configuration
    default: 'arcade',  // A simple and performant physics engine
    arcade: {
      gravity: { y: 300 },  // Game objects will by default be affected by gravity
      debug: false,
    },
  },
  // Specify the scene(s) up front. Can also dynamically add scenes if desired.
  scene: [{ preload, create, update }, BgScene, FgScene],
  // This option is to turn off the default behavior of images being automatically sharpened.
  // Since we're using pixel art, we want every beautiful pixel untouched!
  render: {
    pixelArt: true,
  }
};

// let player;
// let groundGroup;
// let cursors;
// let gun;
// let armed = false;
// let left = false;
// let brandon;
// let lasers;
// let lastFired = 0;

const game = new Phaser.Game(config);

function preload() {
  console.log('preload in main');
  // Bg layer
  // this.load.image('sky', 'assets/backgrounds/sky.png');
  // this.load.image('logo', 'assets/logo.png');

  // // Fg layer
  // this.load.image('ground', 'assets/sprites/ground.png');
  // this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
  //   frameWidth: 340,
  //   frameHeight: 460,
  // });
  // this.load.image('gun', 'assets/sprites/gun.png');
  // this.load.image('brandon', 'assets/sprites/brandon.png');
  // this.load.image('laserBolt', 'assets/sprites/laserBolt.png');
}

function create() {
  // Load the scenes
  this.scene.launch('BgScene')
  this.scene.launch('FgScene')

  // //background
  // this.add.image(400, 300, 'sky');

  // var logo = this.add.image(400, 150, 'logo');

  // //ground
  // groundGroup = this.physics.add.staticGroup();
  // groundGroup.enableBody = true;
  // createGround(160, 540);
  // createGround(600, 540);

  // //brandon
  // brandon = this.physics.add.sprite(600, 400, 'brandon').setScale(0.25);
  // this.physics.add.collider(brandon, groundGroup);
  // brandon.flipX = !brandon.flipX;
  // //player
  // player = this.physics.add.sprite(20, 400, 'josh').setScale(0.25);
  // //ensure player can't walk off camera
  // player.setCollideWorldBounds(true);
  // //allow the player to collide with ground
  // this.physics.add.collider(player, groundGroup);
  // //gun
  // gun = this.physics.add.sprite(300, 400, 'gun').setScale(0.25);
  // //allow the gun to be collided with
  // this.physics.add.collider(gun, groundGroup);

  // this.physics.add.collider(player, brandon);

  // // create a checker to see if the player collides with the gun
  // this.physics.add.overlap(player, gun, collectGun, null, this);

  // //gun stuff
  // let Laser = new Phaser.Class({
  //   Extends: Phaser.GameObjects.Image,
  //   initialize: function Laser(scene) {
  //     Phaser.GameObjects.Image.call(this, scene, 0, 0, 'laserBolt');
  //     this.speed = Phaser.Math.GetSpeed(400, 1);
  //   },
  //   fire: function(x, y) {
  //     if (!left) {
  //       this.setPosition(x + 56, y + 14);
  //       this.setActive(true);
  //       this.setVisible(true);
  //       this.setScale(0.25);
  //       this.body.allowGravity = false;
  //       this.direction = 'right';
  //     } else {
  //       this.setPosition(x - 56, y + 14);
  //       this.setActive(true);
  //       this.setVisible(true);
  //       this.setScale(0.25);
  //       this.body.allowGravity = false;
  //       this.direction = 'left';
  //     }
  //   },
  //   update: function(time, delta) {
  //     if (this.direction === 'right') {
  //       this.x += this.speed * delta;
  //       if (this.x > 800) {
  //         this.setActive(false);
  //         this.setVisible(false);
  //       }
  //     } else {
  //       this.x -= this.speed * delta;
  //       if (this.x < 0) {
  //         this.setActive(false);
  //         this.setVisible(false);
  //       }
  //     }
  //   },
  // });
  // lasers = this.physics.add.group({
  //   classType: Laser,
  //   maxSize: 40,
  //   runChildUpdate: true,
  // });

  // this.physics.add.collider(lasers, brandon);
  // this.physics.add.overlap(brandon, lasers, hit, null, this);
  // // create player's animations
  // this.anims.create({
  //   key: 'run',
  //   frames: this.anims.generateFrameNumbers('josh', { start: 17, end: 20 }),
  //   frameRate: 10,
  //   repeat: -1,
  // });

  // // this.anims.create({
  // //     key: 'attackArmed',
  // //     frames: this.anims.generateFrameNumbers('josh', { start: 6, end: 10}),
  // //     frameRate: 10,
  // //     repeat: -1
  // // })

  // // this.anims.create({
  // //     key: 'attackUnarmed',
  // //     frames: this.anims.generateFrameNumbers('josh', { start: 11, end: 16}),
  // //     frameRate: 10,
  // //     repeat: -1
  // // })

  // this.anims.create({
  //   key: 'jump',
  //   frames: [{ key: 'josh', frame: 17 }],
  //   frameRate: 20,
  // });

  // this.anims.create({
  //   key: 'idleUnarmed',
  //   frames: [{ key: 'josh', frame: 11 }],
  //   frameRate: 10,
  // });

  // this.anims.create({
  //   key: 'idleArmed',
  //   frames: [{ key: 'josh', frame: 6 }],
  //   frameRate: 10,
  // });

  // // this.anims.create({
  // //     key: 'pickupGun',
  // //     frames: this.anims.generateFrameNumbers('josh', { start: 1, end: 5}),
  // //     frameRate: 10,
  // //     repeat: -1
  // // })

  // // assign the curors
  // cursors = this.input.keyboard.createCursorKeys();

  // // this.tweens.add({
  // //     targets: logo,
  // //     y: 450,
  // //     duration: 2000,
  // //     ease: 'Power2',
  // //     yoyo: true,
  // //     loop: -1
  // // });
}

function update(time, delta) {
  // if (cursors.left.isDown) {
  //   if (!left) {
  //     player.flipX = !player.flipX;
  //     left = true;
  //   }
  //   player.setVelocityX(-160);
  //   if (player.body.touching.down) {
  //     player.anims.play('run', true);
  //   }
  // } else if (cursors.right.isDown) {
  //   if (left) {
  //     player.flipX = !player.flipX;
  //     left = false;
  //   }
  //   player.setVelocityX(160);

  //   if (player.body.touching.down) {
  //     player.anims.play('run', true);
  //   }
  // } else {
  //   player.setVelocityX(0);
  //   if (!armed) {
  //     player.anims.play('idleUnarmed');
  //   } else {
  //     player.anims.play('idleArmed');
  //   }
  // }

  // if (cursors.up.isDown && player.body.touching.down) {
  //   player.setVelocityY(-330);
  // }

  // if (!player.body.touching.down) {
  //   player.anims.play('jump');
  // }

  // if (cursors.space.isDown && time > lastFired) {
  //   if (armed) {
  //     let laser = lasers.get();
  //     if (laser) {
  //       laser.fire(player.x, player.y);
  //       lastFired = time + 1000;
  //     }
  //   }
  // }
}

// function createGround(x, y) {
//   let ground = groundGroup.create(x, y, 'ground');
// }

// function collectGun(player, gun) {
//   gun.disableBody(true, true);
//   armed = true;
//   // player.setVelocityX(0)
//   // player.anims.play('pickupGun')
// }

// function hit(brandon, laser) {
//   laser.setActive(false);
//   laser.setVisible(false);
// }
