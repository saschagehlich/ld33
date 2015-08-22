/* global PIXI, _ */

import Vector2 from '../math/vector2'
import Constants from '../constants'

export default class Map extends PIXI.Container {
  constructor (game) {
    super()
    this._app = game

    this._renderedToTexture = false

    const { canvasSize } = this._app
    const mapSize = new Vector2(
      Constants.SPRITE_SIZE * Constants.MAP_TILES_X,
      Constants.SPRITE_SIZE * Constants.MAP_TILES_Y
    )
    this._texture = new PIXI.RenderTexture(this._app.renderer, mapSize.x, mapSize.y)
    this._sprite = new PIXI.Sprite(this._texture)
    this._sprite.anchor = new Vector2(0.5, 0.5)
    this._sprite.position = canvasSize.clone().divide(2)

    this.addChild(this._sprite)

    this._pacmanSpawns = []
    this._ghostSpawns = []

    this._map = this._readMapData()
  }

  getRandomPacmanSpawn () {
    return _.sample(this._pacmanSpawns)
  }

  update (delta) {

  }

  _readMapData () {
    const { resources } = this._app
    const mapImage = resources.map.data

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = mapImage.width
    tempCanvas.height = mapImage.height
    const tempContext = tempCanvas.getContext('2d')

    tempContext.drawImage(mapImage, 0, 0)
    const imageData = tempContext.getImageData(0, 0, mapImage.width, mapImage.height).data

    let map = []
    for (let y = 0; y < mapImage.height; y++) {
      let row = []
      for (let x = 0; x < mapImage.width; x++) {
        const index = ((y * mapImage.width) + x) * 4

        const r = imageData[index]
        const g = imageData[index + 1]
        const b = imageData[index + 1]

        if (r === 255 && g === 255 && b === 255) {
          // Wall
          row.push(1)
        } else {
          row.push(0)
        }

        if (r === 255 && !g && !b) {
          // Pacman spawn
          this._pacmanSpawns.push(new Vector2(x, y))
        }

        if (!r && !g && b === 255) {
          // Ghost spawn
          this._ghostSpawns.push(new Vector2(x, y))
        }
      }
      map.push(row)
    }
    return map
  }

  _renderToTexture () {
    this._texture.clear()

    const container = new PIXI.Container()

    this._map.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (!cell) return

        let sprite = PIXI.Sprite.fromFrame('cross.png')

        sprite.position = new Vector2(
          x * Constants.SPRITE_SIZE,
          y * Constants.SPRITE_SIZE
        )

        container.addChild(sprite)
      })
    })

    this._texture.render(container)
    this._renderedToTexture = true
  }

  render (renderer) {
    if (!this._renderedToTexture) {
      this._renderToTexture()
    }
  }
}
