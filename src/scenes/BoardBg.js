import 'phaser';
import {socket} from '../index'
import Align from '../entity/Align';
// import minigameTPScene from './MinigameTP';


export default class BoardBg extends Phaser.Scene {
  constructor() {
    super('BoardBg');
    //define path that a user can traverse, add an aditional paramater for coins
    this.walkablePath = [
      [0, 0], [0, 1], [0, 2], [0, 3, 'red'],
      [0, 4], [0, 5], [1, 5], [2, 5, 'blue'],
      [2, 4], [2, 3], [2, 2], [3, 2],
      [4, 2], [4, 1, 'red'], [5, 1], [6, 1],
      [6, 2], [6, 3, 'blue'], [6, 4], [6, 5],
      [5, 5], [4, 5], [4, 6], [4, 7]
    ]
    // associate character names with corresponding tiles in tilemap
    this.characterIndexes = {ayse: 68, stephanie: 69, tiffany: 70, patty: 71}
    this.charPosition = {}
    this.distanceToEnd = {}
  }

  init(data){
    console.log('BoardBg - init data', data)
    this.queue = data.queue
    this.player = data.player
    this.otherPlayers = data.otherPlayers
  }

  preload() {
    // Preload map & sprites
    this.load.image('sky', 'assets/backgrounds/sky.png')

    this.load.json('map', 'assets/backgrounds/final_boardCSV.json');
    this.load.spritesheet('tiles','assets/spriteSheets/boardWChars.png', {frameWidth: 128, frameHeight: 128})
  }

  create() {
    let sky = this.add.image(0,0,'sky')
    Align.scaleToGame(sky,1)
    Align.center(sky)

    //Parse the board data from the map file
    this.data = this.cache.json.get('map');
    console.log('this in boardbg', this)
    this.tileWidthHalf = this.data.tilewidth / 2;
    this.tileHeightHalf = this.data.tileheight / 2;

    this.mapheight = 8
    this.mapwidth = 8

    this.centerX = this.mapwidth * this.tileWidthHalf + 50;
    this.centerY = 80;

    //build map
    this.buildMap()

    this.queuePrompt = this.add.text(700, 16, `${this.capitalizeFirst(this.queue[0])} starts! Click the dice...`, { fontFamily: 'Verdana', fontSize: 32, fill: '#FFF', stroke: '#000000', strokeThickness: 4 })

    this.currentLeader = this.add.text(50, 16, `${this.capitalizeFirst(this.queue[0])} is in the lead!`, { fontFamily: 'Verdana', fontSize: 32, fill: '#FFF', stroke: '#000000', strokeThickness: 4 })

    //place first player in line to tile 0
    socket.emit('placeOnBoard', 0, this.queue[0])

    socket.on('placedOnBoard', (rolledNum, charName) => {
      console.log("BoardBG - placed on Board, called by ", this.player.name)
      this.moveCharacter(rolledNum, charName)
    })


    //listen for movement on board
    socket.on('moveCharOnBoard', (rolledNum, charName) => {
      console.log("BoardBG - move char on board")
      this.moveCharacter(rolledNum, charName)

      //Update queue once a player moves. This will first update the queue in BoardDice and then BoardBg (in next render cycle)

      socket.emit('unshiftQueue')
      //check the next in player in queue. Place the player on the board if she is not already
      if(typeof this.charPosition[this.queue[1]] === 'undefined'){
        socket.emit('placeOnBoard', 0, this.queue[1])
      }

    })

    //listen for changes in queue, update background queue prompt accordingly
    socket.on('changeQueuePrompt', currentPlayer => {
      console.log("BoardBg - in changeQueuePrompt")
      this.queuePrompt.destroy()
      this.queuePrompt = this.add.text(700, 16, `${this.capitalizeFirst(currentPlayer)}'s turn! Click the Dice`, { fontFamily: 'Verdana', fontSize: 32, fill: '#FFF', stroke: '#000000', strokeThickness: 4 })

      let lowestNum = Math.min(...Object.values(this.distanceToEnd))
      let nameCurrent = this.queue.find(name => this.distanceToEnd[name] === lowestNum)
      this.currentLeader.destroy()
      this.currentLeader = this.add.text(50, 16, `${this.capitalizeFirst(nameCurrent)} is in the lead!`, { fontFamily: 'Verdana', fontSize: 32, fill: '#FFF', stroke: '#000000', strokeThickness: 4  })
    })

    //listen for minigames
    // socket.on('minigameStarted', () => {
    //   //make the current scene sleep + starts minigame
    //   // this.scene.add('minigameTPScene')
    //   // this.scene.switch('minigameTPScene', {queue: this.queue, player: this.player, otherPlayers: this.otherPlayers})
    //   this.scene.sleep('BoardBg')
    //   .sleep('BoardDice')
    //   .sleep('BoardScene');
    //   this.scene.run('minigameTPScene')
    // })

  } // end create

