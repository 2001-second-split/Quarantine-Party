import 'phaser'

export default class Laser extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'laserBolt')

    //store reference of scene passed to constructor
    this.scene = scene;
    this.lifespan = 0
    this.speed = Phaser.Math.GetSpeed(800, 1)

    // add laser to scene and enable physics
    this.scene.physics.world.enable(this)
    this.scene.add.existing(this)

    //scale laser
    this.setScale(.25)

  }

    update(direction, delta) {
      // console.log('hot')
      this.lifespan -= delta
      if(this.direction === 'right') {
        this.x += this.speed * delta
      } else {
        this.x -= this.speed * delta
      }
      if(this.lifespan <= 0) {
        this.setActive(false)
        this.setVisible(false)
      }
    }

    fire(x, y, left) {
      this.setActive(true)
      this.setVisible(true)
      this.body.allowGravity = false
      this.lifespan = 900
    if (!left) {
      this.setPosition(x + 56, y + 14);
      this.direction = 'right';
    } else {
      this.setPosition(x - 56, y + 14);
      this.direction = 'left';
    }
  }
}
