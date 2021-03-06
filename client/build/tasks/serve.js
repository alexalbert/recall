var gulp = require('gulp');
var browserSync = require('browser-sync');
var paths = require('../paths');
var proxy = require('proxy-middleware');
var url = require('url');

  gulp.task('serve', ['build', 'node'], function(done) {
    var proxyOptionsAccessControl = function(req,res, next){
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
    };
    var proxyOptionsApiRoute = url.parse('http://localhost:' + paths.nodeJsPort +  '/api') ;
    proxyOptionsApiRoute.route = '/api';

    var proxyOptionsAuthRoute = url.parse('http://localhost:' + paths.nodeJsPort +  '/auth') ;
    proxyOptionsAuthRoute.route = '/auth';

    browserSync({
      open: false,
      port: paths.webServerPort,
      server: {
        baseDir: ['.'],
        middleware: [
          proxyOptionsAccessControl,
          proxy(proxyOptionsApiRoute),
          proxy(proxyOptionsAuthRoute)]
      }
    }, done);
  });
