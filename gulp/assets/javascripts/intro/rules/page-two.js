/* global PIXI */
import Page from '../page'
import Constants from '../../constants'
import Vector2 from '../../math/vector2'
import Player from '../../game/player'

import Monster from '../../game/mobs/monster'
import MonsterActor from '../../game/actors/mobs/monster-actor'

export default class PageTwo extends Page {
  constructor (...args) {
    super(...args)

    const { canvasSize } = this._app

    this._monsters = []
    this._monsterActors = []

    this._fakePlayer = new Player(this, 2)
    this._fakeGame = {
      isHeroAttackable: () => true
    }

    for (let i = 0; i < 4; i++) {
      const monster = new Monster(this._fakeGame, null, null, true)
      monster.setPosition(new Vector2(20 + i * 3, 19))
      this._monsters.push(monster)

      if (i === 0) {
        monster.controlledByUser = this._fakePlayer
      }

      const monsterActor = new MonsterActor(this._fakeGame, monster, Constants.PRIMARY_COLOR_RED)
      monsterActor.scale = new PIXI.Point(2, 2)
      this._monsterActors.push(monsterActor)
      this.addChild(monsterActor)
    }

    this._text = 'If you touch Sir Pantless, you win.\nBut if he touches one of your monsters\nwhile you\'re not controlling them, they\ndie.'
  }

  update (delta) {
    super(delta)
    this._monsters.forEach((monster) => monster.update(delta))
    this._monsterActors.forEach((actor) => actor.update(delta))
  }
}
