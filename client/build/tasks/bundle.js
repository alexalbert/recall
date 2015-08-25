var gulp = require("gulp");
var exec = require("child_process").exec;
var uglify = require("gulp-uglify");

gulp.task("bundle", function(callback) {
	exec("aurelia bundle", function(err) {
		callback(err);
	});
});

gulp.task("uglify", ["bundle"], function(callback) {
	return gulp.src("dist/app-bundle.js")
				.pipe(uglify())
				.pipe(gulp.dest("dist/"));
});
