import 'phaser';

export default class Gun extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
    this.scene = scene;
    this.scene.add.existing(this);

    this.scene.physics.world.enable(this);

    // Set the firing delay (ms)
    this.fireDelay = 100;
    // Keep track of when the gun was last fired
    this.lastFired = 0;
  }

  // Check if the shoot button is pressed and how long its been since we last fired
  update(time, player, cursors, fireLaserFn, laserSound) {
    if (cursors.space.isDown && time > this.lastFired) {
      if (player.armed) {
        laserSound.play()
        fireLaserFn();    // We'll implement this function in FgScene
        this.lastFired = time + this.fireDelay;
      }
    }
  }
}
