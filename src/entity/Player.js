import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'josh');

    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
  }

  // Load our player spritesheet into game
  preload() {
    // << INSERT CODE HERE >>
  }

  // Check which controller button is being pushed and execute movement & animation
  update() {
    // << INSERT CODE HERE >>
  }
}
