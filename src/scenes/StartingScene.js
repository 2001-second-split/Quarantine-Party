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

    let text = this.add.text(250, 10, 'Welcome!!!', { color: 'black', fontFamily: 'Arial', fontSize: '24px '});
    let text2 = this.add.text(250, 50, 'Please join or create a game', { color: 'black', fontFamily: 'Arial', fontSize: '16px '});

    // create socket
    // this.socket = socket

    let domElement = this.add.dom(400, 600).createFromCache('roomForm');
    domElement.setPerspective(800);
    domElement.addListener('click');

    domElement.on('click', function (event) {
        if (event.target.name === 'createButton' || event.target.name === 'joinButton')
        {
            const username = domElement.getChildByName('username');
            const roomId = domElement.getChildByName('roomId');
            const spriteSkin =  domElement.getChildByName('spriteSkin')


            //  Have they entered anything?
            if (username.value !== '' && roomId.value !== '')
            {
                //  Turn off the click events
                domElement.removeListener('click');

                //Take user to the waiting scene
                this.scene.start('WaitScene')

                // NOTE: WE ARE SUBSCRIBING BEFORE WAITFG LISTENERS ARE CREATED
                socket.emit('subscribe', roomId.value, spriteSkin.value)
            }
            else
            {
                //  Flash the prompt
                this.scene.tweens.add({ targets: text1, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
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
}
