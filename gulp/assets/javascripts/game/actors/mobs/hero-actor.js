/* global PIXI */

import Constants from '../../../constants'
import MobActor from './mob-actor'
import Vector2 from '../../../math/vector2'

const ANIMATION_INTERVAL = 0.1

export default class PacmanActor extends MobActor {
  constructor (...args) {
    super(...args)

    this._lastSpriteDirection = 'back'
    this._animationFrame = Math.floor(Math.random() * 4)
    this._animationCounter = Math.random() * ANIMATION_INTERVAL

    this._textures = {
      left: [
        PIXI.Texture.fromFrame('mobs/hero/left-0.png'),
        PIXI.Texture.fromFrame('mobs/hero/left-1.png'),
        PIXI.Texture.fromFrame('mobs/hero/left-0.png'),
        PIXI.Texture.fromFrame('mobs/hero/left-2.png')
      ],
      right: [
        PIXI.Texture.fromFrame('mobs/hero/right-0.png'),
        PIXI.Texture.fromFrame('mobs/hero/right-1.png'),
        PIXI.Texture.fromFrame('mobs/hero/right-0.png'),
        PIXI.Texture.fromFrame('mobs/hero/right-2.png')
      ],
      back: [
        PIXI.Texture.fromFrame('mobs/hero/back-0.png'),
        PIXI.Texture.fromFrame('mobs/hero/back-1.png'),
        PIXI.Texture.fromFrame('mobs/hero/back-0.png'),
        PIXI.Texture.fromFrame('mobs/hero/back-2.png')
      ],
      front: [
        PIXI.Texture.fromFrame('mobs/hero/front-0.png'),
        PIXI.Texture.fromFrame('mobs/hero/front-1.png'),
        PIXI.Texture.fromFrame('mobs/hero/front-0.png'),
        PIXI.Texture.fromFrame('mobs/hero/front-2.png')
      ]
    }

    this._sprite = PIXI.Sprite.fromFrame('mobs/hero/back-0.png')
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

    const animationInterval = ANIMATION_INTERVAL
    if (this._animationCounter > animationInterval || this._getSpriteDirection() !== this._lastSpriteDirection) {
      this._lastSpriteDirection = this._getSpriteDirection()

      this._animationFrame = (this._animationFrame + 1) % this._textures[this._lastSpriteDirection].length
      this._animationCounter = 0

      this._sprite.texture = this._textures[this._lastSpriteDirection][this._animationFrame]
    }
    this._animationCounter += delta
  }

  _getSpriteDirection () {
    switch (this._object.direction) {
      case 0:
        return 'back'
      case 1:
        return 'right'
      case 2:
        return 'front'
      case 3:
        return 'left'
    }
  }
}
