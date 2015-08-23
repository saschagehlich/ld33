/* global PIXI */

import Keyboard from '../keyboard.js'
import Constants from '../constants'

import Hero from './mobs/hero'
import HeroActor from './actors/mobs/hero-actor'

import Monster from './mobs/monster'
import MonsterActor from './actors/mobs/monster-actor'

import Gold from './entities/gold'
import GoldActor from './actors/entities/gold-actor'

import Bottle from './entities/bottle'
import BottleActor from './actors/entities/bottle-actor'

const MONSTER_COLORS = [
  0xc60909,
  0x0b9922,
  0x0b1c99,
  0x97990b
]

export default class Game extends PIXI.Container {
  constructor (app, map) {
    super()

    this._app = app
    this._map = map
    this._keyboard = new Keyboard()

    this._controlledMonsterIndex = 0

    this._actors = []
    this._mobs = []
    this._monsters = []

    // TODO rename to consumables
    this._entitiesMap = []
    this._entities = []

    this._createEntities()
    this._spawnHero()
    this._spawnMonsters()

    this._keyboard.on('pressed', this._onKeyPressed.bind(this))
  }

  _onKeyPressed (key) {
    if (key === 'SHIFT') {
      this._switchControlledMonster()
    }
  }

  _switchControlledMonster () {
    const currentMonster = this._monsters[this._controlledMonsterIndex]
    currentMonster.controlledByUser = false

    this._controlledMonsterIndex = (this._controlledMonsterIndex + 1) % this._monsters.length
    const newMonster = this._monsters[this._controlledMonsterIndex]
    newMonster.controlledByUser = true
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

      this.addChild(goldActor)
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

      this.addChild(bottleActor)
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
      this.addChild(actor)
    })
  }

  _spawnHero () {
    const spawn = this._map.getRandomHeroSpawn()

    this._hero = new Hero(this, this._map, spawn)
    this._hero.setPosition(spawn)

    const actor = new HeroActor(this, this._hero)
    this._mobs.push(this._hero)
    this._actors.push(actor)
    this.addChild(actor)
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
    this._mobs.forEach((mob) => mob.update(delta))
    this._entities.forEach((entity) => entity.update(delta))
    this._actors.forEach((actor) => actor.update(delta))

    const now = window.performance.now()
    if (this._bottleActive && (now - this._bottleActiveSince) >= Constants.BOTTLE_DURATION) {
      this.bottleInactive()
    }
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

  bottleInactive () {
    this._bottleActive = false

    this._monsters.forEach((monster) => {
      monster.canAttack = true
      monster.isAttackable = false
    })
    this._hero.canAttack = false
    this._hero.isAttackable = true
  }

  get monsters () {
    return this._monsters
  }
}
