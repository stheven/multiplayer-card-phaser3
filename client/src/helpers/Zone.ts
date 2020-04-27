export default class Zone {
  constructor(private scene: Phaser.Scene) {}

  renderZone = () => {
    let dropZone = this.scene.add
      .zone(700, 375, 900, 250)
      .setRectangleDropZone(900, 250)

    dropZone.setData({
      cards: 0,
    })
    return dropZone
  }

  renderOutline = (dropZone: Phaser.GameObjects.Zone) => {
    let dropZoneOutline = this.scene.add.graphics()
    dropZoneOutline.lineStyle(4, 0xff69b4)
    dropZoneOutline.strokeRect(
      dropZone.x - dropZone.input.hitArea.width / 2,
      dropZone.y - dropZone.input.hitArea.height / 2,
      dropZone.input.hitArea.width,
      dropZone.input.hitArea.height
    )
    return dropZoneOutline
  }
}
