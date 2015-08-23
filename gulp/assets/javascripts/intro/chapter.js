/* global PIXI */

import Constants from '../constants'

const CONTINUE_BLINK_INTERVAL = 500

export default class Chapter extends PIXI.Container {
  constructor (app) {
    super()
    this._app = app

    const { canvasSize } = this._app
    const style = {
      font: '16px font-normal-8'
    }
    this._continue = new PIXI.extras.BitmapText('> Press SPACE to continue <', style)
    this._continue.tint = Constants.PRIMARY_COLOR_RED
    this._continue.position.y = 540
    this._continue.position.x = canvasSize.x / 2 - this._continue.textWidth / 2
    this.addChild(this._continue)

    const now = window.performance.now()
    this._lastContinueBlink = now

    this._page = null
    this._pages = []

    this._init()

    this._pageIndex = 0
    this._selectPage(this._pageIndex)
  }

  _init () {

  }

  _selectPage (index) {
    if (this._page) {
      this.removeChild(this._page)
    }

    this._pageIndex = index
    const Page = this._pages[index]
    this._page = new Page(this._app, this)
    this.addChild(this._page)
  }

  update (delta) {
    const now = window.performance.now()
    if (now - this._lastContinueBlink > CONTINUE_BLINK_INTERVAL) {
      this._continue.visible = !this._continue.visible
      this._lastContinueBlink = now
    }

    if (this._page) {
      this._page.update(delta)
    }
  }

  next () {
    this._pageIndex++
    if (this._pageIndex >= this._pages.length) {
      this.emit('done')
    } else {
      this._selectPage(this._pageIndex)
    }
  }
}
