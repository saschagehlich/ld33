import Mob from './mob'
import Point from '../entities/point'

export default class Pacman extends Mob {
  constructor (...args) {
    super(...args)

    this._canConsume = [Point]
  }
}
