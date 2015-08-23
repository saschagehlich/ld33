import PIXI from 'pixi.js'
window.PIXI = PIXI

let _ = {}
_.sample = require('lodash/collection/sample')
_.compact = require('lodash/array/compact')
_.invert = require('lodash/object/invert')
_.without = require('lodash/array/without')
window._ = _
