/** @type {import("../typings/phaser")} */
/* The above loads the phaser.d.ts file so that VSCode has autocomplete for the Phaser API.
If you experience problems with autocomplete, try opening the phaser.d.ts file and scrolling up and down in it.
That may fix the problem -- some weird quirk with VSCode. A new typing file is released with
every new release of Phaser. Make sure it's up-to-date!

At some point, the typings will
be officially added to the official release so that all you'll have to do is do:

npm install @types/phaser

But this hasn't happened yet!
*/

import 'phaser';

import MainScene from './MainScene'
import BgScene from './BgScene';
import FgScene from './FgScene';


// This will be our initial configuration for when we create the game instance
const config = {
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
  scene: [MainScene, BgScene, FgScene],
  // This option is to turn off the default behavior of images being automatically sharpened.
  // Since we're using pixel art, we want every beautiful pixel untouched!
  render: {
    pixelArt: true,
  }
};

const game = new Phaser.Game(config);
