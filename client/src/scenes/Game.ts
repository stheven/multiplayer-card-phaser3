import Card from '../helpers/Card'
import Phaser from 'phaser'
import Zone from '../helpers/Zone'
import io from 'socket.io-client'
import Dealer, { Scene } from '../helpers/Dealer'

export default class Game extends Phaser.Scene {
  private zone: Zone
  private dropZone: Phaser.GameObjects.Zone
  private outline: Phaser.GameObjects.Graphics
  private dealText: Phaser.GameObjects.Text
  private socket: SocketIOClient.Socket
  private isPlayerA: boolean
  private opponentCards: Phaser.GameObjects.Image[]
  private dealer: Dealer

  constructor() {
    super({
      key: 'Game',
    })
  }

  preload() {
    this.load.image('cyanCardFront', 'assets/CyanCardFront.png')
    this.load.image('cyanCardBack', 'assets/CyanCardBack.png')
    this.load.image('magentaCardFront', 'assets/MagentaCardFront.png')
    this.load.image('magentaCardBack', 'assets/MagentaCardBack.png')
  }

  create() {
    this.isPlayerA = false
    this.opponentCards = []

    this.zone = new Zone(this)
    this.dropZone = this.zone.renderZone()
    this.outline = this.zone.renderOutline(this.dropZone)
    // @ts-ignore
    this.dealer = new Dealer(this)

    this.socket = io('http://localhost:3000')

    this.socket.on('connect', () => {
      console.log('Connected!')
    })

    this.socket.on('isPlayerA', () => {
      this.isPlayerA = true
    })

    this.socket.on('dealCards', () => {
      this.dealer.dealCards()
      this.dealText.disableInteractive()
    })

    this.socket.on('cardPlayed', (gameObject, isPlayerA) => {
      if (isPlayerA !== this.isPlayerA) {
        let sprite = gameObject.textureKey
        this.opponentCards.shift().destroy()
        this.dropZone.data.values.cards++
        let card = new Card(this)
        card
          .render(
            this.dropZone.x - 350 + this.dropZone.data.values.cards * 50,
            this.dropZone.y,
            sprite
          )
          .disableInteractive()
      }
    })

    this.dealText = this.add
      .text(75, 350, ['DEAL CARDS'])
      .setFontSize(18)
      .setFontFamily('Trebuchet MS')
      .setColor('#00FFFF')
      .setInteractive()

    this.dealText.on('pointerdown', () => {
      this.socket.emit('dealCards')
    })

    this.dealText.on('pointerover', () => {
      this.dealText.setColor('#FF69b4')
    })

    this.dealText.on('pointerout', () => {
      this.dealText.setColor('#00FFFF')
    })

    this.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setTint(0xff669b4)
      this.children.bringToTop(gameObject)
    })

    this.input.on('dragend', (pointer, gameObject, dropped) => {
      gameObject.setTint()

      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX
        gameObject.y = gameObject.input.dragStartY
      }
    })

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY
    })

    this.input.on('drop', (pointer, gameObect, dropZone) => {
      dropZone.data.values.cards++
      gameObect.x = dropZone.x - 350 + dropZone.data.values.cards * 50
      gameObect.y = dropZone.y

      gameObect.disableInteractive()

      this.socket.emit('cardPlayed', gameObect, this.isPlayerA)
    })
  }

  update() {}
}
