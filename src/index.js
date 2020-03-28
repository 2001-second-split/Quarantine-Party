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
import BoardFg from './scenes/BoardFg'
import BoardBg from './scenes/BoardBg'
import BoardDice from './scenes/BoardDice'

import EndScene from './scenes/EndScene';

//socket related
import io from 'socket.io-client';
export const socket = io("http://localhost:3000") //this is what starts the socket connection

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
    this.scene.add('BoardFg', BoardFg)
    this.scene.add('BoardScene', BoardScene)
    this.scene.add('BoardDice', BoardDice)

    this.scene.add('EndScene', EndScene)

    this.scene.add('minigameTPScene', minigameTPScene)

    // Start the game with the mainscene
    this.scene.start('StartingScene')
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    }
    else{
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

}



// Create new instance of game
window.onload = function () {
  window.game = new Game();

  // comment out the game you don't want to play
  // window.game = new FullBlastAcademy();
  // window.game = new MiniGameTP();
}
