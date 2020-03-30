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
    //console.log('QUE', this.que, 'PLAYER', this.player, 'OTHER PLAYERS', this.otherPlayers)
    this.scene.launch('BoardBg', {queue: this.queue, player: this.player, otherPlayers: this.otherPlayers});
    this.scene.launch('BoardDice', {queue: this.queue, player: this.player});

    // socket.emit("currentPlayers");
    // socket.on("currentPlayers", (players, room) => {
    //   //Find all the players in the same room
    //   console.log(players, "bssocket")
    // });

    this.input.on('pointerup', function (pointer) { //on click the scene will change
      this.scene.setVisible(false, 'BoardBg')
      this.scene.setVisible(false, 'BoardDice')
      this.scene.pause('BoardScene')
      const data = {
        first: 'ayse',
        second: 'tiffany',
        third: 'stephanie',
        fourth: 'patty',
      }
      this.scene.start('minigameTPScene', data);
    }, this);
  }
}
