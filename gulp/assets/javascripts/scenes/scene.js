/* global PIXI */
export default class Scene extends PIXI.Container {
  constructor (app) {
    super()
    this._app = app
  }

  update (delta) {

  }

  render (renderer) {
    renderer.render(this)
  }

  dispose () {
    throw new Error(this.constructor.name + '#dispose not implemented')
  }
}
