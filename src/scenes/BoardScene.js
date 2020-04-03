import 'phaser'
import { socket } from "../index";
// import minigameTPScene from './MinigameTP';

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

    // code below is for testing mini game directly
    // leave commented out for now

    // this.input.on('pointerup', function (pointer) { //on click the scene will change
    //   socket.emit('startMinigame');

    // }, this);

    socket.on('minigameStarted', () => {

      //make the current scene sleep + minigame wake
      const passtoMiniGame = {
        player: this.player,
        otherPlayers: this.otherPlayers
      }

      console.log('MINIGAME STARTED for ')
      console.log('this.player', this.player)

      this.scene.sleep('BoardBg').sleep('BoardDice')
      this.scene.run('minigameTPScene', passtoMiniGame)
      // using SWITCH doesn't let data be passed to minigame

    })
  }
}
