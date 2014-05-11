var gulp = require('gulp');

var less = require('gulp-less');
var path = require('path');
var gutil = require('gulp-util');
var log = gutil.log;
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var stylish = require('jshint-stylish');
var minifyCss = require('gulp-minify-css');
var prefix = require('gulp-autoprefixer');
var sass = require('gulp-ruby-sass');
// live reload
var lrServer = require('tiny-lr')();

var runSequence = require('run-sequence');


var target = path.resolve('./public');
var permitIndexReload = true;

var notifyLivereload = function(files) {
  if (!Array.isArray(files)) {
    files = [files];
  }
  lrServer.changed({ body: { files: files } });
};

gulp.task('less', function () {
  gulp.src('./public/css/styles.less')
    .pipe(less())
    .pipe(minifyCss({keepSpecialComments:0}))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('sass', function () {
  gulp.src('./public/sass/styles.scss')
    .pipe(sass({
      style: 'expanded'
    }))
    .on('error', function(err) {
      gutil.beep();
      var err = new gutil.PluginError('gulp-ruby-sass', err, { showStack: true });
    })
    .pipe(prefix('last 2 version'))
    .pipe(rename(function (path) {
      path.basename += '-sass'
    }))
    .pipe(gulp.dest(target + '/css'))
    .pipe(minifyCss({keepSpecialComments:0}))
    .pipe(rename(function (path) {
     path.basename += '.min'
    }))
    .pipe(gulp.dest(target + '/css'));
});


gulp.task('vendor-scripts', function() {

  gulp.src(['./public/js/lib/*.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));

});


gulp.task('startLiveReload', function () {
  lrServer.listen(35729, function(err) {
    if (err) {
      return log('Livereload Error!', err);
    }
  });
});

/**
 * clean folders
 */
gulp.task('clean-css', function() {
  clean(target + 'css/*.css');
});

gulp.task('clean-js', function() {
  clean(target + 'js/vendor*.js');
});


gulp.task('notify-styles', function() {
  notifyLivereload(['/css/styles.css', '/css/styles-sass-min.css']);
});

gulp.task('notify-scripts', function() {
  notifyLivereload('/js/vendor.js');
});


gulp.task('watchers', function() {
  log('Watching for changes ...');

  gulp.watch(['./public/css/**/*.less'], function() {
    runSequence('clean-css', 'less', 'notify-styles');
  });

  gulp.watch(['./public/sass/**/*.scss'], function() {
    runSequence('clean-css', 'sass', 'notify-styles');
  });

  gulp.watch(['./public/js/lib/*.js'], function() {
    runSequence('clean-js', 'vendor-scripts', 'notify-scripts');
  });

});

gulp.task('notify-scripts', function() {
  notifyLivereload(target + '/vendor.js');
});


gulp.task('default', function(done) {
  runSequence(['less', 'sass', 'vendor-scripts'], 'startLiveReload', 'watchers', done);
});
