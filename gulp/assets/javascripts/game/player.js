import { EventEmitter } from 'events'
import Keyboard from '../keyboard'

export default class Player extends EventEmitter {
  constructor (game, id) {
    super()

    this._game = game
    this._id = id
    this._keyboard = new Keyboard()

    this.controlledMonsterIndex = null

    switch (this._id) {
      case 0:
        this._keys = {
          up: 'UP',
          right: 'RIGHT',
          down: 'DOWN',
          left: 'LEFT'
        }
        break
      case 1:
        this._keys = {
          up: 'W',
          right: 'D',
          down: 'S',
          left: 'A'
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
    }
  }

  dispose () {
    this._keyboard.dispose()
  }

  get id () { return this._id }
}
