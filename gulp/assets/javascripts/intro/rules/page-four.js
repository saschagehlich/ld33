/* global PIXI */
import Page from '../page'

export default class PageFour extends Page {
  constructor (...args) {
    super(...args)

    const { canvasSize } = this._app

    this._bottleSprite = PIXI.Sprite.fromFrame('entities/bottle-0.png')
    this._bottleSprite.scale = new PIXI.Point(2, 2)
    this._bottleSprite.anchor = new PIXI.Point(0.5, 0.5)
    this._bottleSprite.position.x = canvasSize.x / 2 - this._bottleSprite.x / 2
    this._bottleSprite.position.y = 320
    this.addChild(this._bottleSprite)

    this._text = 'If he gets to drink one of the four\nbottles, he can attack all your monsters.\nAnd he will.'
  }

  update (delta) {
    super(delta)
  }
}
