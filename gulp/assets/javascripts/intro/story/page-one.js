/* global PIXI */
import Page from '../page'

export default class PageOne extends Page {
  constructor (...args) {
    super(...args)

    const { canvasSize } = this._app

    this._heroSprite = PIXI.Sprite.fromFrame('mobs/hero/front-0.png')
    this._heroSprite.scale = new PIXI.Point(2, 2)
    this._heroSprite.anchor = new PIXI.Point(0.5, 0.5)
    this._heroSprite.position.x = canvasSize.x / 2 - this._heroSprite.x / 2
    this._heroSprite.position.y = 320
    this.addChild(this._heroSprite)

    this._text = 'I got fired. Our king fired me.\nCan you believe this?!'
  }
}
