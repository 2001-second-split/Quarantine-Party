import 'phaser'
import { socket } from "../index";

export default class BoardScene extends Phaser.Scene {
  constructor() {
    super('BoardScene');
  }

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch('BoardBg');
    this.scene.launch('BoardDice');

    socket.emit("currentPlayers");
    socket.on("currentPlayers", (players, room) => {
      //Find all the players in the same room
      // console.log(players, "socket")
    });

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
