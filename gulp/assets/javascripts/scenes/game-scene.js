import Scene from './scene'
import Game from '../game/game'
import Vector2 from '../math/vector2'

export default class GameScene extends Scene {
  constructor (app, multiplayer) {
    super(app)
    this._game = new Game(this._app, multiplayer)
    this.addChild(this._game)
  }

  update (delta) {
    this._game.update(delta)
  }

  render (renderer) {
    this._game.render(renderer)

    super(renderer)
  }

  dispose () {
    this._game.dispose()
  }
}
