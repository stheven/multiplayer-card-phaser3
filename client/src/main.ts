import './index.css'
import Phaser from 'phaser'
import Game from './scenes/Game'

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: [Game],
}

export default new Phaser.Game(config)
