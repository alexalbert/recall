var gulp = require('gulp');
var browserSync = require('browser-sync');

//var serve = require('gulp-serve');
// gulp.task('serve', ['build'], function(done) {
//   serve({
//     root: ['.'],
//     port: 9000,
//     middleware: function (req, res, next) {
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         next();
//       }
//   })});

  // this task utilizes the browsersync plugin
  // to create a dev server instance
  // at http://localhost:9000
  gulp.task('serve', ['build'], function(done) {
    browserSync({
      open: false,
      port: 9000,
      server: {
        baseDir: ['.'],
        middleware: function (req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }
      }
    }, done);
  });
