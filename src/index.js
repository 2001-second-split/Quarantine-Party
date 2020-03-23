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
import BoardDice from './scenes/BoardDice'

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
    this.scene.add('BoardDice', BoardDice)

    this.scene.add('minigameTPScene', minigameTPScene)

    // Start the game with the mainscene
    this.scene.start('WaitScene')
  }

  create() {
    var self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();
    this.socket.on('currentPlayers', function (players) {
      Object.keys(players).forEach(function (id) {
        if (players[id].playerId === self.socket.id) {
          this.addPlayer(self, players[id]);
        } else {
          addOtherPlayers(self, players[id]);
        }
      });
    });
    this.socket.on('newPlayer', function (playerInfo) {
      addOtherPlayers(self, playerInfo);
    });
    this.socket.on('disconnect', function (playerId) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
      });
    });

    this.socket.on('playerMoved', function (playerInfo) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setRotation(playerInfo.rotation);
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });

    // this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
    // this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });

    this.socket.on('scoreUpdate', function (scores) {
      self.blueScoreText.setText('Blue: ' + scores.blue);
      self.redScoreText.setText('Red: ' + scores.red);
    });

    this.socket.on('starLocation', function (starLocation) {
      if (self.star) self.star.destroy();
      self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
      self.physics.add.overlap(self.ship, self.star, function () {
        this.socket.emit('starCollected');
      }, null, self);
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addPlayer(self, playerInfo) {
    self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    if (playerInfo.team === 'blue') {
      self.ship.setTint(0x0000ff);
    } else {
      self.ship.setTint(0xff0000);
    }
    self.ship.setDrag(100);
    self.ship.setAngularDrag(100);
    self.ship.setMaxVelocity(200);
  }

  addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    if (playerInfo.team === 'blue') {
      otherPlayer.setTint(0x0000ff);
    } else {
      otherPlayer.setTint(0xff0000);
    }
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
  }

}



// Create new instance of game
window.onload = function () {
  window.game = new Game();

  // comment out the game you don't want to play
  // window.game = new FullBlastAcademy();
  // window.game = new MiniGameTP();
}
