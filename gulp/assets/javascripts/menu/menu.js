/* global PIXI */

import Keyboard from '../keyboard'

const LABEL_COLOR = 0xb1b1b1
const SELECTION_COLOR = 0xc60909

export default class Menu extends PIXI.Container {
  constructor (app) {
    super()
    this._app = app

    this._keyboard = new Keyboard()
    this._onKeyPressed = this._onKeyPressed.bind(this)
    this._keyboard.on('pressed', this._onKeyPressed)

    this._selectedOption = null

    this._options = [
      'SINGLEPLAYER',
      'MULTIPLAYER'
    ]
    this._optionStyle = {
      font: '32px font-normal-16'
    }

    this._createOptions()
    this._createSelectedOptionLabel()
    this._selectOption(0)

    this._inputBlocked = false
  }

  _onKeyPressed (key) {
    if (this._inputBlocked) return

    if (key === 'UP') {
      const option = (this._selectedOption - 1 + this._options.length) % this._options.length
      this._selectOption(option)
    } else if (key === 'DOWN') {
      const option = (this._selectedOption + 1 + this._options.length) % this._options.length
      this._selectOption(option)
    } else if (key === 'ENTER') {
      this._inputBlocked = true
      this.emit('selected', this._options[this._selectedOption])
    }
  }

  _selectOption (i) {
    const optionLabel = this._options[i]
    const { canvasSize } = this._app

    let selectLabel = '[  '
    for (let i = 0; i < optionLabel.length; i++) {
      selectLabel += ' '
    }
    selectLabel += '  ]'

    this._selectedOptionLabel.text = selectLabel
    this._selectedOptionLabel.updateTransform()

    this._selectedOptionLabel.position.x = canvasSize.x / 2 - this._selectedOptionLabel.textWidth / 2
    this._selectedOptionLabel.position.y = i * 32

    this._selectedOption = i
  }

  _createSelectedOptionLabel () {
    this._selectedOptionLabel = new PIXI.extras.BitmapText('[]', this._optionStyle)
    this._selectedOptionLabel.tint = SELECTION_COLOR
    this.addChild(this._selectedOptionLabel)
  }

  _createOptions () {
    const { canvasSize } = this._app

    this._optionLabels = []
    this._options.forEach((option, i) => {
      const label = new PIXI.extras.BitmapText(option, this._optionStyle)
      label.tint = LABEL_COLOR
      label.position.y = i * 32
      this._optionLabels.push(label)
      this.addChild(label)
    })

    this._optionLabels.forEach((label) => {
      label.position.x = canvasSize.x / 2 - label.textWidth / 2
    })
  }

  dispose () {
    this._keyboard.removeListener('pressed', this._onKeyPressed)
    this._keyboard.dispose()
  }
}
