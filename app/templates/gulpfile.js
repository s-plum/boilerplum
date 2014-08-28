var gulp = require('gulp'),
    connect = require('gulp-connect'),
    concat = require('gulp-continuous-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    compass = require('gulp-compass'),
    watch = require('gulp-watch'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    plumber = require('gulp-plumber'),
    onError = function (err) {  
      console.log(err.toString());
    };
 
gulp.task('scripts', function() {
  return browserify('./build/js/main.js')
    .bundle()
    .on('error', onError)
    .pipe(source('main.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./dist/js'))
    .pipe(connect.reload());
});

gulp.task('scriptWatch', function() {
  gulp.watch('./build/js/**/*.js', ['scripts']);
});
 
gulp.task('html', function () {
  gulp.src('./build/*.html')
    .pipe(watch())
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});
 
gulp.task('sassy', function() {
  gulp.src('./build/css/src/*.scss')
    .pipe(watch())
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(compass({
      config_file: './config.rb',
      css: './build/css',
      sass: './build/css/src'
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());
});
 
gulp.task('images', function() {
  gulp.src('./build/img/*')
    .pipe(watch())
    .pipe(gulp.dest('./dist/img'))
    .pipe(connect.reload());
});
 
gulp.task('connect', function() { 
  connect.server({
    root: './dist',
    port: 4242,
    livereload: true
  })
});
 
 
// Default Task
gulp.task('default', ['scripts', 'scriptWatch', 'html', 'sassy', 'images', 'connect']);