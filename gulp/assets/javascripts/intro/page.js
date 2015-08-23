/* global PIXI */

const TYPE_INTERVAL = 30

export default class Page extends PIXI.Container {
  constructor (app, chapter) {
    super(app, chapter)

    this._app = app
    this._chapter = chapter

    this._text = ''
    this._textOffset = 0
    this._lastTextOffset = 0
    this._textComplete = false

    const now = window.performance.now()
    this._lastType = now

    this._createTextObject()
  }

  _createTextObject () {
    const style = {
      font: '32px font-normal-16',
      align: 'left'
    }

    this._textObject = new PIXI.extras.BitmapText('', style)
    this._textObject.position.x = 80
    this._textObject.position.y = 100
    this.addChild(this._textObject)
  }

  _onTextComplete () {

  }

  update (delta) {
    if (!this._textComplete) {
      const now = window.performance.now()
      if (now - this._lastType > TYPE_INTERVAL) {
        this._textOffset++

        this._textObject.text = this._text.substr(0, this._textOffset)

        if (this._textOffset >= this._text.length) {
          this._textComplete = true
          this._onTextComplete()
        }

        this._lastType = now
      }
    }
  }
}
