import 'phaser';
import { socket } from '..';
import Align from '../entity/Align'

export default class WaitBg extends Phaser.Scene {
  constructor() {
    super('WaitBg');
  }

  preload() {
    // Preload assets
    this.load.spritesheet("startBtn", "assets/sprites/startbtn.png", {
      frameWidth: 500,
      frameHeight: 300,
    })
    this.load.image('pic', 'assets/backgrounds/introscene.png');
  }

  create(data) {
    //data received from StartingScene --> WaitScene --> WaitBg
    const roomCreator = data.roomCreator;
    const roomId = data.roomId

    // Create Sprites
    let waitingBg = this.add.image(0, 0, 'pic');
    Align.scaleToGame(waitingBg, 1)
    Align.center(waitingBg)

    //add a header with the unique room id
    this.header = this.add.text(400, 16, `Room # ${roomId}`, { fontFamily: 'Verdana', fontSize: '28px', fill: '#713E5A' });

    //display different loading messages for game creator vs joiners
    this.loading = roomCreator
      ? this.add.text(16, 300, 'Waiting for other players to join...', { fontFamily: 'Verdana', fontSize: 64, fill: '#DCEDFF', stroke: '#000000', strokeThickness: 6})
      : this.add.text(16, 300, 'Waiting for Room Creator to start the game...', { fontFamily: 'Verdana', fontSize: 48, fill: '#DCEDFF', stroke: '#000000', strokeThickness: 6});


    //wait for all four players to join
    socket.on('playersReady', () => {
      //if the current player is the room creator enable start button
      if (roomCreator) {
        //create a "start button" for room creator
        this.loading.setActive(false).setVisible(false);
        let startButton = this.add.sprite(1100, 70, 'startBtn').setScale(0.35)

        //make it interactive! so when we click it...
        startButton.setInteractive();

        startButton.on('pointerover', function(){
          this.setFrame(1)
        })

        startButton.on('pointerout', function(){
          this.setFrame(0)
        })
        //when mouse is released, emit transitionToBoard & listen for it in WaitFg (since we want to pass the queue info)
        startButton.on('pointerup', function(){
          this.setFrame(0)
          socket.emit('transitionToBoard')
        })
      }
    })
  }
}
