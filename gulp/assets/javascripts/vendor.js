import PIXI from 'pixi.js'
window.PIXI = PIXI

let _ = {}
_.sample = require('lodash/collection/sample')
_.compact = require('lodash/array/compact')
window._ = _
