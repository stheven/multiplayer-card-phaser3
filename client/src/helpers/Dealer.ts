import Card from './Card'
import Game from '../scenes/Game'

export type Scene = {
  isPlayerA: boolean
  opponentCards: Phaser.GameObjects.Image[]
} & Phaser.Scene

export default class Dealer {
  constructor(private scene: Scene) {}

  dealCards = () => {
    let playerSprite: string
    let opponenteSprite: string

    if (this.scene.isPlayerA) {
      playerSprite = 'cyanCardFront'
      opponenteSprite = 'magentaCardBack'
    } else {
      playerSprite = 'magentaCardBack'
      opponenteSprite = 'cyanCardFront'
    }

    for (let i = 0; i < 5; i++) {
      let playerCard = new Card(this.scene)
      playerCard.render(475 + i * 100, 650, playerSprite)

      let opponentCard = new Card(this.scene)
      this.scene.opponentCards.push(
        opponentCard
          .render(475 + i * 100, 125, opponenteSprite)
          .disableInteractive()
      )
    }
  }
}
