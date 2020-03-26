import 'phaser';

export default class Dice extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.add.existing(this);
    // this.scene.physics.world.enable(this);

  }

  rollDice(cursors){
    if (cursors.up.isDown) {
      this.anims.play('roll')
    }
    else if(cursors.down.isDown) {
      this.anims.play('random')
    }
    // else {
    //   this.anims.play('unrolled')
    // }
  }

  update(cursors) {
    this.rollDice(cursors)
  }
}

// die should only appear to active player?
// upon rendering, die should show 1 face
// hitting spacebar once should cause animation to play
// hitting spacebar a 2nd time / a set time should cause animation to stop on a random face
