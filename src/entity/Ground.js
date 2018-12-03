import 'phaser';

export default class Ground extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'ground');
    // Store reference of scene passed to constructor
    this.scene = scene;
    // Add ground to scene and enable physics
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }

  // Load ground sprite into the game
  preload() {
    this.load.sprite('ground', 'assets/sprites/ground.png');
  }
}
