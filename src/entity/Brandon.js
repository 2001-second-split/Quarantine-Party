import 'phaser';

export default class Brandon extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'brandon');
    // Store reference of scene passed to constructor
    this.scene = scene;
    // Add brandon to scene and enable physics
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    // Scale brandon
    this.setScale(0.25);
    // Turn him around to face player
    this.flipX = !this.flipX;
    this.playedSound = false;
  }

  // Load his sprite into the game
  preload() {
    this.load.spritesheet('brandon', 'assets/sprites/brandon.png', {
      frameWidth: 340,
      frameHeight: 460,
    });
  }

  update(screamSound) {
    if (this.y > 600 && !this.playedSound) {
      this.playedSound = true;
      screamSound.play();
    }
  }
}
