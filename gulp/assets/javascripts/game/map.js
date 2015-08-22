/* global PIXI, _ */

import Vector2 from '../math/vector2'
import Constants from '../constants'

export default class Map extends PIXI.Container {
  constructor (game) {
    super()
    this._app = game

    this._renderedToTexture = false

    const mapSize = new Vector2(
      Constants.TILE_SIZE * Constants.MAP_TILES_X,
      Constants.TILE_SIZE * Constants.MAP_TILES_Y
    )
    this._texture = new PIXI.RenderTexture(this._app.renderer, mapSize.x, mapSize.y)
    this._sprite = new PIXI.Sprite(this._texture)
    this.addChild(this._sprite)

    this._pointSpawns = []
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
        const b = imageData[index + 2]

        if (r === 255 && g === 255 && b === 255) {
          // Wall
          row.push(1)
        } else {
          row.push(0)
        }

        // Pacman spawn
        if (r === 255 && !g && !b) {
          this._pacmanSpawns.push(new Vector2(x, y))
        }

        // Ghost spawn
        if (!r && !g && b === 255) {
          this._ghostSpawns.push(new Vector2(x, y))
        }

        // Point spawn
        if (!r && g === 255 && !b) {
          this._pointSpawns.push(new Vector2(x, y))
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

        let sprite = PIXI.Sprite.fromFrame('walls/wall.png')

        sprite.position = new Vector2(
          x * Constants.TILE_SIZE,
          y * Constants.TILE_SIZE
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

  isPositionWalkable (position) {
    const cell = this._map[position.y] && this._map[position.y][position.x]
    return cell !== 1 && typeof cell !== 'undefined' && cell !== false
  }

  getWalkablePositionWithDirection (position, direction) {
    position = position.clone()
    if (typeof direction !== undefined) {
      switch (direction) {
        case 0:
          position.add(0, -1)
          break
        case 1:
          position.add(1, 0)
          break
        case 2:
          position.add(0, 1)
          break
        case 3:
          position.add(-1, 0)
          break
      }
    }

    // console.log(position)

    return this.isPositionWalkable(position) ? position : null
  }

  get pointSpawns () { return this._pointSpawns }
  get ghostSpawns () { return this._ghostSpawns }
}
