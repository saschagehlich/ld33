/* global PIXI */

import Constants from '../../../constants'
import EntityActor from './entity-actor'
import Vector2 from '../../../math/vector2'

const ANIMATION_INTERVAL = 0.5

export default class PointActor extends EntityActor {
  constructor (...args) {
    super(...args)

    this._sprite = PIXI.Sprite.fromFrame('entities/gold-2.png')
    this._sprite.anchor = new Vector2(0.5, 1)
    this.addChild(this._sprite)
  }

  update (delta) {
    // Map level position (tile position) to pixel position
    let { position } = this._object

    position = position.clone()
      .multiply(Constants.TILE_SIZE)
      .add(Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2)

    this.position.x = position.x
    this.position.y = position.y + 4

    this._sprite.visible = !this._object.consumed
  }
}
