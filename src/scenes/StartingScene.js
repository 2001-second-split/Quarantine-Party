import 'phaser'
// import io from 'socket.io-client';
import {socket} from '../index'

export default class StartingScene extends Phaser.Scene {
  constructor() {
    super('StartingScene');
    this.disableCharsCB = this.disableCharsCB.bind(this)
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
    this.room = ''
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

    //disable already selected characters in a room
    socket.on('disableSelectedChars', (selectedChars, room) => {
      console.log('DISABLE CHAR ')
      selectedChars.forEach(char => {
        //console.log('DOM ELEMENT', domElement)
        if (this.room === room){
          const opt = domElement.getChildByID(char)
          //console.log('OPT',opt)
          opt.disabled = true;
        }
      })
    })

    // element that lets you create or join a room
    let domElement = this.add.dom(400, 600).createFromCache('roomForm');
    domElement.setPerspective(800);
    domElement.addListener('click');

    const roomId = domElement.getChildByName('roomId')
    const spriteSkin = domElement.getChildByName('spriteSkin')

    //listen for user room input and get the room name from input tag
    this.disableSelectedChars(roomId, this.disableCharsCB, 1000)

    // roomId.addEventListener('keyup', event => {
    //   this.room = event.target.value

    // })

    // if(this.room.length){
    //   console.log('THISROOM', this.room)
    //   socket.emit('disableSelectedChars', this.room)
    // }

    domElement.on('click', function (event) {
      if (event.target.name === 'createButton') {
        data.roomCreator = true;
      }
      if (event.target.name === 'joinButton') {
        data.roomCreator = false;
      }

      //  Have they entered anything?
      if (event.target.name === 'createButton' || event.target.name === 'joinButton') {

        if (roomId.value !== '' && spriteSkin.value !== '') {

          socket.emit('subscribe', roomId.value, spriteSkin.value, data.roomCreator)
          socket.emit('characterSelected', spriteSkin.value, roomId.value)
          domElement.removeListener('click'); //  Turn off the click events
          //reset the room
          this.room = ''

        }
      }

    }, this);

    this.tweens.add({
        targets: domElement,
        y: 250,
        duration: 3000,
        ease: 'Power3'
    });
  }


  disableCharsCB(evt){
    this.room = evt.target.value
    socket.emit('disableSelectedChars', this.room)
  }

  disableSelectedChars(domElt, callback, delay){
    let timer = null;
    domElt.onkeypress = (evt) => {
      if(timer) {
        window.clearTimeout(timer)
      }
      timer = window.setTimeout(function () {
        timer = null;
        callback(evt);
      }, delay)
    };
    domElt = null;
  }
}

