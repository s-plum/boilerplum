var gulp = require('gulp'),
    connect = require('gulp-connect'),
    concat = require('gulp-continuous-concat'),
    uglify = require('gulp-uglify'),
    compass = require('gulp-compass'),
    watch = require('gulp-watch'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    onError = function (err) {  
      console.log(err.toString());
    },
    srcPath = 'src';
    distPath = 'dist';
    srcPaths = {
      css: srcPath + '/css/**/*.css',
      html: srcPath + '/**/*.html',
      img: srcPath + '/img/**/*',
      js: srcPath + '/js/**/*.js',
      sass: srcPath + '/css/src/**/*.scss',
      sassMap: srcPath + '/css/*.map'
    };
    distPaths = {
      css: distPath + '/css',
      img: distPath + '/img',
      js: distPath + '/js',
      sass: distPath + '/css/src'
    };
 
gulp.task('watch:scripts', function() {
  watch(srcPaths.js, function(files, cb) {
    gulp.start('scripts', cb);
  });
});

gulp.task('watch:html', function() {
  watch(srcPaths.html, function(files, cb) {
    gulp.start('html', cb);
  });
});

gulp.task('watch:images', function() {
  watch([srcPath + '/img', srcPath + '/img/**/*.jpg', srcPath + '/img/**/*.png', srcPath + '/img/**/*.gif', srcPath + '/img/**/*.svg'], function(files, cb) {
    gulp.start('images', cb);
  });
});

gulp.task('watch:sass', function() {
  watch(srcPaths.sass, function(files, cb) {
    gulp.start('sassy', cb);
  });
});

gulp.task('watch', ['watch:scripts','watch:html','watch:images', 'watch:sass']);

gulp.task('clean:html', function (cb) {
  del([distPath + '/**/*.html'], cb)
});

gulp.task('clean:sass', function (cb) {
  del([distPaths.css + '/*', srcPaths.css], cb)
});

gulp.task('clean:images', function (cb) {
  del([distPaths.img + '/*'], cb)
});

gulp.task('scripts', function() {
  return browserify('./' + srcPath + '/js/main.js')
    .bundle()
    .on('error', onError)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(source('main.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./' + distPaths.js))
    .pipe(connect.reload());
});

gulp.task('html', ['clean:html'], function () {
  gulp.src(srcPaths.html)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulp.dest('./' + distPath))
    .pipe(connect.reload());
});
 
gulp.task('sassy', function() {
  gulp.src(srcPaths.sass)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(compass({
      config_file: './config.rb',
      css: './' + srcPath + '/css',
      sass: './' + srcPath + '/css/src',
      sourcemap: true,
      debug: true
    }))
    .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
      }))
    .pipe(gulp.dest('./' + distPath + '/css'))
    .pipe(connect.reload());
});

gulp.task('sassymap', ['clean:sass', 'sassy'], function() {
  gulp.src(srcPaths.sass)
    .pipe(gulp.dest('./' + distPath + '/css/src'));
  gulp.src(srcPaths.sassMap)
    .pipe(watch(srcPaths.sassMap))
    .pipe(gulp.dest('./' + distPaths.css))
    .pipe(connect.reload());
});
 
gulp.task('images', ['clean:images'], function() {
  gulp.src(srcPaths.img)
    .pipe(gulp.dest('./' + distPaths.img))
    .pipe(connect.reload());
});
 
gulp.task('connect', function() { 
  connect.server({
    root: './' + distPath,
    port: 4242,
    livereload: true
  })
});

// Default Task
gulp.task('default', ['scripts', 'html', 'sassymap', 'images', 'watch', 'connect']);