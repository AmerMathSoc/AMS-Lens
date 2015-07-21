'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var through2 = require('through2');
var path = require('path');

gulp.task('assets', function() {
  gulp.src('assets/**/*', {base:"./assets"})
        .pipe(gulp.dest('dist'));

  gulp.src('data/**/*', {base:"."})
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  gulp.src('./lens.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('lens.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('browserify', function () {
    return gulp.src('./boot.js')
        .pipe(through2.obj(function (file, enc, next) {
            browserify(file.path)
                .bundle(function (err, res) {
                    if (err) { return next(err); }
                    file.contents = res;
                    next(null, file);
                });
        }))
        .on('error', function (error) {
            console.log(error.stack);
            this.emit('end');
        })
        .pipe(uglify())
        .pipe(rename('lens.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['assets', 'sass', 'browserify']);