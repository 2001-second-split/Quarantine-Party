import 'phaser';

export default class Dice extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);

    this.clicks = 0;
    this.rolledNum = 0;
  }

  rollDice() {
    //if(this.clicks < 1) {}
    this.rolledNum = Math.ceil(Math.random() * 6)
    // console.log(this.rolledNum)
    this.anims.play(`${this.rolledNum}`)
    this.clicks++
    // else { }
    // this.anims.play('1')
    //this.clicks = 0

  }

  resetDice() {
    this.anims.play('reset')
  }

  // update() {
  //   this.resetDice()
  // }
}
