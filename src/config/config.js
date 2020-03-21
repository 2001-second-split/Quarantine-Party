//fullblast academy imports
import FgScene from '../scenes/FgScene-FBA'
import BgScene from '../scenes/BgScene-FBA'
import MainScene from '../scenes/MainScene-FBA'

//minigame imports
import MinigameScene from '../scenes/MinigameTP';

const config = {
  key: 'default',
  type: Phaser.AUTO,  // rendering engine (AUTO, CANVAS, WEBGL)
  width: 800,   // Game width in pixels
  height: 600,  // Game height in pixels

  // Since we'll be using pixel art, we want every beautiful pixel untouched!
  render: {
    pixelArt: true,   // This option is to turn off the default behavior of images being automatically sharpened.
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },  // Game objects will be pulled down along the y-axis
      debug: false,
    }
  },

}

export const fbaConfig = {
  type: Phaser.AUTO,  // Specify the underlying browser rendering engine (AUTO, CANVAS, WEBGL)
                      // AUTO will attempt to use WEBGL, but if not available it'll default to CANVAS
  width: 800,   // Game width in pixels
  height: 600,  // Game height in pixels
  // This option is to turn off the default behavior of images being automatically sharpened.
  // Since we'll be using pixel art, we want every beautiful pixel untouched!
  render: {
    pixelArt: true,
  },
  //  We will be expanding physics later
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1500 },  // Game objects will be pulled down along the y-axis
                        // The number 1500 is arbitrary. The higher, the stronger the pull.
                        // A negative value will pull game objects up along the y-axis
      debug: false,     // Whether physics engine should run in debug mode
    }
  },

  // scene: [ MinigameScene, MainScene ]
  // scene: [ FgScene, BgScene ]
  // scene: [ FgScene, MinigameScene ]
  // scene starts on FG. once you click anywhere in FG, it changes to miniGame
};

export const minigameTPconfig = {
  key: 'minigameTP',
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: {
      preload: this.preload,
      create: this.create,
      update: this.update
  }
};

export default config;
