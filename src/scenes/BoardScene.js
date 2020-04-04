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
    //console.log('QUE', this.que, 'PLAYER', this.player, 'OTHER PLAYERS', this.otherPlayers)
    // this.scene.add('minigameTPScene')
    this.scene.launch('BoardBg', {queue: this.queue, player: this.player, otherPlayers: this.otherPlayers});
    this.scene.launch('BoardDice', {queue: this.queue, player: this.player});

    // code below is for testing mini game directly
    // leave commented out for now

    // this.input.on('pointerup', function (pointer) { //on click the scene will change
    //   socket.emit('startMinigame');

    // }, this);

    socket.on('minigameStarted', (coin) => {
      //make the current scene sleep + minigame wake

      // const mgTP = this.scene.get('minigameTPScene')
      // mgTP.scene.restart();
      console.log('MINIGAME STARTED for ')
      console.log('this.player', this.player)
      this.scene.sleep('BoardBg').sleep('BoardDice')
      if(coin === 'tp'){
        this.scene.run('minigameTPScene', {player: this.player, otherPlayers: this.otherPlayers})
      } else {
        this.scene.run('PuzzleScene', {player: this.player, otherPlayers: this.otherPlayers})
    }
      //current scene (BoardScene)
      //could be switch or run
      // commands that don't work: launch, start
    })
  }
}
