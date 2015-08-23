/* global PIXI, _ */

import Vector2 from '../math/vector2'
import Constants from '../constants'
import Pathfinding from 'pathfinding'

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

    this._goldSpawns = []
    this._bottleSpawns = []
    this._heroSpawns = []
    this._monsterSpawns = []

    this._map = this._readMapData()
    this._pfGrid = new Pathfinding.Grid(this._map)
    this._pfFinder = new Pathfinding.BestFirstFinder()
  }

  findPath (from, to) {
    const grid = this._pfGrid.clone()
    const path = this._pfFinder.findPath(from.x, from.y, to.x, to.y, grid)
    return path
  }

  getRandomHeroSpawn () {
    return _.sample(this._heroSpawns)
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

        // Hero spawn
        if (r === 255 && !g && !b) {
          this._heroSpawns.push(new Vector2(x, y))
        }

        // Monster spawn
        if (!r && !g && b === 255) {
          this._monsterSpawns.push(new Vector2(x, y))
        }

        // Gold spawn
        if (!r && g === 255 && !b) {
          this._goldSpawns.push(new Vector2(x, y))
        }

        // Bottle spawn
        if (r === 255 && g === 128 && !b) {
          this._bottleSpawns.push(new Vector2(x, y))
        }
      }
      map.push(row)
    }
    return map
  }

  _renderToTexture () {
    this._texture.clear()

    const container = new PIXI.Container()

    this._groundSprite = PIXI.Texture.fromFrame('level/ground.png')
    this._backgroundSprite = new PIXI.extras.TilingSprite(this._groundSprite, this._texture.width, this._texture.height)
    container.addChild(this._backgroundSprite)

    this._map.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (!tile) return

        const topTile = this._map[y - 1] && this._map[y - 1][x]
        const rightTile = row[x + 1]
        const bottomTile = this._map[y + 1] && this._map[y + 1][x]
        const leftTile = row[x - 1]
        const bottomLeftTile = this._map[y + 1] && this._map[y + 1][x - 1]
        const bottomRightTile = this._map[y + 1] && this._map[y + 1][x + 1]

        let sprite

        if (topTile && rightTile && bottomTile && leftTile && bottomLeftTile && bottomRightTile) {
          const index = Math.ceil(Math.random() * 3)
          sprite = PIXI.Sprite.fromFrame(`level/wall-default-${index}.png`)
        } else if (!bottomTile) {
          sprite = PIXI.Sprite.fromFrame('level/wall.png')
        } else if (!topTile && !leftTile) {
          sprite = PIXI.Sprite.fromFrame('level/wall-top-left.png')
        } else if (!topTile && !rightTile) {
          sprite = PIXI.Sprite.fromFrame('level/wall-top-right.png')
        } else if (!leftTile && !rightTile) {
          sprite = PIXI.Sprite.fromFrame('level/wall-leftright.png')
        } else if ((topTile && !leftTile) || (topTile && leftTile && !bottomLeftTile)) {
          if (!bottomRightTile) {
            sprite = PIXI.Sprite.fromFrame('level/wall-leftright.png')
          } else {
            sprite = PIXI.Sprite.fromFrame('level/wall-left.png')
          }
        } else if ((topTile && !rightTile) || (topTile && rightTile && !bottomRightTile)) {
          if (!bottomLeftTile) {
            sprite = PIXI.Sprite.fromFrame('level/wall-leftright.png')
          } else {
            sprite = PIXI.Sprite.fromFrame('level/wall-right.png')
          }
        } else if (!topTile) {
          const index = Math.ceil(Math.random() * 3)
          sprite = PIXI.Sprite.fromFrame(`level/wall-top-${index}.png`)
        }

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
    const tile = this._map[position.y] && this._map[position.y][position.x]
    return tile !== 1 && typeof tile !== 'undefined' && tile !== false
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

    return this.isPositionWalkable(position) ? position : null
  }

  get goldSpawns () { return this._goldSpawns }
  get bottleSpawns () { return this._bottleSpawns }
  get monsterSpawns () { return this._monsterSpawns }
}
