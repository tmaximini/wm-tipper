var gulp = require('gulp');

var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var path = require('path');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');

gulp.task('less', function () {
  gulp.src('./public/css/styles.less')
    .pipe(less())
    .pipe(minifyCss({keepSpecialComments:0}))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('scripts', function() {

  gulp.src(['./public/js/lib/*.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));

});


gulp.task('default', function(done) {
  runSequence(['less', 'scripts'], done);
});
