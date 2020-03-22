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
import WaitScene from './scenes/WaitScene';
import WaitFg from './scenes/WaitFg'
import WaitBg from './scenes/WaitBg'

import BoardScene from './scenes/BoardScene'
import BoardFg from './scenes/BoardFg'
import BoardBg from './scenes/BoardBg'

import config from './config/config'

class Game extends Phaser.Game {
  constructor() {
    // Add the config file to the game
    super(config);

    // Add all the scenes
    // var newScene = game.scene.add(key, sceneConfig, autoStart, data);
    this.scene.add('WaitBg', WaitBg)
    this.scene.add('WaitFg', WaitFg)
    this.scene.add('WaitScene', WaitScene)

    this.scene.add('BoardBg', BoardBg)
    this.scene.add('BoardFg', BoardFg)
    this.scene.add('BoardScene', BoardScene)

    this.scene.add('minigameTPScene', minigameTPScene)


    // Start the game with the mainscene
    this.scene.start('WaitScene')
  }
}



// Create new instance of game
window.onload = function () {
  window.game = new Game();

  // comment out the game you don't want to play
  // window.game = new FullBlastAcademy();
  // window.game = new MiniGameTP();
}
