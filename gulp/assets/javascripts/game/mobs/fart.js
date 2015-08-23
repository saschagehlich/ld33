import Mob from './mob'

const LIFETIME = 3000

export default class Fart extends Mob {
  constructor (...args) {
    super(...args)

    this._canConsume = []

    this._isAttackable = false
    this._canAttack = true
    this.deleted = false

    const now = window.performance.now()
    this._existsSince = now
  }

  update (delta) {
    const now = window.performance.now()
    this._checkTouchedMobs()

    if (now - this._existsSince >= LIFETIME) {
      this.deleted = true
    }
  }

  _attack (mob) {
    mob.attackedBy(this)
    this.deleted = true
  }
}
