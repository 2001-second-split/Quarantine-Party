import 'phaser'

import io from 'socket.io-client';
import {socket} from '../index'

export default class WaitScene extends Phaser.Scene {
  constructor() {
    super('WaitScene');
  }

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch('WaitBg');
    this.scene.launch('WaitFg');

    console.log("in waitscene create")

    // "SELF" REFERS TO "THIS" IN THIS SCENE.
    // CHANGING USING "THIS" INSTEAD OF "SELF" BREAKS THE CODE
    // but feel free to try and get it to work otherwise
    const self = this;
    this.socket = socket;

    this.otherPlayers = this.physics.add.group();

    // CHECK IF CLIENT CONNECTED
    this.socket.on('connect', function(){
      console.log("client - connected");

      self.input.keyboard.on('keydown_W', function() {
        self.socket.emit('testKey')
      });

      // NOT SURE WHAT THIS DOES
      // SERVER SENDS INFO TO CLIENT SOMEONE DISCONNECTED --> YOUR CLIENT REMOVE OTHER PLAYERS ???
      this.socket.on('disconnect', function (playerId) {
        console.log("client - disconnected")

        // CODE FROM DIFFERENT EXAMPLE OF HOW TO DISCONNECT OTHER PLAYERS
        // NOT SURE IF IT WORKS
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
          if (playerId === otherPlayer.playerId) {
            otherPlayer.destroy();
          }
        });
      });

      // CHECK WHO OTHER PLAYERS ARE???
      this.socket.on('currentPlayers', function (players) {
        Object.keys(players).forEach(function (id) {
          if (players[id].playerId === self.socket.id) {
            self.addPlayer(self, players[id]);
          } else {
            self.addOtherPlayers(self, players[id]);
          }
        });
      });


    });

    // BELOW SOCKETS NEED TO BE WORKED ON


    this.socket.on('newPlayer', function (playerInfo) {
      self.addOtherPlayers(self, playerInfo);
    });


    this.socket.on('playerMoved', function (playerInfo) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setRotation(playerInfo.rotation);
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });



    // << REFERENCE FOR LATER OF HOW TO KEEP TRACK OF THINGS? >>
    // LIKE MINIGAMETP

    // SCORE TRACKING
    // this.socket.on('scoreUpdate', function (scores) {
      //   self.blueScoreText.setText('Blue: ' + scores.blue);
      //   self.redScoreText.setText('Red: ' + scores.red);
      // });

    // CAN BE USED TO CHECK BOMB LOCATION, SO ALL CLIENTS HAVE THE SAME BOMB BOUNCING AROUND
    // this.socket.on('starLocation', function (starLocation) {
    //   if (self.star) self.star.destroy();
    //   self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
    //   self.physics.add.overlap(self.ship, self.star, function () {
    //     this.socket.emit('starCollected');
    //   }, null, self);
    // });

  }

  // CODE IMPORTED FROM DIFFERENT EXAMPLE
  // NEED TO REFACTOR

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

