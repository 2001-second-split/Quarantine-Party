/** @type {import("../typings/phaser")} */
// The above loads the phaser.d.ts file so that VSCode has autocomplete for the Phaser API.

// Import dependencies
import 'phaser';
import io from 'socket.io-client';
import scenes from './scenes'

//configure game settings
var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'parent',
  //resize and recenter height/width when browser size is changed
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  //create dom element on top of canvas to prompt the user to join a game
  dom: {
      createContainer: true
  },
  scene: [{
      preload: preload,
      create: create
  }].concat(scenes),
  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },  // Game objects will be pulled down along the y-axis
      debug: false,
    }
  }
};


const game = new Phaser.Game(config);
export const socket = io("http://localhost:3000")
function preload ()
{
  //load html element that will prompt user for input
  this.load.html('roomForm', 'assets/text/roomForm.html');
  this.load.image('pic', 'assets/backgrounds/pic.png');
}

function create ()
{
  this.add.image(400, 300, 'pic');
  let text = this.add.text(10, 10, 'Please join or create a game', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});
  //create socket
  this.socket = socket

  let domElement = this.add.dom(400, 600).createFromCache('roomForm');
  domElement.setPerspective(800);
  domElement.addListener('click');

  domElement.on('click', function (event) {
      if (event.target.name === 'createButton' || event.target.name === 'joinButton')
      {
          const username = domElement.getChildByName('username');
          const roomId = domElement.getChildByName('roomId');

          //  Have they entered anything?
          if (username.value !== '' && roomId.value !== '')
          {
              //  Turn off the click events
              domElement.removeListener('click');

              //Take user to the waiting scene
              this.scene.start('WaitScene')
              this.socket.emit('subscribe', roomId.value)
          }
          else
          {
              //  Flash the prompt
              this.scene.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
          }
      }

  }, this);

  this.tweens.add({
      targets: domElement,
      y: 300,
      duration: 3000,
      ease: 'Power3'
  });
}
