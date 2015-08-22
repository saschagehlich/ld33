import Mob from './mob'

export default class Ghost extends Mob {
  constructor (...args) {
    super(...args)

    this.isAttackable = false
  }

  update (delta) {
    super.update(delta)
  }
}
