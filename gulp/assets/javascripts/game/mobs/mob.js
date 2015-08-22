/* global _ */
import Vector2 from '../../math/vector2'

export default class Mob {
  constructor (game, map) {
    this._game = game
    this._map = map

    this._consumableRadius = 0.5
    this._touchableRadius = 1.5
    this._position = new Vector2(0, 0)
    this._canConsume = []

    this._maxSpeed = 5
    this._speed = 5
    this._direction = 0
    this._directionVector = new Vector2(0, 1)
  }

  setPosition (position) {
    this._position.copy(position)
    this._destinationPosition = null
  }

  consumeEntity (entity) {
    entity.consumedBy(this)
  }

  update (delta) {
    this._checkTouchedEntities()
    if (!this._destinationPosition) {
      this._findDestinationPosition()
    }
    this._updatePathfinding()
  }

  _findDestinationPosition () {
    const currentPosition = this._position.clone().floor()

    const directions = {
      straight: this._direction,
      right: (this._direction + 1) % 4,
      back: (this._direction + 2) % 4,
      left: (this._direction + 3) % 4
    }

    const neighborPositions = {
      straight: this._map.getWalkablePositionWithDirection(currentPosition, directions.straight),
      right: this._map.getWalkablePositionWithDirection(currentPosition, directions.right),
      back: this._map.getWalkablePositionWithDirection(currentPosition, directions.back),
      left: this._map.getWalkablePositionWithDirection(currentPosition, directions.left)
    }

    const possibleDirections = []

    if (neighborPositions.straight) {
      possibleDirections.push('straight')
      possibleDirections.push('straight')
    }
    if (neighborPositions.right) {
      possibleDirections.push('right')
    }
    if (neighborPositions.left) {
      possibleDirections.push('left')
    }
    if (!possibleDirections.length && neighborPositions.back) {
      possibleDirections.push('back')
    }

    const newDirection = _.sample(possibleDirections)

    this._startPosition = this._position.clone()
    this._destinationPosition = neighborPositions[newDirection]
    this._direction = directions[newDirection]

    const distVector = this._destinationPosition.clone()
      .subtract(this._startPosition)
      .abs()
    const dist = Math.sqrt(distVector.x * distVector.x + distVector.y * distVector.y)

    this._walkStartTime = window.performance.now()
    this._walkDuration = (dist / this._speed) * 1000
  }

  _updatePathfinding () {
    const progress = (window.performance.now() - this._walkStartTime) / this._walkDuration
    const distVector = this._destinationPosition.clone()
      .subtract(this._startPosition)

    this._position = this._startPosition.clone()
      .add(distVector.clone().multiply(progress))

    if (progress >= 1) {
      this._position.copy(this._destinationPosition)
      this._findDestinationPosition()
    }
  }

  _checkTouchedEntities () {
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
