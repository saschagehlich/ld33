import Mob from './mob'
import Point from '../entities/point'

export default class Pacman extends Mob {
  constructor (...args) {
    super(...args)

    this._canConsume = [Point]
    this._maxSpeed = 5
    this._speed = 5
  }
}
