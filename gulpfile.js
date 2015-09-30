var gulp = require('gulp')
var babel = require('gulp-babel')
var browserify = require('gulp-browserify')

var livereload = require('gulp-livereload')

gulp.task('scripts', function() {
  return gulp.src('src/js/app.js')
          .pipe(browserify())
          .pipe(babel())
          .pipe(gulp.dest('dist/js'))
          .pipe(livereload())
})

gulp.task('watch', function() {
    livereload.listen()
    gulp.watch('./src/js/**/*', ['scripts'])
});

gulp.task('default', ['scripts', 'watch'])
