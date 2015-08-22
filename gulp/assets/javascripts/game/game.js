/* global PIXI */

import Pacman from './mobs/pacman'
import PacmanActor from './actors/mobs/pacman-actor'

export default class Game extends PIXI.Container {
  constructor (app, map) {
    super()

    this._app = app
    this._map = map

    this._mobActors = []

    this._spawnPacman()
  }

  _spawnPacman () {
    const spawn = this._map.getRandomPacmanSpawn()

    this._pacman = new Pacman(this)
    this._pacman.setPosition(spawn)

    const actor = new PacmanActor(this, this._pacman)
    this._mobActors.push(actor)
    this.addChild(actor)
  }

  update (delta) {
    this._mobActors.forEach((actor) => actor.update(delta))
  }

  render (renderer) {

  }
}
