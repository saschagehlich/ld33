/* global PIXI */
import Scene from './scene'
import Menu from '../menu/menu'
import MiniGame from '../menu/mini-game'

export default class MenuScene extends Scene {
  constructor (...args) {
    super(...args)

    this._createBackground()
    this._createLogo()
    this._createMenu()
    this._createCopyright()
    this._createMiniGame()

    this._onMenuSelect = this._onMenuSelect.bind(this)
  }

  _createMiniGame () {
    this._miniGame = new MiniGame(this)
    this.addChild(this._miniGame)
  }

  _createCopyright () {
    const { canvasSize } = this._app

    const textStyle = {
      font: '16px font-normal-8',
      align: 'center'
    }

    const text = 'COPYRIGHT (C) 2015 BY SASCHA GEHLICH\nNO PANTS HAVE BEEN WORN WHILE CREATING THIS GAME IN LESS THAN 48 HOURS.'

    this._copyRightText = new PIXI.extras.BitmapText(text, textStyle)
    this._copyRightText.position.x = canvasSize.x / 2 - this._copyRightText.textWidth / 2
    this._copyRightText.position.y = 540

    this.addChild(this._copyRightText)
  }

  _createBackground () {
    let { canvasSize } = this._app
    this._backgroundSprite = PIXI.Texture.fromFrame('level/ground.png')
    this._backgroundSprite = new PIXI.extras.TilingSprite(this._backgroundSprite, canvasSize.x, canvasSize.y)
    this.addChild(this._backgroundSprite)
  }

  _createLogo () {
    let { canvasSize } = this._app
    this._logo = PIXI.Sprite.fromFrame('logo.png')
    this.addChild(this._logo)

    this._logo.position.x = canvasSize.x / 2 - this._logo.width / 2
    this._logo.position.y = 70
  }

  _onMenuSelect (option) {
    if (option === 'SINGLEPLAYER') {
      this._app.startGame()
    } else if (option === 'MULTIPLAYER') {
      this._app.startGame(true)
    }
  }

  _createMenu () {
    this._menu = new Menu(this._app)
    this._menu.position.y = 400
    this.addChild(this._menu)

    this._menu.on('selected', this._onMenuSelect)
  }

  update (delta) {
    this._miniGame.update()
  }

  render (renderer) {
    super(renderer)
  }

  dispose () {
    this._menu.off('selected', this._onMenuSelect)
  }
}
