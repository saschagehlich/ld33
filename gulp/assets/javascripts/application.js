/* global PIXI, Howl */

import Stats from 'stats.js'
import MenuScene from './scenes/menu-scene'
import IntroScene from './scenes/intro-scene'
import GameScene from './scenes/game-scene'
import Vector2 from './math/vector2'
import Constants from './constants'

export default class Application {
  constructor (canvas) {
    this._canvas = canvas
    this._scene = null

    this._sound = new Howl({
      urls: ['/assets/audio/sound.mp3'],
      sprite: {
        ambient: [0, 17450, true],
        coin: [17450, 2180],
        dead: [17450 + 2180, 2180],
        fart1: [17450 + 2180 * 2, 2180],
        fart2: [17450 + 2180 * 3, 2180],
        gulg: [17450 + 2180 * 4, 2180]
      }
    })

    this._sound.play('ambient')

    this._renderer = PIXI.autoDetectRenderer(
      Constants.GAME_WIDTH,
      Constants.GAME_HEIGHT,
      {
        view: this._canvas,
        transparent: true
      }
    )

    this._loader = new PIXI.loaders.Loader()

    this._loader.add('sprites', '/assets/images/sprites.json')
    this._loader.add('map', '/assets/images/map.png')
    this._loader.add('font-normal-16', '/assets/images/fonts/font-normal-16.fnt')
    this._loader.add('font-normal-16-sprite', '/assets/images/fonts/font-normal-16.png')
    this._loader.add('font-normal-8', '/assets/images/fonts/font-normal-8.fnt')
    this._loader.add('font-normal-8-sprite', '/assets/images/fonts/font-normal-8.png')
    this._loader.once('complete', this._onAssetsLoaded.bind(this))
    this._loader.load()

    this._tick = this._tick.bind(this)

    this._initStats()
  }

  _initStats () {
    this._stats = new Stats()
    this._stats.setMode(0)

    this._stats.domElement.style.position = 'absolute'
    this._stats.domElement.style.left = '0px'
    this._stats.domElement.style.top = '0px'

    document.body.appendChild(this._stats.domElement)
  }

  _onAssetsLoaded (loader, resources) {
    this._resources = resources
    this.setScene(MenuScene)
    this.run()
  }

  run () {
    this._lastTick = window.performance.now()
    this._running = true
    this._tick()
  }

  pause () {
    this._running = false
  }

  _tick () {
    this._stats.begin()
    this.update()
    this.render()
    this._stats.end()
    if (this._running) {
      window.requestAnimationFrame(this._tick)
    }
  }

  update () {
    const now = window.performance.now()
    const delta = now - this._lastTick

    if (this._scene) {
      this._scene.update(delta / 1000)
    }

    this._lastTick = now
  }

  render () {
    if (this._scene) {
      this._scene.render(this._renderer)
    }
  }

  setScene (Scene) {
    this._scene = new Scene(this)
  }

  startGame (withIntro, multiplayer = false) {
    let Scene = GameScene

    if (withIntro && !this._introPlayed) {
      this._introPlayed = true
      Scene = IntroScene
    }

    this._scene.dispose()
    this._scene = new Scene(this, multiplayer)
  }

  get canvasSize () { return new Vector2(this._canvas.width, this._canvas.height) }
  get renderer () { return this._renderer }
  get resources () { return this._resources }
  get sound () { return this._sound }
};

(() => {
  const canvas = document.querySelector('.js-gameCanvas')
  window.game = new Application(canvas)
})()
