/* global _ */
import Mob from './mob'
import Gold from '../entities/gold'
import Bottle from '../entities/bottle'
import Vector2 from '../../math/vector2'

const FART_COOLDOWN = 5000

export default class Hero extends Mob {
  constructor (game, map, spawn, dumb = false) {
    super(game, map, spawn)
    this._dumb = dumb

    this._canConsume = [Gold, Bottle]

    this._isAttackable = true
    this._canAttack = false

    this._walkingMode = 'gold'
    this._escapeRadius = 7
    this._points = 0

    const now = window.performance.now()
    this._lastFartAt = now
    this._attackedMobs = 0
  }

  consumeEntity (entity) {
    super.consumeEntity(entity)

    if (entity instanceof Gold) {
      this._points += 10
      this._game.playSound('coin')
    }
    if (entity instanceof Bottle) {
      this._points += 100
      this._game.bottleActive()
      this._game.playSound('gulg')
    }
  }

  update (delta) {
    if (this._dumb) {
      return
    }
    this._monstersInRange = this._findMonstersInRange()
    this._updateWalkingMode()

    super.update()
  }

  _updateWalkingMode () {
    if (this._monstersInRange.length && !this.canAttack) {
      this._walkingMode = 'escape'
    } else if (this._monstersInRange.length && this.canAttack) {
      this._walkingMode = 'gold'
    } else {
      this._walkingMode = 'gold'
    }
  }

  _findMonstersInRange () {
    const currentPosition = this._position.clone().floor()
    const { monsters } = this._game

    const monstersAndRanges = monsters
      .filter((monster) => monster.canAttack)
      .map((monster) => {
        const distVector = monster.position.clone()
          .subtract(currentPosition).abs()
        const dist = Math.sqrt(distVector.x * distVector.x + distVector.y * distVector.y)
        return [monster, dist]
      })
      .sort((a, b) => a[1] - b[1])

    const monstersInRange = monstersAndRanges.filter(([monster, dist]) => {
      return dist < this._escapeRadius
    }).map(([monster, dist]) => monster)

    return monstersInRange
  }

  _findDestinationPosition () {
    if (this._path && this._walkingMode !== 'escape') {
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

    // Stop walking the path when in escape mode
    if (this._path && this._walkingMode === 'escape') {
      this._path = null
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
    const now = window.performance.now()
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

    if (now - this._lastFartAt >= FART_COOLDOWN) {
      this._fart()
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

    const now = window.performance.now()
    this._lastFartAt = now

    this._game.playSound('fart2')
  }

  stopWalking () {
    // Override default, never stop running
  }

  isAttackableBy (mob) {
    return this._isAttackable && mob.constructor.name === 'Monster'
  }

  _attack (mob) {
    super._attack(mob)
    this._attackedMobs++
    this._points += Math.pow(2, this._attackedMobs) * 100
  }

  attackedBy (mob) {
    super.attackedBy(mob)
    this._game.gameOver(true, 'You killed the hero!')
  }

  get points () { return this._points }
}
