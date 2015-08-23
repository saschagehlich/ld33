/* global _ */

import { EventEmitter } from 'events'

const KEYS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,

  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  NUMPAD0: 96,
  NUMPAD1: 97,
  NUMPAD2: 98,
  NUMPAD3: 99,
  NUMPAD4: 100,
  NUMPAD5: 101,
  NUMPAD6: 102,
  NUMPAD7: 103,
  NUMPAD8: 104,
  NUMPAD9: 105,
  ASTERISK: 106,
  PLUS: 107,
  MINUS: 109,
  DOT: 110,
  SLASH: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,

  SHIFT: 16,
  SPACE: 32,
  ENTER: 13,
  ESC: 27
}

const KEY_CODES = _.invert(KEYS)

export default class Keyboard extends EventEmitter {
  constructor () {
    super()

    this._keyStates = []
    for (let key in KEYS) {
      this._keyStates[KEYS[key]] = false
    }

    this._onKeyDown = this._onKeyDown.bind(this)
    this._onKeyUp = this._onKeyUp.bind(this)

    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('keyup', this._onKeyUp)
  }

  _onKeyDown (e) {
    if ([KEYS.DOWN, KEYS.UP, KEYS.RIGHT, KEYS.LEFT].indexOf(e.keyCode) !== -1) {
      e.preventDefault()
    }

    if (typeof this._keyStates[e.keyCode] !== 'undefined') {
      this.emit('pressed', KEY_CODES[e.keyCode], e)
      this._keyStates[e.keyCode] = true
    }
  }

  _onKeyUp (e) {
    if (typeof this._keyStates[e.keyCode] !== 'undefined') {
      this.emit('released', KEY_CODES[e.keyCode], e)
      this._keyStates[e.keyCode] = false
    }
  }

  isKeyPressed (keyName) {
    return this._keyStates[KEYS[keyName]]
  }

  dispose () {
    window.removeEventListener('keydown', this._onKeyDown)
    window.removeEventListener('keyup', this._onKeyUp)
  }
}
