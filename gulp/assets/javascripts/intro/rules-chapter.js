import Chapter from './chapter'

import PageOne from './rules/page-one'
import PageTwo from './rules/page-two'
import PageThree from './rules/page-three'
import PageFour from './rules/page-four'

export default class RulesChapter extends Chapter {
  constructor (...args) {
    super(...args)
  }

  _init () {
    this._pages = [
      PageOne,
      PageTwo,
      PageThree,
      PageFour
    ]
  }
}
