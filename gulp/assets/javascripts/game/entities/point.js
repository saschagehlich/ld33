import Entity from './entity'

export default class Point extends Entity {
  constructor (...args) {
    super(...args)

    this._consumed = false
  }

  consumedBy (mob) {
    this._consumed = true
  }

  get consumed () { return this._consumed }
}
