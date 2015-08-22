/**
 * Runs a static server and a browsersync server
 */
var gulp = require('gulp');
var browserSync = require('browser-sync')
var config = require('../config');

gulp.task("serve", function () {
  return browserSync({
    notify: false,
    open: false,
    server: {
      baseDir: ["./public"]
    },
    ports: {
      min: config.browserSync.port
    }
  });
});
