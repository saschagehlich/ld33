/* global PIXI, _ */

import Keyboard from '../keyboard.js'
import Constants from '../constants'

import Map from './map'
import UI from './ui'
import GameOver from './game-over'

import Hero from './mobs/hero'
import HeroActor from './actors/mobs/hero-actor'

import Monster from './mobs/monster'
import MonsterActor from './actors/mobs/monster-actor'

import Gold from './entities/gold'
import GoldActor from './actors/entities/gold-actor'

import Bottle from './entities/bottle'
import BottleActor from './actors/entities/bottle-actor'

import Fart from './mobs/fart'
import FartActor from './actors/mobs/fart-actor'

const MONSTER_COLORS = [
  0xc60909,
  0x0b9922,
  0x0b1c99,
  0x97990b
]

export default class Game extends PIXI.Container {
  constructor (app) {
    super()

    this._app = app
    this._map = new Map(this._app)
    this._map.render()

    this._container = new PIXI.Container()
    this._container.position = new PIXI.Point(35, 35)
    this.addChild(this._container)

    this._container.addChild(this._map)

    this._keyboard = new Keyboard()

    this._controlledMonsterIndex = 0

    this._actors = []
    this._fartActors = []
    this._mobs = []
    this._monsters = []
    this._farts = []

    // TODO rename to consumables
    this._entitiesMap = []
    this._entities = []

    this._createEntities()
    this._spawnHero()
    this._spawnMonsters()

    this._onKeyPressed = this._onKeyPressed.bind(this)
    this._keyboard.on('pressed', this._onKeyPressed)

    this._initUI()
  }

  _initUI () {
    this._ui = new UI(this._app, this)
    this.addChild(this._ui)
  }

  playSound (sound) {
    this._app.sound.play(sound)
  }

  _onKeyPressed (key, e) {
    if (key === 'SHIFT') {
      this._switchControlledMonster()
    }

    if (key === 'SPACE' && this._gameOver) {
      this._app.startGame()
      e.preventDefault()
    }
  }

  _switchControlledMonster () {
    const newMonster = this._monsters[(this._controlledMonsterIndex + 1) % this._monsters.length]
    this.switchToMonster(newMonster)
  }

  switchToMonster (monster) {
    const currentMonster = this._monsters[this._controlledMonsterIndex]
    currentMonster.controlledByUser = false

    this._controlledMonsterIndex = this._monsters.indexOf(monster)
    monster.controlledByUser = true
  }

  _createEntities () {
    const goldSpawns = this._map.goldSpawns

    this._entities = []
    goldSpawns.forEach((position, i) => {
      const gold = new Gold(this, this._map)
      gold.setPosition(position)

      const goldActor = new GoldActor(this, gold)

      if (!this._entitiesMap[position.y]) {
        this._entitiesMap[position.y] = []
      }
      this._entitiesMap[position.y][position.x] = gold
      this._entities.push(gold)

      this._container.addChild(goldActor)
      this._actors.push(goldActor)
    })

    const bottleSpawns = this._map.bottleSpawns
    bottleSpawns.forEach((position, i) => {
      const bottle = new Bottle(this, this._map)
      bottle.setPosition(position)

      const bottleActor = new BottleActor(this, bottle)

      if (!this._entitiesMap[position.y]) {
        this._entitiesMap[position.y] = []
      }
      this._entitiesMap[position.y][position.x] = bottle
      this._entities.push(bottle)

      this._container.addChild(bottleActor)
      this._actors.push(bottleActor)
    })
  }

  findPathToClosestConsumableEntity (position) {
    let closestConsumable = null
    let smallestDist = Infinity
    this._entities
      .filter((entity) => !entity.consumed)
      .forEach((entity) => {
        const distVector = position.clone()
          .subtract(entity.position)
          .abs()
        const dist = Math.sqrt(distVector.x * distVector.x + distVector.y * distVector.y)

        if (dist < smallestDist) {
          closestConsumable = entity
          smallestDist = dist
        }
      })

    const path = this._map.findPath(position, closestConsumable.position)
    return path
  }

