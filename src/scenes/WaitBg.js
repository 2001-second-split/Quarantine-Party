import 'phaser';
import { socket } from '..';
import Align from '../entity/Align'

export default class WaitBg extends Phaser.Scene {
  constructor() {
    super('WaitBg');
  }

  preload() {
    // Preload Sprites
    // placeholder text
    this.load.spritesheet("startBtn", "assets/sprites/startbtn.png", {
      frameWidth: 500,
      frameHeight: 300,
    })
    // this.load.image('waitingRoomBanner', 'assets/backgrounds/waitingRoomBanner.png')

  }

  create(data) {

    //data received from StartingScene --> WaitScene --> WaitBg
    const roomCreator = data.roomCreator;

    // Create Sprites
    let waitingBg = this.add.image(0, 0, 'pic');
    // this.add.image(380,80,'waitingRoomBanner').setScale(5)
    Align.scaleToGame(waitingBg, 1)
    Align.center(waitingBg)

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
          console.log('OVER')
          console.log('THIS', this)
          this.setFrame(1)
        })

        startButton.on('pointerup', function(){
          this.setFrame(0)
        })

        //when mouse is released, emit transitionToBoard & listen for it in WaitFg (since we want to pass the queue info)
        startButton.on('pointerup', () => {
          socket.emit('transitionToBoard')
        })
      }
    })
  }
}
