import Scene from './scene'
import Map from '../game/map'
import Game from '../game/game'
import UI from '../game/ui'
import Vector2 from '../math/vector2'

export default class GameScene extends Scene {
  constructor (...args) {
    super(...args)

    this._map = new Map(this._app)
    this.addChild(this._map)

    this._game = new Game(this._app, this._map)
    this.addChild(this._game)

    this._ui = new UI(this._app, this._game)
    this.addChild(this._ui)

    const pos = new Vector2(35, 35)
    this._map.position = pos
    this._game.position = pos
  }

  update (delta) {
    this._game.update(delta)
    this._ui.update(delta)
  }

  render (renderer) {
    this._map.render(renderer)
    this._game.render(renderer)

    super(renderer)
  }
}
