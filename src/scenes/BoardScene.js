import 'phaser'
import { socket } from "../index";

export default class BoardScene extends Phaser.Scene {
  constructor() {
    super('BoardScene');
  }

  init(data){
    this.queue = data.queue
    this.player = data.player
    this.otherPlayers = data.otherPlayers
  }

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch('BoardBg', {queue: this.queue, player: this.player, otherPlayers: this.otherPlayers});
    this.scene.launch('BoardDice', {queue: this.queue, player: this.player});

    socket.on('minigameStarted', (coin) => {
      //make the current scene sleep + minigame wake
      this.scene.sleep('BoardBg').sleep('BoardDice')
      //trigger minigameTPScene or PuzzleScene based on the coin landed
      if(coin === 'tp'){
        this.scene.run('minigameTPScene', {player: this.player, otherPlayers: this.otherPlayers})
      } else if(coin === 'puzzle'){
        this.scene.run('PuzzleScene', {player: this.player, otherPlayers: this.otherPlayers})
      }
    })
  }
}
