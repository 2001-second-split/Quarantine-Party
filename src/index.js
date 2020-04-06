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

// Bring in all the scenes
import 'phaser';

//minigame scenes
import minigameTPScene from './scenes/MinigameTP';

//main game scene
import StartingScene from './scenes/StartingScene';

import WaitScene from './scenes/WaitScene';
import WaitFg from './scenes/WaitFg'
import WaitBg from './scenes/WaitBg'

import BoardScene from './scenes/BoardScene'

import BoardBg from './scenes/BoardBg'
import BoardDice from './scenes/BoardDice'

import EndScene from './scenes/EndScene';

import PuzzleScene from './scenes/PuzzleScene'

//socket related
import io from 'socket.io-client';
export const socket = io("http://localhost:3000") // development
// export const socket = io(); // production (heroku)

import config from './config/config'


class Game extends Phaser.Game {
  constructor() {
    // Add the config file to the game
    super(config);

    // Add all the scenes
    // var newScene = game.scene.add(key, sceneConfig, autoStart, data);
    this.scene.add('StartingScene', StartingScene)

    this.scene.add('WaitBg', WaitBg)
    this.scene.add('WaitFg', WaitFg)
    this.scene.add('WaitScene', WaitScene)

    this.scene.add('BoardBg', BoardBg)
    this.scene.add('BoardScene', BoardScene)
    this.scene.add('BoardDice', BoardDice)

    this.scene.add('EndScene', EndScene)

    this.scene.add('minigameTPScene', minigameTPScene)

    this.scene.add('PuzzleScene', PuzzleScene)
    // Start the game with the mainscene
    this.scene.start('StartingScene')
  }

  init() {}

  preload() {
    // this.load.audio('backgroundmusic', 'assets/audio/backgroundmusic.wav');
  }

  create() {
    // let music = this.sound.add('backgroundmusic')
    // music.play();
  }

  update() {}

}



// Create new instance of game
window.onload = function () {
  window.game = new Game();
}
