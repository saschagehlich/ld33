import Vector2 from '../../math/vector2'

export default class Entity {
  constructor (game) {
    this._game = game
    this._position = new Vector2()

    this.consumableRadius = 0.3
  }

  setPosition (position) {
    this._position.copy(position)
  }

  update (delta) {

  }

  consumedBy (mob) {

  }

  get position () { return this._position }
}
