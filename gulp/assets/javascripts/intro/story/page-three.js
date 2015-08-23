/* global PIXI */
import Page from '../page'

export default class PageOne extends Page {
  constructor (...args) {
    super(...args)

    const { canvasSize } = this._app

    this._fartSprite = PIXI.Sprite.fromFrame('mobs/fart.png')
    this._fartSprite.scale = new PIXI.Point(2, 2)
    this._fartSprite.anchor = new PIXI.Point(0.5, 0.5)
    this._fartSprite.position.x = canvasSize.x / 2 - this._fartSprite.x / 2
    this._fartSprite.position.y = 320
    this._fartSprite.visible = false
    this.addChild(this._fartSprite)

    this._heroSprite = PIXI.Sprite.fromFrame('mobs/hero/front-0.png')
    this._heroSprite.scale = new PIXI.Point(2, 2)
    this._heroSprite.anchor = new PIXI.Point(0.5, 0.5)
    this._heroSprite.position.x = canvasSize.x / 2 - this._heroSprite.x / 2
    this._heroSprite.position.y = 320
    this.addChild(this._heroSprite)

    this._text = 'I guess I\'ll have to find another way\nto make money now.'

    this._fartAlpha = 1
  }

  update (delta) {
    super(delta)

    if (this._textComplete) {
      this._fartAlpha -= delta / 3
      this._fartSprite.alpha = this._fartAlpha
      this._fartSprite.position.y -= delta * 20
    }
  }

  _onTextComplete () {
    this._app.sound.play('fart2')
    this._fartSprite.visible = true
  }
}
