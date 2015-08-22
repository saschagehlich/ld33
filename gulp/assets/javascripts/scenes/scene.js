/* global PIXI */
export default class Scene extends PIXI.Container {
  constructor (game) {
    super()
    this._app = game
  }

  update (delta) {

  }

  render (renderer) {
    renderer.render(this)
  }
}
