/* global PIXI */
import Page from '../page'
import Constants from '../../constants'

class Controls extends PIXI.Container {
  constructor (playerId, movementKeys, switchKey) {
    super()

    const style = {
      font: '32px font-normal-16'
    }

    if (playerId) {
      const playerIdLabel = new PIXI.extras.BitmapText(`Player ${playerId}`, style)
      playerIdLabel.tint = Constants.PRIMARY_COLOR_RED
      playerIdLabel.position.x = 108 / 2 - playerIdLabel.textWidth / 2
      playerIdLabel.position.y = -80
      this.addChild(playerIdLabel)
    }

    const movementLabel = new PIXI.extras.BitmapText('MOVEMENT', style)
    movementLabel.tint = Constants.PRIMARY_COLOR_RED
    movementLabel.position.x = 108 / 2 - movementLabel.textWidth / 2
    this.addChild(movementLabel)

    const switchMonsterLabel = new PIXI.extras.BitmapText('SWITCH MONSTER', style)
    switchMonsterLabel.tint = Constants.PRIMARY_COLOR_RED
    switchMonsterLabel.position.x = 108 / 2 - switchMonsterLabel.textWidth / 2
    switchMonsterLabel.position.y = 150
    this.addChild(switchMonsterLabel)

    this._keysContainer = new PIXI.Container()
    this._keysContainer.position.y = 50
    this.addChild(this._keysContainer)

    this._upKey = PIXI.Sprite.fromFrame(`keys/${movementKeys[0]}.png`)
    this._upKey.position = new PIXI.Point(36, 0)
    this._keysContainer.addChild(this._upKey)

    this._rightKey = PIXI.Sprite.fromFrame(`keys/${movementKeys[1]}.png`)
    this._rightKey.position = new PIXI.Point(36 + 36, 36)
    this._keysContainer.addChild(this._rightKey)

    this._downKey = PIXI.Sprite.fromFrame(`keys/${movementKeys[2]}.png`)
    this._downKey.position = new PIXI.Point(36, 36)
    this._keysContainer.addChild(this._downKey)

    this._leftKey = PIXI.Sprite.fromFrame(`keys/${movementKeys[3]}.png`)
    this._leftKey.position = new PIXI.Point(0, 36)
    this._keysContainer.addChild(this._leftKey)

    this._switchKey = PIXI.Sprite.fromFrame(`keys/${switchKey}.png`)
    this._switchKey.position.x = 108 / 2 - this._switchKey.width / 2
    this._switchKey.position.y = 200
    this.addChild(this._switchKey)
  }
}

export default class PageOne extends Page {
  constructor (...args) {
    super(...args)

    const { canvasSize } = this._app

    const style = {
      font: '32px font-normal-16'
    }
    const controlsLabel = new PIXI.extras.BitmapText('- CONTROLS -', style)
    controlsLabel.tint = Constants.PRIMARY_COLOR_RED
    controlsLabel.position.x = canvasSize.x / 2 - controlsLabel.textWidth / 2
    controlsLabel.position.y = 20
    this.addChild(controlsLabel)

    const y = 200
    const player1Id = this._app.multiplayer ? 1 : null
    this._player1Controls = new Controls(player1Id, ['up', 'right', 'down', 'left'], 'ctrl')
    this._player1Controls.position = new PIXI.Point(canvasSize.x / 2 - 108 / 2, y)
    this.addChild(this._player1Controls)
    if (this._app.multiplayer) {
      this._player1Controls.position = new PIXI.Point(canvasSize.x / 2 - 108 / 2 - 200, y)
      this._player2Controls = new Controls(2, ['w', 'd', 's', 'a'], 'e')
      this._player2Controls.position = new PIXI.Point(canvasSize.x / 2 - 108 / 2 + 200, y)
      this.addChild(this._player2Controls)
    }
  }

  update (delta) {
    super(delta)
  }
}
