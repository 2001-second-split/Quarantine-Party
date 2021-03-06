import 'phaser';
import {socket} from '../index'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    //Is the player facing left?
    this.facingLeft = false;
  }

  updateMovement(cursors) {
    // Move left
    if (cursors.left.isDown) {
      if(!this.facingLeft){
        this.flipX = !this.flipX
        this.facingLeft = true;
      }
      this.setVelocityX(-360)
      if(this.body.onFloor()){
        this.anims.play("run", true)
      }
    }
    // Move right
    else if (cursors.right.isDown) {
      if(this.facingLeft){
        this.flipX = !this.flipX
        this.facingLeft = false
      }
      this.setVelocityX(360)
      if(this.body.onFloor()){
        this.anims.play('run', true)
      }
    }
    // Jump
    else if (cursors.up.isDown) {
      this.setVelocityY(-270)
      if(this.body.onFloor()){
        this.anims.play('run', true)
      }
    }
    // Neutral (no movement)
    else {
      this.setVelocityX(0)
      this.play("idle")
    }
  }

  updateJump(cursors, jumpSound) {
    if (cursors.up.isDown && this.body.onFloor()) {
      this.setVelocityY(-200);
      jumpSound.play();
    }
  }

  updateInAir() {
    if (!this.body.touching.down) {
      this.play('jump')
    }
  }

  // Check which controller button is being pushed and execute movement & animation
  update(cursors, jumpSound) {
    // << INSERT CODE HERE >>
    this.updateMovement(cursors);
    this.updateJump(cursors, jumpSound)
    this.updateInAir();

    const x = this.x;
    const y = this.y;
    const facingLeft = this.facingLeft;
    if (this.oldPosition && (x !== this.oldPosition.x || y !== this.oldPosition.y || facingLeft !== this.oldPosition.facingLeft)) {
      socket.emit('playerMovement', { x: this.x, y: this.y, facingLeft: this.facingLeft });
    }

    // save players old position
    this.oldPosition = {
      x: this.x,
      y: this.y,
      facingLeft: this.facingLeft
    };
  }
}