  hasConsumableEntityAt (position) {
    const entity = this._entitiesMap[position.y] && this._entitiesMap[position.y][position.x]
    if (!entity) return false
    return !entity.consumed
  }

  _spawnMonsters () {
    const spawns = this._map.monsterSpawns

    spawns.forEach((position, i) => {
      const monster = new Monster(this, this._map, position)
      monster.setPosition(position)

      if (i === this._controlledMonsterIndex) {
        monster.controlledByUser = true
      }

      const tint = MONSTER_COLORS[i]
      const actor = new MonsterActor(this, monster, tint)
      this._mobs.push(monster)
      this._monsters.push(monster)
      this._actors.push(actor)
      this._container.addChild(actor)
    })
  }

  _spawnHero () {
    const spawn = this._map.getRandomHeroSpawn()

    this._hero = new Hero(this, this._map, spawn)
    this._hero.setPosition(spawn)

    const actor = new HeroActor(this, this._hero)
    this._mobs.push(this._hero)
    this._actors.push(actor)
    this._container.addChild(actor)
  }

  getTouchedEntitiesForMob (mob) {
    return this._entities.filter((entity) =>
      mob.touchesEntity(entity)
    )
  }

  getTouchedMobsForMob (mob) {
    return this._mobs.filter((_mob) => mob !== _mob)
      .filter((_mob) => {
        return _mob.touchesMob(mob)
      })
  }

  update (delta) {
    if (this._gameOver) {
      return this._gameOver.update()
    }

    this._mobs.forEach((mob) => mob.update(delta))
    this._entities.forEach((entity) => entity.update(delta))
    this._actors.forEach((actor) => actor.update(delta))

    const now = window.performance.now()
    if (this._bottleActive && (now - this._bottleActiveSince) >= Constants.BOTTLE_DURATION) {
      this.bottleInactive()
    }

    const deletedFartActors = this._fartActors.filter((actor) => actor.object.deleted)
    if (deletedFartActors.length) {
      const deletedFarts = deletedFartActors.map((actor) => actor.object)
      this._actors = _.difference(this._actors, deletedFartActors)
      this._farts = _.difference(this._farts, deletedFarts)
      this._mobs = _.difference(this._mobs, deletedFarts)
      this._fartActors = _.difference(this._fartActors, deletedFartActors)
      deletedFartActors.forEach((actor) => this.removeChild(actor))
    }

    const consumableEntities = this._entities.filter((entity) => !entity.consumed)
    if (!consumableEntities.length) {
      this.gameOver(false, 'The hero was able to collect all the gold')
    }

    this._ui.update(delta)
    this._map.update(delta)
  }

  getNextAliveMonster () {
    const aliveMonsters = this._monsters.filter((monster) => monster.isAlive)
    if (!aliveMonsters.length) { return null }

    return _.sample(aliveMonsters)
  }

  gameOver (win, reason) {
    this._gameOver = new GameOver(this, this._app, win, reason)
    this.addChild(this._gameOver)
  }

  render (renderer) {

  }

  bottleActive () {
    const now = window.performance.now()
    this._bottleActive = true
    this._bottleActiveSince = now

    this._monsters.forEach((monster) => {
      monster.canAttack = false
      monster.isAttackable = true
    })
    this._hero.canAttack = true
    this._hero.isAttackable = false
  }

  spawnFartAt (position) {
    const fart = new Fart(this)
    fart.setPosition(position.clone())
    this._farts.push(fart)
    this._mobs.push(fart)

    const fartActor = new FartActor(this, fart)
    this._actors.push(fartActor)
    this._fartActors.push(fartActor)

    this._container.addChild(fartActor)
  }

  bottleInactive () {
    this._bottleActive = false

    this._monsters.forEach((monster) => {
      monster.canAttack = monster.controlledByUser
      monster.isAttackable = !monster.canAttack
    })
    this._hero.canAttack = false
    this._hero.isAttackable = true
  }

  isHeroAttackable () {
    return this._hero.isAttackable
  }

  get monsters () {
    return this._monsters
  }

  get hero () {
    return this._hero
  }

  dispose () {
    this._keyboard.dispose()
  }
}
