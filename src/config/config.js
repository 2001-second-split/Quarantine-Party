export const config = {
  key: 'Game',
  type: Phaser.AUTO,  // rendering engine (AUTO, CANVAS, WEBGL)
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  //enable dom elements in the game
  dom: {
    createContainer: true
  },
  width: window.innerWidth,   // Game width in pixels
  height: window.innerHeight,  // Game height in pixels
  render: {
    pixelArt: true,   // This option is to turn off the default behavior of images being automatically sharpened.
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },  // Game objects will be pulled down along the y-axis
      debug: false,
    }
  }
}
