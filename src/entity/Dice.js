import 'phaser';

export default class Dice extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.scene.add.existing(this);

    this.clicks = 0;
  }

  rollDice() {
    if(this.clicks < 1) {
      this.anims.play('roll')
      this.clicks++
    }
     else {
      this.anims.play('random')
      // this.clicks = 0
    }
  }

  resetDice() {
    this.anims.play('reset')
  }

  // update() {
  //   this.resetDice()
  // }
}
