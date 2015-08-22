/**
 * Copies image assets from the gulp/assets/images folder to the public folder
 */
var gulp = require('gulp')
var changed = require('gulp-changed')
var watch = require('gulp-watch')
var config = require('../config')

var watching = false
gulp.task('images', function () {
  var task = gulp.src(config.images.src)
    .pipe(changed(config.images.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.images.dest))

  // Only watch in development
  if (config.env === 'development' && !watching) {
    watching = true
    watch(config.images.src, { verbose: true }, function () {
      gulp.start('images')
    })
  }

  return task
})
