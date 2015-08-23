import Mob from './mob'

export default class Fart extends Mob {
  constructor (...args) {
    super(...args)

    this._canConsume = []

    this._isAttackable = false
    this._canAttack = true
  }

  update (delta) {
    // A fart doesn't to much
  }
}
