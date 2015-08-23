/* global _ */
import Mob from './mob'
import Gold from '../entities/gold'
import Bottle from '../entities/bottle'
import Vector2 from '../../math/vector2'

export default class Hero extends Mob {
  constructor (...args) {
    super(...args)

    this._canConsume = [Gold, Bottle]

    this._isAttackable = true
    this._canAttack = false

    this._walkingMode = 'gold'
    this._escapeRadius = 5
    this._points = 0
  }

  consumeEntity (entity) {
    super.consumeEntity(entity)

    if (entity instanceof Gold) {
      this._points += 10
    }
    if (entity instanceof Bottle) {
      this._points += 100
      this._game.bottleActive()
    }
  }

  update (delta) {
    this._monstersInRange = this._findMonstersInRange()
    this._updateWalkingMode()

    if (Math.floor(Math.random() * 100) === 0) {
      this._fart()
    }

    super.update()
  }

  _updateWalkingMode () {
    if (this._monstersInRange.length && !this.canAttack) {
      this._walkingMode = 'escape'
    } else if (this.canAttack) {
      this._walkingMode = 'gold'
    } else {
      this._walkingMode = 'gold'
    }
  }

  _findMonstersInRange () {
    const currentPosition = this._position.clone().floor()
    const { monsters } = this._game

    const monstersAndRanges = monsters.map((monster) => {
      const distVector = monster.position.clone()
        .subtract(currentPosition).abs()
      const dist = Math.sqrt(distVector.x * distVector.x + distVector.y * distVector.y)
      return [monster, dist]
    }).sort((a, b) => a[1] - b[1])

    const monstersInRange = monstersAndRanges.filter(([monster, dist]) => {
      return dist < this._escapeRadius
    }).map(([monster, dist]) => monster)

    return monstersInRange
  }

  _findDestinationPosition () {
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

    switch (this._walkingMode) {
      case 'gold':
        this._lookForGold()
        break
      case 'escape':
        this._escapeFromMonsters()
        break
      case 'fight':
        this._lookForMonsters()
        break
    }
  }

  _escapeFromMonsters () {
    const currentPosition = this._position.clone().floor()

    // Find closest monster
    const closestMonster = this._monstersInRange[0]

    const distVector = closestMonster.position.clone()
      .subtract(currentPosition)

    let monsterDirections = []

    // Monster is on top
    if (distVector.y < 0) {
      monsterDirections.push(0)
    }
    // Monster is to the left
    if (distVector.x < 0) {
      monsterDirections.push(3)
    }
    // Monster is to the right
    if (distVector.x > 0) {
      monsterDirections.push(1)
    }
    // Monster is to the bottom
    if (distVector.y > 0) {
      monsterDirections.push(2)
    }

    const preferredDirections = [0, 1, 2, 3].filter((direction) => monsterDirections.indexOf(direction) === -1)
    const walkableNeighbors = preferredDirections.map((direction) => {
      return [direction, this._map.getWalkablePositionWithDirection(currentPosition, direction)]
    }).filter(([direction, position]) => {
      return !!position
    })

    if (!walkableNeighbors.length) {
      // Fallback: Look for gold
      return this._lookForGold()
    }

    const [direction, position] = _.sample(walkableNeighbors)
    this._walkTo(position, direction)
  }

  _lookForMonsters () {
    // TODO
    // Skipping this for now
  }

  _lookForGold () {
    const currentPosition = this._position.clone().floor()

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

  _fart () {
    const currentPosition = this._position.clone().floor()
    this._game.spawnFartAt(currentPosition)
  }

  stopWalking () {
    // Override default, never stop running
  }

  get points () { return this._points }
}
