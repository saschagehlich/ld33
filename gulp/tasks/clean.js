/**
 * Cleans the assets destination directory
 */
var gulp = require('gulp');
var del = require('del');
var config = require('../config');

gulp.task('clean', function (cb) {
  del([config.publicAssets], cb);
});
