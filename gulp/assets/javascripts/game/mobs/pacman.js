import Mob from './mob'
import Point from '../entities/point'
import BigPoint from '../entities/big-point'

export default class Pacman extends Mob {
  constructor (...args) {
    super(...args)

    this._canConsume = [Point, BigPoint]
    this._maxSpeed = 5
    this._speed = 5
  }
}
