import Mob from './mob'

export default class Monster extends Mob {
  constructor (...args) {
    super(...args)

    this._isAttackable = false
    this._canAttack = true
  }

  update (delta) {
    super.update(delta)
  }

  die () {
    this._isAlive = false
    this._speed = this._maxSpeed * 2
    this._goBackToSpawn()
  }

  revive () {
    this._isAlive = true
    this._speed = this._maxSpeed
  }

  _goBackToSpawn () {
    this.destination = 'spawn'
    this._findPathTo(this._spawn)
  }

  _onPathfindingEnded () {
    super._onPathfindingEnded()

    this.revive()
    if (this._controlledByUser) {
      this.stopWalking()
    } else {
      this._direction = 0
      this._preferredDirection = 0
    }
  }
}
