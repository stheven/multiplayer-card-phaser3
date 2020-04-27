export default class Card {
  constructor(private scene: Phaser.Scene) {}

  render = (x: number, y: number, sprite: string) => {
    let card = this.scene.add
      .image(x, y, sprite)
      .setScale(0.3, 0.3)
      .setInteractive()
    this.scene.input.setDraggable(card)
    return card
  }
}
