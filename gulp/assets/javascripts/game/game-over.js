/* global PIXI */

import Constants from '../constants'

export default class GameOver extends PIXI.Container {
  constructor (game, app, win, reason) {
    super()
    this._game = game
    this._app = app
    this._win = win
    this._reason = reason

    this._createBackground()
    this._createSprite()
    this._createReasonText()
    this._createContinueText()
  }

  _createContinueText () {
    const { canvasSize } = this._app
    const style = {
      font: '32px font-normal-16'
    }

    this._continueText = new PIXI.extras.BitmapText('Press space to play again'.toUpperCase(), style)
    this._continueText.position.x = canvasSize.x / 2 - this._continueText.textWidth / 2
    this._continueText.position.y = 540
    this.addChild(this._continueText)
  }

  _createReasonText () {
    const { canvasSize } = this._app
    const style = {
      font: '32px font-normal-16'
    }

    this._reasonText = new PIXI.extras.BitmapText(this._reason.toUpperCase(), style)
    this._reasonText.position.x = canvasSize.x / 2 - this._reasonText.textWidth / 2
    this._reasonText.position.y = 300
    this._reasonText.tint = Constants.PRIMARY_COLOR_RED
    this.addChild(this._reasonText)
  }

  _createSprite () {
    const { canvasSize } = this._app

    const spriteName = this._win ? 'win.png' : 'gameover.png'

    this._sprite = PIXI.Sprite.fromFrame(spriteName)
    this.addChild(this._sprite)

    this._sprite.position.x = canvasSize.x / 2 - this._sprite.width / 2
    this._sprite.position.y = 250
  }

  _createBackground () {
    const { canvasSize } = this._app

    this._background = new PIXI.Graphics()
    this._background.beginFill(0x000000, 0.8)
    this._background.drawRect(0, 0, canvasSize.x, canvasSize.y)
    this._background.endFill()

    this.addChild(this._background)
  }

  update (delta) {

  }
}
