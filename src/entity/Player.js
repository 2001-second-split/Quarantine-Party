import gs from '../GameState'
import 'phaser'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'josh')

    //store reference of scene passed to constructor
    this.scene = scene;

    // add player to scene and enable physics
    this.scene.physics.world.enable(this)
    this.scene.add.existing(this)

    //scale player
    this.setScale(.25)

    //armed?
    this.armed = false;
    // Is the player facing left
    this.left = false;
    //player can't walk off camera
    this.setCollideWorldBounds(true)
  }

  preload() {
    this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
      frameWidth: 340,
      frameHeight: 460,
    });
  }

  update(cursors) {
    if (cursors.left.isDown) {
      if (!this.left) {
        this.flipX = !this.flipX;
        this.left = true;
      }
      this.setVelocityX(-360);
      if (this.body.touching.down) {
        this.anims.play('run', true);
      }
    } else if (cursors.right.isDown) {
      if (this.left) {
        this.flipX = !this.flipX;
        this.left = false;
      }
      this.setVelocityX(360);

      if (this.body.touching.down) {
        this.anims.play('run', true);
      }
    } else {
      this.setVelocityX(0);
      if (!this.armed) {
        this.anims.play('idleUnarmed');
      } else {
        this.anims.play('idleArmed');
      }
    }

    if (cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(-800);
    }

    if (!this.body.touching.down) {
      this.anims.play('jump');
    }
  }
}
