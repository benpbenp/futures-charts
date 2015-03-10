var gulp = require('gulp');

var browserify = require('gulp-browserify');

var reactify = require('reactify');

var rename = require('gulp-rename');

gulp.task('browserify', function(){

    return gulp.src(['./react/main.js']).pipe(
        browserify({
        transform: [reactify],
        extensions: ['.jsx','.js'],
        debug: true})
        ).pipe(rename('bundle.js')).pipe(gulp.dest('public/scripts/react'));

});

gulp.task('watch', function() {
  gulp.watch('./react/**', ['browserify'])
});

gulp.task('default', ['browserify']);
