import 'phaser'
import {socket} from '../index'
import Align from '../entity/Align'

export default class StartingScene extends Phaser.Scene {
  constructor() {
    super('StartingScene');
    this.disableCharsCB = this.disableCharsCB.bind(this)
  }

  preload () {
    //load sprites
    const spriteKeys = ["ayse", "stephanie", "tiffany", "patty"]
    spriteKeys.forEach(key => {
      this.load.spritesheet(key, `assets/spriteSheets/${key}-sheet.png`, {
        frameWidth: 300,
        frameHeight: 300,
        endFrame: 8
      });
    })

    //load html element that will prompt user for input
    this.load.html('roomForm', 'assets/text/roomForm.html');

    //load background image
    this.load.image('picBg','assets/backgrounds/introBg.png');

    //load bg audio
    this.load.audio('backgroundmusic', 'assets/audio/backgroundmusic.wav');
  }

  create () {
    let music = this.sound.add('backgroundmusic')
    music.play();
    music.setVolume(0.25);
    music.setLoop(true)

    let bg = this.add.image(0, 0, 'picBg');
    Align.scaleToGame(bg, 1)
    Align.center(bg)

    this.room = ''
    let data = {} //data to be passed to WaitBG for button purposes

    /*      SOCKETS       */
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
      selectedChars.forEach(char => {
        if (this.room === room){
          const opt = domElement.getChildByID(char)
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

    domElement.on('click', (event) => {
      if (event.target.name === 'createButton') {
        data.roomCreator = true;
      }
      if (event.target.name === 'joinButton') {
        data.roomCreator = false;
      }

      //  Have they entered anything?
      if (event.target.name === 'createButton' || event.target.name === 'joinButton') {

        if (roomId.value !== '' && spriteSkin.value !== '') {
          data.roomId = roomId.value
          socket.emit('subscribe', roomId.value, spriteSkin.value, data.roomCreator)
          socket.emit('characterSelected', spriteSkin.value, roomId.value)
          domElement.removeListener('click'); //  Turn off the click events
          //reset the room
          this.room = ''
        } else {
          alert('Please select valid room and/or character')
        }
      }

    });

    this.tweens.add({
        targets: domElement,
        x: 200,
        y: 350,
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

  update(){
    //listen for user input on roomIand get the room name from input tag
    this.disableSelectedChars(roomId, this.disableCharsCB, 1000)
  }
}

