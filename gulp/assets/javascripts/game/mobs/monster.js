import Mob from './mob'

export default class Monster extends Mob {
  constructor (...args) {
    super(...args)

    this._isAttackable = true
    this._canAttack = false
  }

  update (delta) {
    if (this._isAlive && this._controlledByUser) {
      super.update(delta)
    }
  }

  die () {
    this._isAlive = false
    // this._speed = this._maxSpeed * 2
    // this._goBackToSpawn()

    this._game.playSound('dead')

    const nextMonster = this._game.getNextAliveMonster()
    if (!nextMonster) {
      this._game.gameOver(false, 'All your monsters died!')
    } else {
      this._game.switchToMonster(nextMonster)
    }
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

  isAttackableBy (mob) {
    return this._isAlive && ((this._isAttackable && mob.constructor.name === 'Hero') ||
      (mob.constructor.name === 'Fart'))
  }

  set controlledByUser (controlledByUser) {
    this._controlledByUser = controlledByUser
    if (controlledByUser) {
      this._isAttackable = !this._game.isHeroAttackable()
      this._canAttack = !this._isAttackable
      this._preferredDirection = this._direction
    } else {
      this._isAttackable = true
      this._canAttack = false
      this._preferredDirection = null
      this._walking = true
    }
  }
  get controlledByUser () { return this._controlledByUser }
}
