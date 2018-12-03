import 'phaser'

export default class Ground extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'ground')
    // Store reference of scene passed to constructor
    this.scene = scene;
    // Add brandon to scene and enable physics
    this.scene.physics.world.enable(this)
    this.scene.add.existing(this)
    // Scale brandon
    // this.setScale(.25)
    // Turn him around to face player
    // this.flipX = !this.flipX;
  }
// Load his sprite into the game
  preload() {
    this.load.sprite('ground', 'assets/sprites/ground.png');
  }
}
