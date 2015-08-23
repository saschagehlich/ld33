/**
 * Copies image assets from the gulp/assets/audio folder to the public folder
 */
var gulp = require('gulp')
var changed = require('gulp-changed')
var watch = require('gulp-watch')
var config = require('../config')

var watching = false
gulp.task('audio', function () {
  var task = gulp.src(config.audio.src)
    .pipe(changed(config.audio.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.audio.dest))

  // Only watch in development
  if (config.env === 'development' && !watching) {
    watching = true
    watch(config.audio.src, { verbose: true }, function () {
      gulp.start('audio')
    })
  }

  return task
})
