import 'phaser';

export default class Laser extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'laserBolt');
    // Store reference of scene passed to constructor
    this.scene = scene;
    // Set the lifespan of a laserbolt
    this.lifespan = 0;
    // Set how fast the laser travels
    this.speed = Phaser.Math.GetSpeed(800, 1);
    // Add laser to scene and enable physics
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    // Scale laser
    this.setScale(0.25);
  }

  // Check which direction the player is facing and move the laserbolt in that direction as long as it lives
  update(direction, delta) {
    this.lifespan -= delta;
    if (this.direction === 'right') {
      this.x += this.speed * delta;
    } else {
      this.x -= this.speed * delta;
    }
    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  // Create a laserbolt
  fire(x, y, left) {
    this.setActive(true);
    this.setVisible(true);
    this.body.allowGravity = false;
    this.lifespan = 900;
    if (!left) {
      this.setPosition(x + 56, y + 14);
      this.direction = 'right';
    } else {
      this.setPosition(x - 56, y + 14);
      this.direction = 'left';
    }
  }
}
