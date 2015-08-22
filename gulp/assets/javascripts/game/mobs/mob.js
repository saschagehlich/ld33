/* global _ */
import Vector2 from '../../math/vector2'
import Keyboard from '../../keyboard'

export default class Mob {
  constructor (game, map) {
    this._game = game
    this._map = map

    this._keyboard = new Keyboard()
    this._keyboard.on('pressed', this._onKeyPressed.bind(this))

    this._consumableRadius = 0.5
    this._touchableRadius = 1.5
    this._position = new Vector2(0, 0)
    this._canConsume = []

    this._maxSpeed = 5
    this._speed = 5
    this._direction = 0
    this._directionVector = new Vector2(0, 1)
    this._destinationPosition = null

    this._controlledByUser = false
    this._preferredDirection = null
  }

  _onKeyPressed (key) {
    if (!this.controlledByUser) return

    switch (key) {
      case 'UP':
        this._preferredDirection = 0
        break
      case 'RIGHT':
        this._preferredDirection = 1
        break
      case 'DOWN':
        this._preferredDirection = 2
        break
      case 'LEFT':
        this._preferredDirection = 3
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
    if (!this._destinationPosition) {
      this._findDestinationPosition()
    }
    this._updatePathfinding()
  }

  _findDestinationPosition () {
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
      this._walkTo(currentPosition, this._direction)
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
    if (!this.controlledByUser) {
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
  get controlledByUser () { return this._controlledByUser }

  set controlledByUser (controlledByUser) {
    this._controlledByUser = controlledByUser
    if (!controlledByUser) {
      this._preferredDirection = null
    } else {
      console.log('preferring', this._direction)
      this._preferredDirection = this._direction
    }
  }
}