  capitalizeFirst(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  buildMap (){
    // construct the map from the bottom layer up.
    for (let i = 0; i < this.data.layers.length; i++){
      const layer = this.data.layers[i].data;
        //keep track of the instance in layer you are building
        let j = 0;

        //loop over the height and the width of the layer
        for (let y = 0; y < this.mapheight; y++){
            for (let x = 0; x < this.mapwidth; x++){
                const id = layer[j] - 1;
                if(id >= 0) {
                  //convert Cartesian coord to isometric
                  const tx = (x - y) * this.tileWidthHalf;
                  const ty = (x + y) * this.tileHeightHalf;
                  //grab current iteration of tile from map and place it on isometric coords
                  const tile = this.add.image(this.centerX + tx, this.centerY + ty, 'tiles', id);
                  //give depth to the tile
                  tile.depth = this.centerY + ty;
                }
                j++;
            }
        }
    }
  }
  //on transition to Board
  //place whomever is infront in que to tile 0
  // placeCharacters(player, queue){
  //   if (player === queue[0]){
  //     this.moveCharacter(0, player)
  //   }
  // }



  moveCharacter(idx, charName) {
    //if character was already on a tile get its index
    const charExists = typeof this.charPosition[charName] !== 'undefined'

    const prevIdx = charExists? this.charPosition[charName].prevIndex : 0
    console.log('MoveCharacter function - CHAR', charName, 'PREV INDEX', prevIdx)

    //if user throws a dice larger than the spaces left on the board, the user wins
    if((prevIdx  + idx) >= (this.walkablePath.length -1)){
      console.log('YOU WON');
      //EMIT THIS TO EVERYONE

      // disable board scene
      // this.scene.setVisible(false, 'BoardBg')
      // this.scene.setVisible(false, 'BoardDice')
      // this.scene.pause('BoardScene')

      //data to pass to endScene
      const notWinners = this.queue.filter(name => name !== charName)

      const data = {
        first: charName,
        second: notWinners[0],
        third: notWinners[1],
        fourth: notWinners[2],
      }
      // transition to end scene
      this.scene.stop('BoardBg')
      this.scene.stop('BoardDice')
      this.scene.start('EndScene', data);

      // this.scene.transition({
      //   target: 'EndScene',
      //   data: data,
      //   duration: 100000 //wait 3 seconds before transitioning
      // })


      return
    } // end winner function


    //convert Cartesian coords to isometric ones
    const x = this.walkablePath[idx + prevIdx][0];
    const y = this.walkablePath[idx + prevIdx][1];

    const tx = (x - y) * this.tileWidthHalf;
    const ty = (x + y) * this.tileHeightHalf;
    //if character is on the board, remove it from its previous position
    if(charExists){
      this.charPosition[charName].destroy()
      delete this.charPosition[charName]
    }
    //place character to its new location

    const movedChar = this.add.image(this.centerX + tx, this.centerY + ty, 'tiles', this.characterIndexes[charName]);

    movedChar.depth = this.centerY + ty
    movedChar.prevIndex = prevIdx + idx
    console.log('PREVIDX +IDX', movedChar.prevIndex)

    // once prevIndex updated, add to distanceToEndObject
    this.distanceToEnd[charName] = this.walkablePath.length - movedChar.prevIndex
    console.log("distance to the end", this.distanceToEnd)

    this.charPosition[charName] = movedChar
    //update characters' previous location index by adding current index
    //charPosition[charName].prevIndex = prevIdx > 0 ? prevIdx + idx: idx

    //after placing the character to new position, check to see if he lands on a coin
    //trigger minigame if on a coin
    if(charExists &&  this.walkablePath[this.charPosition[charName].prevIndex].length === 3){
      const coin = this.walkablePath[this.charPosition[charName].prevIndex][3]
      console.log("stepped on a coin")
      socket.emit('startMinigame', coin)
    }
  }

}
