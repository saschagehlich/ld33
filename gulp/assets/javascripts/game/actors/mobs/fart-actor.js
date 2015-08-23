/* global PIXI */

import Actor from '../actor'
import Constants from '../../../constants'

export default class FartActor extends Actor {
  constructor (...args) {
    super(...args)

    this._sprite = PIXI.Sprite.fromFrame('mobs/fart.png')
    this._sprite.anchor = new PIXI.Point(0.5, 1)
    this.addChild(this._sprite)

    this._yOffset = 0
    this._time = 0
  }

  update (delta) {
    // Map level position (tile position) to pixel position
    let { position } = this._object

    position = position.clone()
      .multiply(Constants.TILE_SIZE)
      .add(Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2)

    this._time += delta
    this._yOffset = Math.sin(this._time) * 5

    this.position.x = position.x
    this.position.y = position.y + 4 + this._yOffset
  }
}
