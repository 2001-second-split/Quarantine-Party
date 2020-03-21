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

//fullblast academy scenes
import MainSceneFBA from './scenes/MainScene-FBA'
import BgSceneFBA from './scenes/BgScene-FBA';
import FgSceneFBA from './scenes/FgScene-FBA';

//minigame scenes
import minigameTPScene from './scenes/MinigameTP';

//main game scene
import WaitingScene from './scenes/WaitingScene';
import FgSceneWait from './scenes/FgScene-Waiting'
import BgSceneWait from './scenes/BgScene-Waiting'

//import BoardScene from './scenes/BoardScene'
import FgSceneBoard from './scenes/FgScene-Board'
import BgSceneBoard from './scenes/BgScene-Board'

import config, {fbaConfig, minigameTPconfig } from './config/config'

class Game extends Phaser.Game {
  constructor() {
    // Add the config file to the game
    super(config);

    // Add all the scenes
    // var newScene = game.scene.add(key, sceneConfig, autoStart, data);
    this.scene.add('BgSceneWait', BgSceneWait)
    this.scene.add('FgSceneWait', FgSceneWait)
    this.scene.add('WaitingScene', WaitingScene)

    this.scene.add('BgSceneBoard', BgSceneBoard)
    this.scene.add('FgSceneBoard', FgSceneBoard)
    //this.scene.add('BoardScene', BoardScene)

    this.scene.add('minigameTPScene', minigameTPScene)


    // Start the game with the mainscene
    this.scene.start('WaitingScene')
  }
}

class FullBlastAcademy extends Phaser.Game {
  constructor() {
    // Add the config file to the game
    super(fbaConfig);

    // Add all the scenes
    this.scene.add('BgSceneFBA', BgSceneFBA)
    this.scene.add('FgSceneFBA', FgSceneFBA)
    this.scene.add('MainSceneFBA', MainSceneFBA)

    // Start the game with the mainscene
    this.scene.start('MainSceneFBA')
  }
}

class MiniGameTP extends Phaser.Game {
  constructor() {
    super(minigameTPconfig);

    this.scene.add('minigameTPScene', minigameTPScene)

    this.scene.start('minigameTPScene')
  }
}

// Create new instance of game
window.onload = function () {
  window.game = new Game();

  // comment out the game you don't want to play
  // window.game = new FullBlastAcademy();
  // window.game = new MiniGameTP();
}
