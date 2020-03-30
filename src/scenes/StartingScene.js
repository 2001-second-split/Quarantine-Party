import 'phaser'
// import io from 'socket.io-client';
import {socket} from '../index'

export default class StartingScene extends Phaser.Scene {
  constructor() {
    super('StartingScene');
  }
  preload () {
    //load sprites
    this.load.spritesheet("ayse", "assets/spriteSheets/ayse-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });
    this.load.spritesheet(
      "stephanie",
      "assets/spriteSheets/stephanie-sheet.png",{
        frameWidth: 300,
        frameHeight: 300,
        endFrame: 8
      }
    );
    this.load.spritesheet("tiffany", "assets/spriteSheets/tiffany-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });
    this.load.spritesheet("patty", "assets/spriteSheets/patty-sheet.png", {
      frameWidth: 300,
      frameHeight: 300,
      endFrame: 8
    });

    //load html element that will prompt user for input
    this.load.html('roomForm', 'assets/text/roomForm.html');
    this.load.image('pic', 'assets/backgrounds/introscene.png');
  }

  create () {
    this.add.image(400, 300, 'pic').setScale(0.5);

    let text1 = this.add.text(250, 10, 'Welcome!!!', { color: 'black', fontFamily: 'Arial', fontSize: '24px '});
    let text2 = this.add.text(250, 50, 'Please join or create a game', { color: 'black', fontFamily: 'Arial', fontSize: '16px '});

    // element that lets you create or join a room
    let domElement = this.add.dom(400, 600).createFromCache('roomForm');
    domElement.setPerspective(800);
    domElement.addListener('click');

    domElement.on('click', function (event) {

      const username = domElement.getChildByName('username');
      const roomId = domElement.getChildByName('roomId');
      const spriteSkin =  domElement.getChildByName('spriteSkin')
      let data={}
      data.roomCreator = false;

      if (event.target.name === 'createButton') {
        data.roomCreator = true;
      }

      if (event.target.name === 'joinButton') {
        // Lets them know if room is full
        socket.on('roomFull', () => {
          alert("sorry, room is full")
          return;
        })
      }

      //  Have they entered anything?
      if (username.value !== '' && roomId.value !== '') {
        //  Turn off the click events
        domElement.removeListener('click');
      } else {
        //  Flash the prompt
        this.scene.tweens.add({ targets: text1, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
      }

      // NOTE: WE ARE SUBSCRIBING BEFORE WAITFG LISTENERS ARE CREATED
      socket.emit('subscribe', roomId.value, spriteSkin.value)

      socket.on('createdOrJoinedRoom', () => {
        //Take user to the waiting scene
        this.scene.start('WaitScene', data)

    })

    }, this);

    this.tweens.add({
        targets: domElement,
        y: 250,
        duration: 3000,
        ease: 'Power3'
    });
  }
}
