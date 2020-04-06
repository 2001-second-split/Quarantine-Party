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
      this.scene.sleep('BoardBg').sleep('BoardDice') //make the current scene sleep + minigame wake

      const dataForMiniGames = {
        player: this.player,
        otherPlayers: this.otherPlayers
      }
      //trigger TPScene or PuzzleScene based on the coin landed
      if (coin === 'tp'){
        this.scene.run('TPScene', dataForMiniGames)
      }
      if (coin === 'puzzle'){
        this.scene.run('PuzzleScene', dataForMiniGames)
      }
    })
  }
}
