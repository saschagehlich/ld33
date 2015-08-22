import Vector2 from '../../math/vector2'

export default class Mob {
  constructor (game) {
    this._game = game

    this._consumableRadius = 0.5
    this._touchableRadius = 1.5
    this._position = new Vector2(0, 0)
    this._canConsume = []
  }

  setPosition (position) {
    this._position.copy(position)
  }

  consumeEntity (entity) {
    entity.consumedBy(this)
  }

  update (delta) {
    const touchedEntities = this._game.getTouchedEntitiesForMob(this)
    touchedEntities.forEach((entity) => {
      if (this._canConsumeEntity(entity)) {
        this.consumeEntity(entity)
      }
    })
  }

  _canConsumeEntity (entity) {
    let canConsume = false
    this._canConsume.forEach((klass) => {
      if (entity instanceof klass) {
        canConsume = true
      }
    })
    return canConsume
  }

  touchesEntity (entity) {
    const distVector = this._position.clone()
      .subtract(entity.position)
      .abs()

    const dist = Math.sqrt(distVector.x * distVector.x + distVector.y * distVector.y)

    return dist < this._consumableRadius + entity.touchableRadius
  }

  get position () { return this._position }
}
