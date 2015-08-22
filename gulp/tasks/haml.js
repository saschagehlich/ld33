var gulp = require('gulp')
var haml = require('gulp-ruby-haml')
var watch = require('gulp-watch')
var handleErrors = require('../util/handleErrors')
var config = require('../config')

var watching = false

gulp.task('haml', function () {
  var task = gulp.src(config.haml.src)
    .pipe(haml(config.haml.settings))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.haml.dest))

  if (config.env === 'development' && !watching) {
    watching = true

    // Watch for changes
    watch(config.haml.src, { verbose: true }, function () {
      gulp.start('haml')
    })
  }
  return task
})
