/* global _ */
import Mob from './mob'
import Gold from '../entities/gold'
import Bottle from '../entities/bottle'
import Vector2 from '../../math/vector2'

export default class Hero extends Mob {
  constructor (...args) {
    super(...args)

    this._canConsume = [Gold, Bottle]
    this._maxSpeed = 5
    this._speed = 5

    this._isAttackable = true
    this._canAttack = false
  }

  _findDestinationPosition () {
    const currentPosition = this._position.clone().floor()

    if (this._path) {
      if (!this._path.length) {
        this._path = null
        this._onPathfindingEnded()
      } else {
        const currentPosition = this._position.clone().floor()
        const [x, y] = this._path[0]
        const newPosition = new Vector2(x, y)

        const direction = this._getDirection(currentPosition, newPosition)
        this._walkTo(newPosition, direction)
        this._path = this._path.slice(1)
        return
      }
    }

    const directions = {
      straight: this._direction,
      right: (this._direction + 1) % 4,
      back: (this._direction + 2) % 4,
      left: (this._direction + 3) % 4
    }

    // Look for neighbor entity
    const neighborPositions = {
      straight: this._map.getWalkablePositionWithDirection(currentPosition, directions.straight),
      right: this._map.getWalkablePositionWithDirection(currentPosition, directions.right),
      back: this._map.getWalkablePositionWithDirection(currentPosition, directions.back),
      left: this._map.getWalkablePositionWithDirection(currentPosition, directions.left)
    }

    const possibleDirections = []
    if (neighborPositions.straight && this._game.hasConsumableEntityAt(neighborPositions.straight)) {
      possibleDirections.push('straight')
      possibleDirections.push('straight')
    }

    if (neighborPositions.right && this._game.hasConsumableEntityAt(neighborPositions.right)) {
      possibleDirections.push('right')
    }

    if (neighborPositions.left && this._game.hasConsumableEntityAt(neighborPositions.left)) {
      possibleDirections.push('left')
    }

    if (neighborPositions.back && this._game.hasConsumableEntityAt(neighborPositions.back)) {
      possibleDirections.push('back')
    }

    const newDirection = _.sample(possibleDirections)
    const destinationPosition = neighborPositions[newDirection]

    if (!destinationPosition) {
      // If no entity found, find path to closest entity
      const path = this._game.findPathToClosestConsumableEntity(currentPosition)
      this._path = path
      this._destinationPosition = null
    } else {
      this._walkTo(destinationPosition, directions[newDirection])
    }
  }
}
