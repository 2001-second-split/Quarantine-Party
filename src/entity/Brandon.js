import gs from '../GameState'
import 'phaser'

export default class Brandon extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'brandon')

    //store reference of scene passed to constructor
    this.scene = scene;

    // add player to scene and enable physics
    this.scene.physics.world.enable(this)
    this.scene.add.existing(this)

    //scale player
    this.setScale(.25)

    //turn him around to face player
    this.flipX = !this.flipX;
  }

  preload() {
    this.load.spritesheet('brandon', 'assets/sprites/brandon.png', {
      frameWidth: 340,
      frameHeight: 460,
    });
  }
}
