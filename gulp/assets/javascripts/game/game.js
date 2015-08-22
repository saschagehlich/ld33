/* global PIXI */

import Pacman from './mobs/pacman'
import PacmanActor from './actors/mobs/pacman-actor'

import Point from './entities/point'
import PointActor from './actors/entities/point-actor'

export default class Game extends PIXI.Container {
  constructor (app, map) {
    super()

    this._app = app
    this._map = map

    this._actors = []
    this._mobs = []

    // TODO rename to consumables
    this._points = []

    this._spawnPacman()
    this._createPoints()
  }

  _createPoints () {
    const pointSpawns = this._map.pointSpawns

    this._points = []
    pointSpawns.forEach((position, i) => {
      const point = new Point(this)
      point.setPosition(position)

      const pointActor = new PointActor(this, point)

      this._points.push(point)
      this.addChild(pointActor)
      this._actors.push(pointActor)
    })
  }

  _spawnPacman () {
    const spawn = this._map.getRandomPacmanSpawn()

    this._pacman = new Pacman(this)
    this._pacman.setPosition(spawn)

    const actor = new PacmanActor(this, this._pacman)
    this._mobs.push(this._pacman)
    this._actors.push(actor)
    this.addChild(actor)
  }

  getTouchedEntitiesForMob (mob) {
    return this._points.filter((point) =>
      mob.touchesEntity(point)
    )
  }

  update (delta) {
    this._mobs.forEach((mob) => mob.update(delta))
    this._points.forEach((point) => point.update(delta))
    this._actors.forEach((actor) => actor.update(delta))

    this._pacman.position.x -= 0.1
  }

  render (renderer) {

  }
}
