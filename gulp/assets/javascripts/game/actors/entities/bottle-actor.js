/* global PIXI */

import Constants from '../../../constants'
import EntityActor from './entity-actor'
import Vector2 from '../../../math/vector2'

const ANIMATION_INTERVAL = 0.3

export default class BottleActor extends EntityActor {
  constructor (...args) {
    super(...args)

    this._textures = [
      PIXI.Texture.fromFrame('entities/bottle-0.png'),
      PIXI.Texture.fromFrame('entities/bottle-1.png'),
      PIXI.Texture.fromFrame('entities/bottle-2.png'),
      PIXI.Texture.fromFrame('entities/bottle-1.png')
    ]
    this._animationCounter = Math.random() * ANIMATION_INTERVAL
    this._textureIndex = Math.floor(Math.random() * this._textures.length)

    this._sprite = new PIXI.Sprite(this._textures[this._textureIndex])
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

    this._animationCounter += delta
    if (this._animationCounter > ANIMATION_INTERVAL) {
      this._textureIndex = (this._textureIndex + 1) % this._textures.length
      this._sprite.texture = this._textures[this._textureIndex]
      this._animationCounter = 0
    }
  }
}
