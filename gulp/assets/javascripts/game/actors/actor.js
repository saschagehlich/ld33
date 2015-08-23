/* global PIXI */

export default class Actor extends PIXI.Container {
  constructor (game, object, tint = 0xffffff) {
    super()

    this._game = game
    this._object = object
    this._tint = tint
  }

  update (delta) {

  }

  render (renderer) {

  }

  get object () { return this._object }
}
