/* global PIXI */
import Scene from './scene'
import Keyboard from '../keyboard'
import StoryChapter from '../intro/story-chapter'
import RulesChapter from '../intro/rules-chapter'
import ControlsChapter from '../intro/controls-chapter'

export default class IntroScene extends Scene {
  constructor (...args) {
    super(...args)

    this._createBackground()

    this._onKeyPressed = this._onKeyPressed.bind(this)
    this._onChapterDone = this._onChapterDone.bind(this)

    this._keyboard = new Keyboard()
    this._keyboard.on('pressed', this._onKeyPressed)

    this._chapters = [
      StoryChapter,
      RulesChapter,
      ControlsChapter
    ]
    this._chapterIndex = 0
    this._selectChapter(0)
  }

  _createBackground () {
    let { canvasSize } = this._app
    this._backgroundSprite = PIXI.Texture.fromFrame('level/ground.png')
    this._backgroundSprite = new PIXI.extras.TilingSprite(this._backgroundSprite, canvasSize.x, canvasSize.y)
    this.addChild(this._backgroundSprite)
  }

  _selectChapter (index) {
    if (this._chapter) {
      this._chapter.removeListener('done', this._onChapterDone)
      this.removeChild(this._chapter)
    }

    const Chapter = this._chapters[index]
    this._chapter = new Chapter(this._app)
    this._chapter.on('done', this._onChapterDone)
    this._chapterIndex = index
    this.addChild(this._chapter)
  }

  _onChapterDone () {
    this._chapterIndex++
    if (this._chapterIndex >= this._chapters.length) {
      this._onDone()
    } else {
      this._selectChapter(this._chapterIndex)
    }
  }

  _onDone () {
    this._app.startGame()
  }

  _onKeyPressed (key, e) {
    if (key === 'SPACE') {
      this._chapter.next()
    }
  }

  update (delta) {
    this._chapter.update(delta)
  }

  dispose () {
    this._keyboard.removeListener('keypressed', this._onKeyPressed)
    this._keyboard.dispose()
  }
}
