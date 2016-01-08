var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');

gulp.task('browserify', function(){
  var b = browserify({entries:['react/js/app.js']});
  b.transform(reactify); // use the reactify transform
  return b.bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch',function(){
	gulp.watch('react/js/*.js', ['browserify']);
	gulp.watch('react/js/*.jsx', ['browserify']);
});

gulp.task('default',['watch', 'browserify']);
