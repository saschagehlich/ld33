/* global PIXI */

import Constants from '../../../constants'
import MobActor from './mob-actor'
import Vector2 from '../../../math/vector2'

const ANIMATION_INTERVAL = 0.15

export default class MonsterActor extends MobActor {
  constructor (...args) {
    super(...args)

    this._lastSpriteDirection = 'right'
    this._animationFrame = Math.floor(Math.random() * 4)
    this._animationCounter = Math.random() * ANIMATION_INTERVAL
    this._lastTransparentTick = window.performance.now()

    this._textures = {
      right: [
        PIXI.Texture.fromFrame('mobs/monster/right-0.png'),
        PIXI.Texture.fromFrame('mobs/monster/right-1.png'),
        PIXI.Texture.fromFrame('mobs/monster/right-0.png'),
        PIXI.Texture.fromFrame('mobs/monster/right-2.png')
      ],
      left: [
        PIXI.Texture.fromFrame('mobs/monster/left-0.png'),
        PIXI.Texture.fromFrame('mobs/monster/left-1.png'),
        PIXI.Texture.fromFrame('mobs/monster/left-0.png'),
        PIXI.Texture.fromFrame('mobs/monster/left-2.png')
      ],
      dead: PIXI.Texture.fromFrame('mobs/monster/dead.png')
    }

    this._sprite = new PIXI.Sprite(this._textures.right[0])
    this._sprite.anchor = new Vector2(0.5, 0.5)
    this._sprite.tint = this._tint
    this.addChild(this._sprite)

    this._deadSprites = []
    this._transparent = false

    this._arrowSprite = PIXI.Sprite.fromFrame('mobs/arrow.png')
    this._arrowSprite.anchor = new Vector2(0.5, 1)
    this._arrowSprite.position.y = -18
    this._arrowSprite.visible = false
    this.addChild(this._arrowSprite)
  }

  update (delta) {
    // Map level position (tile position) to pixel position
    let { position } = this._object

    position = position.clone()
      .multiply(Constants.TILE_SIZE)
      .add(Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2)

    this._arrowSprite.visible = this._object.controlledByUser

    this.position.x = position.x
    this.position.y = position.y - 10

    if (this._object.isAlive) {
      this._updateSprite(delta)
    } else {
      this._updateDeadSprite(delta)
    }
  }

  _updateDeadSprite (delta) {
    this._sprite.texture = this._textures.dead
    this._sprite.tint = 0xffffff
    this._sprite.alpha = 0.3
  }

  _updateSprite (delta) {
    const now = window.performance.now()
    const animationInterval = ANIMATION_INTERVAL
    if (this._animationCounter > animationInterval || this._getSpriteDirection() !== this._lastSpriteDirection) {
      this._lastSpriteDirection = this._getSpriteDirection()

      this._animationFrame = (this._animationFrame + 1) % this._textures[this._lastSpriteDirection].length
      this._animationCounter = 0

      this._sprite.texture = this._textures[this._lastSpriteDirection][this._animationFrame]
    }
    this._animationCounter += delta

    if (this._object.isAttackable && this._object.isAlive) {
      this._sprite.alpha = this._transparent ? 0.3 : 1.0
      this._sprite.tint = 0xffffff
      if (now - this._lastTransparentTick > 250) {
        this._transparent = !this._transparent
        this._lastTransparentTick = now
      }
    } else {
      this._sprite.alpha = 1.0
      this._sprite.tint = this._tint
    }
  }

  _getSpriteDirection () {
    switch (this._object.direction) {
      case 1:
      case 2:
        return 'right'
      case 0:
      case 3:
        return 'left'
    }
  }
}
