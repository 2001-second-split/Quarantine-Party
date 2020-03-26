import 'phaser'
import {socket} from '../index'

export default class WaitScene extends Phaser.Scene {
  constructor() {
    super('WaitScene');
    this.socket = socket
  }

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch('WaitFg');
    //this.scene.launch('WaitBg');

    //get currentPlayers in room, and switch to board scene when all four players joined
    this.socket.on('currentPlayers', (clients) => {
      if(clients.length === 4){
        this.scene.stop('WaitScene')
        this.scene.start('BoardScene')
      }
    })
  }
}
