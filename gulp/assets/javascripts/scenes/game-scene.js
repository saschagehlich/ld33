import Scene from './scene'
import Map from '../game/map'
import Game from '../game/game'

export default class GameScene extends Scene {
  constructor (...args) {
    super(...args)

    this._map = new Map(this._app)
    this.addChild(this._map)

    this._game = new Game(this._app, this._map)
    this.addChild(this._game)
  }

  update (delta) {
    this._game.update(delta)
  }

  render (renderer) {
    this._map.render(renderer)
    this._game.render(renderer)

    super(renderer)
  }
}
