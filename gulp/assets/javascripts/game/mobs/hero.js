import Mob from './mob'
import Gold from '../entities/gold'
import Bottle from '../entities/bottle'

export default class Hero extends Mob {
  constructor (...args) {
    super(...args)

    this._canConsume = [Gold, Bottle]
    this._maxSpeed = 5
    this._speed = 5

    this.isAttackable = true
  }
}
