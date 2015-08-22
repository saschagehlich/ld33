/* global PIXI */

import Stats from 'stats.js'
import GameScene from './scenes/game-scene'
import Vector2 from './math/vector2'
import Constants from './constants'

export default class Application {
  constructor (canvas) {
    this._canvas = canvas
    this._scene = null

    this._renderer = PIXI.autoDetectRenderer(
      Constants.GAME_WIDTH,
      Constants.GAME_HEIGHT,
      {
        view: this._canvas
      }
    )

    this._loader = new PIXI.loaders.Loader()

    this._loader.add('sprites', '/assets/images/sprites.json')
    this._loader.add('map', '/assets/images/map.png')
    this._loader.once('complete', this._onAssetsLoaded.bind(this))
    this._loader.load()

    this._tick = this._tick.bind(this)

    this._initStats()
  }

  _initStats () {
    this._stats = new Stats()
    this._stats.setMode(0)

    this._stats.domElement.style.position = 'absolute';
    this._stats.domElement.style.left = '0px';
    this._stats.domElement.style.top = '0px';

    document.body.appendChild(this._stats.domElement)
  }

  _onAssetsLoaded (loader, resources) {
    this._resources = resources
    this.setScene(GameScene)
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
    const delta = this._lastTick - now

    if (this._scene) {
      this._scene.update(delta)
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

  get canvasSize () { return new Vector2(this._canvas.width, this._canvas.height) }
  get renderer () { return this._renderer }
  get resources () { return this._resources }
};

(() => {
  const canvas = document.querySelector('.js-gameCanvas')
  window.game = new Application(canvas)
})()
