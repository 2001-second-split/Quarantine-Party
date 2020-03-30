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
    this.load.spritesheet("stephanie", "assets/spriteSheets/stephanie-sheet.png",{
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

    //data to be passed to WaitBG for button purposes
    let data = {}

    //sockets to receive from server
    socket.on('createdOrJoinedRoom', () => {
      //Take user to the waiting scene
      this.scene.start('WaitScene', data)
    })

    socket.on('roomFull', () => {
      alert("sorry, room is full")
    })

    socket.on('joiningNonExistingRoom', () => {
      alert("sorry, room doesn't exist")
      domElement.addListener('click');
      // when you click create/join room, the click-listener is removed
      // but if a user does not properly join, server will emit the issue to one of these sockets,
      // you have to add click-listener again so it can run through the domElement.on('click') function
    })

    socket.on('roomAlreadyCreated', () => {
      alert("sorry, room name taken")
      domElement.addListener('click');
    })

    // element that lets you create or join a room
    let domElement = this.add.dom(400, 600).createFromCache('roomForm');
    domElement.setPerspective(800);
    domElement.addListener('click');

    domElement.on('click', function (event) {

      const username = domElement.getChildByName('username');
      const roomId = domElement.getChildByName('roomId');
      const spriteSkin =  domElement.getChildByName('spriteSkin')

      if (event.target.name === 'createButton') {
        data.roomCreator = true;
      }
      if (event.target.name === 'joinButton') {
        data.roomCreator = false;
      }

      //  Have they entered anything?
      if (event.target.name === 'createButton' || event.target.name === 'joinButton') {

        if (username.value !== '' && roomId.value !== '') {

          socket.emit('subscribe', roomId.value, spriteSkin.value, data.roomCreator)
          domElement.removeListener('click'); //  Turn off the click events

        }
      }

    }, this);

    // this.tweens.add({
    //     targets: domElement,
    //     y: 250,
    //     duration: 3000,
    //     ease: 'Power3'
    // });
  }
}
