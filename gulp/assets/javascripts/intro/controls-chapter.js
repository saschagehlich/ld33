import Chapter from './chapter'

import PageOne from './controls/page-one'

export default class StoryChapter extends Chapter {
  constructor (...args) {
    super(...args)
  }

  _init () {
    this._pages = [
      PageOne
    ]
  }
}
