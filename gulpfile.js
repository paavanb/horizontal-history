var browserify = require('browserify')
var gulp = require('gulp');
var watch = require('gulp-watch')
var batch = require('gulp-batch')
var buffer = require('vinyl-buffer')
var notify = require('gulp-notify')
var source = require('vinyl-source-stream')
var sourcemaps = require('gulp-sourcemaps')

// Handle errors gracefully with a notification
handleErrors = function() {

  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error %>"
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};


gulp.task('browserify', function() {
    return browserify({
                entries: './src/src.js',
                paths: ['./src'],
                // Enable sourcemaps!
                debug: true
            })
            .bundle()
            .on('error', handleErrors)
            .pipe(source('src.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build/js/'))
            .pipe(notify("Task 'browserify' completed."))
})

gulp.task('watch', function() {
    watch(['./src/**/*.js'], batch(function(events, done) {
        gulp.start('browserify', done)
    }))
})

gulp.task('default', ['browserify', 'watch'])

