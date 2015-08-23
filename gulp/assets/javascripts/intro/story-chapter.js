import Chapter from './chapter'

import PageOne from './story/page-one'
import PageTwo from './story/page-two'
import PageThree from './story/page-three'

export default class StoryChapter extends Chapter {
  constructor (...args) {
    super(...args)
  }

  _init () {
    this._pages = [
      PageOne,
      PageTwo,
      PageThree
    ]
  }
}
