/* global _ */
import Vector2 from '../../math/vector2'
import Keyboard from '../../keyboard'

export default class Mob {
  constructor (game, map, spawn) {
    this._game = game
    this._map = map
    this._spawn = spawn

    this._keyboard = new Keyboard()
    this._keyboard.on('pressed', this._onKeyPressed.bind(this))

    this._isAlive = true
    this.consumableRadius = 0.5
    this.attackableRadius = 1.0
    this._position = new Vector2(0, 0)
    this._canConsume = []

    this._walking = true
    this._maxSpeed = 8
    this._speed = 8
    this._direction = 0
    this._directionVector = new Vector2(0, 1)
    this._destinationPosition = null

    this._controlledByUser = false
    this._preferredDirection = null

    this._isAttackable = false
    this._canAttack = false

    this.destination = null
  }

  _onKeyPressed (key) {
    if (!this._controlledByUser) return

    switch (key) {
      case 'UP':
        this._preferredDirection = 0
        this._walking = true
        break
      case 'RIGHT':
        this._preferredDirection = 1
        this._walking = true
        break
      case 'DOWN':
        this._preferredDirection = 2
        this._walking = true
        break
      case 'LEFT':
        this._preferredDirection = 3
        this._walking = true
        break
      case 'ESC':
        this.die()
        break
    }
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
    this._checkTouchedMobs()
    if (!this._destinationPosition) {
      this._findDestinationPosition()
    }
    this._updatePathfinding()

    if (!this._destinationPosition) {
      this._onDestinationReached()
      if (!this._destinationPosition) {
        this.stopWalking()
      }
    }
  }

  _getDirection (from, to) {
    if (to.y < from.y) {
      return 0
    }
    if (to.x > from.x) {
      return 1
    }
    if (to.y > from.y) {
      return 2
    }
    if (to.x < from.x) {
      return 3
    }
    return this._direction
  }

  _findDestinationPosition () {
    if (!this._walking) { return }

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

    const currentPosition = this._position.clone().floor()
    const onlyStraight = this._controlledByUser

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
    if (neighborPositions.right && !onlyStraight) {
      possibleDirections.push('right')
    }
    if (neighborPositions.left && !onlyStraight) {
      possibleDirections.push('left')
    }
    if (!possibleDirections.length && neighborPositions.back && !onlyStraight) {
      possibleDirections.push('back')
    }

    const newDirection = _.sample(possibleDirections)
    const destinationPosition = neighborPositions[newDirection]

    // No destination - just stay
    if (!destinationPosition) {
      return
    }

    this._walkTo(destinationPosition, directions[newDirection])
  }

  _walkTo (position, direction) {
    this._startPosition = this._position.clone()
    this._destinationPosition = position
    this._direction = direction

    const distVector = this._destinationPosition.clone()
      .subtract(this._startPosition)
      .abs()
    const dist = Math.sqrt(distVector.x * distVector.x + distVector.y * distVector.y)

    this._walkStartTime = window.performance.now()
    this._walkDuration = (dist / this._speed) * 1000
  }

  _updatePathfinding () {
    if (!this._walking) { return }
    if (!this._destinationPosition) { return }

    const progress = (window.performance.now() - this._walkStartTime) / this._walkDuration
    const distVector = this._destinationPosition.clone()
      .subtract(this._startPosition)

    this._position = this._startPosition.clone()
      .add(distVector.clone().multiply(progress))

    if (progress >= 1) {
      this._position.copy(this._destinationPosition)
      this._onDestinationReached()
    }
  }

  _onDestinationReached () {
    if (!this._controlledByUser || !this._isAlive) {
      return this._findDestinationPosition()
    }

    if (this._preferredDirection !== null) {
      const currentPosition = this._position.clone().floor()
      const destinationPosition = this._map.getWalkablePositionWithDirection(currentPosition, this._preferredDirection)
      if (destinationPosition && this._preferredDirection !== this._direction) {
        this._walkTo(destinationPosition, this._preferredDirection)
      } else {
        this._findDestinationPosition()
      }
    }
  }

  _checkTouchedEntities () {
    const touchedEntities = this._game.getTouchedEntitiesForMob(this)
    touchedEntities.forEach((entity) => {
      if (entity.consumed) return
      if (this._canConsumeEntity(entity)) {
        this.consumeEntity(entity)
      }
    })
  }

  // Mobs check if they can attack something
  _checkTouchedMobs () {
    if (!this.canAttack) return

    const touchedMobs = this._game.getTouchedMobsForMob(this)
    touchedMobs.forEach((mob) => {

      if (!mob.isAttackable) return
      this._attack(mob)
    })
  }

  _attack (mob) {
    mob.attackedBy(this)
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

  _findPathTo (position) {
    const currentPosition = this._position.clone().floor()
    const path = this._map.findPath(currentPosition, position)
    this._path = path
    this._destinationPosition = null
  }

  touchesEntity (entity) {
    const distVector = this._position.clone()
      .subtract(entity.position)
      .abs()

    const dist = Math.sqrt(distVector.x * distVector.x + distVector.y * distVector.y)

    return dist < this.consumableRadius + entity.consumableRadius
  }

  touchesMob (mob) {
    const distVector = this._position.clone()
      .subtract(mob.position)
      .abs()

    const dist = Math.sqrt(distVector.x * distVector.x + distVector.y * distVector.y)

    return dist < this.attackableRadius + mob.attackableRadius
  }

  attackedBy (mob) {
    this.die()
  }

  die () {
    this._isAlive = false
  }

  stopWalking () {
    this._walking = false
  }

  _onPathfindingEnded () {
    this._destinationPosition = null
    this._path = null
    this._destination = null
  }

  get position () { return this._position }
  get direction () { return this._direction }
  get controlledByUser () { return this._controlledByUser }
  get isAlive () { return this._isAlive }

  set controlledByUser (controlledByUser) {
    this._controlledByUser = controlledByUser
    if (!controlledByUser) {
      this._preferredDirection = null
      this._walking = true
    } else {
      this._preferredDirection = this._direction
    }
  }

  get isAttackable () {
    return this._isAttackable && this._isAlive
  }

  set isAttackable (isAttackable) {
    this._isAttackable = isAttackable
  }

  get canAttack () {
    return this._canAttack && this._isAlive
  }

  set canAttack (canAttack) {
    this._canAttack = canAttack
  }
}
