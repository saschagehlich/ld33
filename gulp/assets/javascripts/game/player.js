import { EventEmitter } from 'events'
import Keyboard from '../keyboard'

const COLORS = [
  0xff0000,
  0x0000ff,
  0xff0000,
  0xff0000
]

export default class Player extends EventEmitter {
  constructor (game, id) {
    super()

    this._game = game
    this._id = id
    this._keyboard = new Keyboard()
    this._color = COLORS[this._id]

    this.controlledMonsterIndex = null

    this._keys = {}

    switch (this._id) {
      case 0:
        this._keys = {
          up: 'UP',
          right: 'RIGHT',
          down: 'DOWN',
          left: 'LEFT',
          switch: 'CTRL'
        }
        break
      case 1:
        this._keys = {
          up: 'W',
          right: 'D',
          down: 'S',
          left: 'A',
          switch: 'E'
        }
        break
    }

    this._onKeyPressed = this._onKeyPressed.bind(this)
    this._keyboard.on('pressed', this._onKeyPressed)
  }

  _onKeyPressed (key, e) {
    switch (key) {
      case this._keys.up:
        this.emit('keypressed', this._id, 'UP')
        break
      case this._keys.right:
        this.emit('keypressed', this._id, 'RIGHT')
        break
      case this._keys.down:
        this.emit('keypressed', this._id, 'DOWN')
        break
      case this._keys.left:
        this.emit('keypressed', this._id, 'LEFT')
        break
      case this._keys.switch:
        this.emit('keypressed', this._id, 'SWITCH')
        break
    }
  }

  dispose () {
    this._keyboard.removeListener('pressed', this._onKeyPressed)
    this._keyboard.dispose()
  }

  get id () { return this._id }
  get color () { return this._color }
}
