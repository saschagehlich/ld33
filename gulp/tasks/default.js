/**
 * Default task, builds everything and waits for changes
 */
var gulp = require('gulp')
gulp.task('default', ['haml', 'images', 'webpack', 'sass', 'serve'])
