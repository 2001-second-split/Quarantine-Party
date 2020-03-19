import 'phaser';

export default class Ground extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    // Store reference of scene passed to constructor
    this.scene = scene;
    // Add ground to scene and enable physics
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
}
