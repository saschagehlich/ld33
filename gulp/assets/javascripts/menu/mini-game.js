/* global PIXI */

import Vector2 from '../math/vector2'
import Hero from '../game/mobs/hero'
import HeroActor from '../game/actors/mobs/hero-actor'

export default class MiniGame extends PIXI.Container {
  constructor (app) {
    super()
    this._app = app

    this._spawnHero()
  }

  _spawnHero () {
    this._hero = new Hero(this, null, null, true)
    this._hero._direction = 2
    this._hero.setPosition(new Vector2(24, 19))
    this._heroActor = new HeroActor(this, this._hero)
    this._heroActor.scale = new PIXI.Point(2, 2)
    this.addChild(this._heroActor)
  }

  update (delta) {
    this._hero.update(delta)
    this._heroActor.update(delta)
  }
}
