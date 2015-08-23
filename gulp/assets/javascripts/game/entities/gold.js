import Entity from './entity'

export default class Gold extends Entity {
  constructor (...args) {
    super(...args)

    this._consumed = false
  }

  consumedBy (mob) {
    this._consumed = true
  }

  get consumed () { return this._consumed }
  set consumed (consumed) { this._consumed = consumed }
}
