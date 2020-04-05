/** @type {import("../typings/phaser")} */
/* The above loads the phaser.d.ts file so that VSCode has autocomplete for the Phaser API.
*/

// Bring in all the scenes
import 'phaser';

//import all scenes
import {keys, scenes} from './scenes'

//socket related
import io from 'socket.io-client';
export const socket = io("http://localhost:3000") // development
// export const socket = io(); // production (heroku)

import config from './config/config'

class Game extends Phaser.Game {
  constructor() {
    // Add the config file to the game
    super(config);

    //Add all scenes
    for (let i = 0; i < keys.length; i++){
      this.scene.add(keys[i], scenes[i])
    }
    // Start the game with the starting scene
    this.scene.start('StartingScene')
  }
}

// Create new instance of game
window.onload = function () {
  window.game = new Game();
}
