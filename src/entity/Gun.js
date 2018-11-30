import gs from '../GameState'
import 'phaser'

export default class Gun extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'gun')

    //store reference of scene passed to constructor
    this.scene = scene;

    // add player to scene and enable physics
    this.scene.physics.world.enable(this)
    this.scene.add.existing(this)

    //scale player
    this.setScale(.25)

  }

  preload() {
    this.load.sprite('gun', 'assets/sprites/gun.png');
  }
}
