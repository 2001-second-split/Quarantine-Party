//main game scenes
import StartingScene from './StartingScene'

import WaitScene from './WaitScene';
import WaitFg from './WaitFg'
import WaitBg from './WaitBg'

import BoardScene from './BoardScene'
import BoardBg from './BoardBg'
import BoardDice from './BoardDice'

import EndScene from './EndScene'

//mini game scenes
import TPScene from './TPScene';
import PuzzleScene from './PuzzleScene'

export const scenes = [StartingScene, WaitBg, WaitFg, WaitScene, BoardBg, BoardScene, BoardDice, EndScene, TPScene, PuzzleScene]

export const keys = ['StartingScene','WaitBg','WaitFg', 'WaitScene','BoardBg','BoardScene','BoardDice', 'EndScene','TPScene','PuzzleScene']


