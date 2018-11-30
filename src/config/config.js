export default {
  type: Phaser.AUTO,  // Specify the underlying browser rendering engine (AUTO, CANVAS, WEBGL)
                      // AUTO will attempt to use WEBGL, but if not available it'll default to CANVAS
  width: 800,   // Game width in pixels
  height: 600,  // Game height in pixels
  physics: {    // Optional: specify physics engine and configuration
    default: 'arcade',  // A simple and performant physics engine
    arcade: {
      gravity: { y: 1500 },  // Game objects will by default be affected by gravity
      debug: false,
    },
  },
  // Specify the scene(s) up front. Can also dynamically add scenes if desired.
  // Only the first scene in the array will be automatically run
  // scene: [MainScene, BgScene, FgScene],
  // This option is to turn off the default behavior of images being automatically sharpened.
  // Since we're using pixel art, we want every beautiful pixel untouched!
  render: {
    pixelArt: true,
  }
};
