import Mob from './mob'

export default class Monster extends Mob {
  constructor (...args) {
    super(...args)

    this._isAttackable = true
    this._canAttack = false

    this._onKeyPressed = this._onKeyPressed.bind(this)
  }

  _onKeyPressed (id, key, e) {
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
    }
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

    const nextMonster = this._game.getRandomAliveMonster()
    if (!nextMonster) {
      this._game.gameOver(false, 'All your monsters died!')
    } else if (this._controlledByUser) {
      this._game.switchToMonster(nextMonster, this._controlledByUser.id)
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

  set controlledByUser (user) {
    if (user) {
      this._isAttackable = !this._game.isHeroAttackable()
      this._canAttack = !this._isAttackable
      this._preferredDirection = this._direction

      user.on('keypressed', this._onKeyPressed)
    } else {
      this.isAttackable = true
      this.canAttack = false
      this._preferredDirection = null
      this._walking = true

      if (this._controlledByUser) {
        this._controlledByUser.removeListener('keypressed', this._onKeyPressed)
      }
    }
    this._controlledByUser = user
  }

  get controlledByUser () { return this._controlledByUser }
}
