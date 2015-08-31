var gulp = require('gulp');
var paths = require('../paths');
var nodemon = require('gulp-nodemon');
var plugin = require('gulp-load-plugins')({lazy: true});
var browserSync = require('browser-sync');
gulp.task('node', ['build'], function () {
    var nodeOptions = {
        script: paths.nodeStartUpScriptPath,
        delayTime: 1,
        watch: [paths.serverBaseDir]
    };
    nodemon(nodeOptions)
        .on('change', function () {
            log('nodemon detected change...!')
        })
        .on('restart', function () {
            log('node application is restarted!')
        })
        .on('restart', function(ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                console.log("reloading noww...");
                browserSync.reload({stream: false});
                console.log("reloading noww... 2");
            }, 2000);
        })
});
function log(msg) {
    plugin.util.log(plugin.util.colors.green(msg));

}
