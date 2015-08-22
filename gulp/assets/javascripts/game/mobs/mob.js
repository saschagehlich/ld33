import Vector2 from '../../math/vector2'

export default class Mob {
  constructor (game) {
    this._game = game

    this._position = new Vector2()
  }

  setPosition (position) {
    this._position.clone(position)
  }
}
