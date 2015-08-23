/* global PIXI */

import Constants from '../constants'

export default class Game extends PIXI.Container {
  constructor (app, game) {
    super()

    this._app = app
    this._game = game

    this._headlineStyle = {
      font: 'font-normal-16'
    }

    this._createLoScore()
    this._createPoints()
  }

  _createPoints () {
    const { canvasSize } = this._app

    this._pointsHeadlineShadow = new PIXI.extras.BitmapText('POINTS', this._headlineStyle)
    this._pointsHeadlineShadow.tint = Constants.PRIMARY_COLOR_RED_SHADOW
    this.addChild(this._pointsHeadlineShadow)

    this._pointsHeadline = new PIXI.extras.BitmapText('POINTS', this._headlineStyle)
    this._pointsHeadline.tint = Constants.PRIMARY_COLOR_RED
    this.addChild(this._pointsHeadline)

    this._pointsHeadline.position.x = canvasSize.x - 35 - this._pointsHeadline.textWidth
    this._pointsHeadline.position.y = 35 + 35 + 70

    this._pointsText = new PIXI.extras.BitmapText('0', this._headlineStyle)
    this.addChild(this._pointsText)

    this._pointsText.position.x = canvasSize.x - 35 - this._pointsText.textWidth
    this._pointsText.position.y = 35 + 35 + 70 + 35
  }

  _createLoScore () {
    const { canvasSize } = this._app
    this._loScoreHeadlineShadow = new PIXI.extras.BitmapText('LO-SCORE', this._headlineStyle)
    this._loScoreHeadlineShadow.tint = Constants.PRIMARY_COLOR_RED_SHADOW
    this.addChild(this._loScoreHeadlineShadow)

    this._loScoreHeadline = new PIXI.extras.BitmapText('LO-SCORE', this._headlineStyle)
    this._loScoreHeadline.tint = Constants.PRIMARY_COLOR_RED
    this.addChild(this._loScoreHeadline)

    this._loScoreHeadline.position.x = canvasSize.x - 35 - this._loScoreHeadline.textWidth
    this._loScoreHeadline.position.y = 35

    this._loScoreText = new PIXI.extras.BitmapText('-', this._headlineStyle)
    this.addChild(this._loScoreText)

    this._loScoreText.position.x = canvasSize.x - 35 - this._loScoreText.textWidth
    this._loScoreText.position.y = 35 + 35
  }

  update (delta) {
    const { canvasSize } = this._app
    this._loScoreHeadlineShadow.position.x = this._loScoreHeadline.position.x
    this._loScoreHeadlineShadow.position.y = this._loScoreHeadline.position.y - 2

    this._pointsHeadlineShadow.position.x = this._pointsHeadline.position.x
    this._pointsHeadlineShadow.position.y = this._pointsHeadline.position.y - 2

    this._pointsText.text = this._game.hero.points
    this._pointsText.position.x = canvasSize.x - 35 - this._pointsText.textWidth
  }
}
