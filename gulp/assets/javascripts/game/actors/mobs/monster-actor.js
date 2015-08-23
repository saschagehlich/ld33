/* global PIXI */

import Constants from '../../../constants'
import MobActor from './mob-actor'
import Vector2 from '../../../math/vector2'

export default class GhostActor extends MobActor {
  constructor (...args) {
    super(...args)

    this._sprite = PIXI.Sprite.fromFrame('mobs/ghost.png')
    this._sprite.anchor = new Vector2(0.5, 0.5)
    this.addChild(this._sprite)

    this._caretSprite = PIXI.Sprite.fromFrame('mobs/caret.png')
    this._caretSprite.anchor = new Vector2(0.5, 1)
    this._caretSprite.position.y = -16
    this._caretSprite.visible = false
    this.addChild(this._caretSprite)
  }

  update (delta) {
    // Map level position (tile position) to pixel position
    let { position } = this._object

    position = position.clone()
      .multiply(Constants.TILE_SIZE)
      .add(Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2)

    this.position.x = position.x
    this.position.y = position.y

    this._caretSprite.visible = this._object.controlledByUser
  }
}
