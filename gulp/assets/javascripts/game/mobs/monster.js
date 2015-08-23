import Mob from './mob'

export default class Monster extends Mob {
  constructor (...args) {
    super(...args)

    this.isAttackable = false
  }

  update (delta) {
    super.update(delta)
  }
}
