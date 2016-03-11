'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var through2 = require('through2');
var path = require('path');
var argv = require('yargs').argv;
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var path = require('path');
var fs = require('fs');
var merge = require('merge-stream');

// Usage: gulp -i pathname
// Assumption: 1) pathname contains a bunch of folders 2) each of those child folders contain an XML file and possibly article assets
// Result is written into the folder ./dist/[name]/

var scriptsPath =  argv.i || './data'; //either pass a folder or build examples in `./data`

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('dist', ['sass','browserify'], function() {
   var folders = getFolders(scriptsPath);

   var getAssets = folders.map(function(folder) {
     console.log(folder);
      return gulp.src(path.join(scriptsPath, folder)+'/**/*')
        .pipe(gulp.dest(path.join('dist/', folder)));
   });

   var getLensAssets = folders.map(function(folder) {
      return gulp.src('assets/**/*', {base:"./assets"})
        .pipe(gulp.dest(path.join('dist/',folder)));
   });

   var getSass = folders.map(function(folder) {
      return gulp.src('dist/lens.css')
        .pipe(gulp.dest(path.join('dist/',folder)));
   });

    var getLens = folders.map(function(folder) {
      var file = folder + '.xml';
       return gulp.src('dist/lens.js')
            .pipe(replace(/data\/arxiv-0312227\/arxiv-0312227.xml/g, file))
            .pipe(gulp.dest(path.join('dist/',folder)));
    });
   return merge(getAssets, getLensAssets, getSass, getLens);
});

gulp.task('sass', function () {
  gulp.src('./lens.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('lens.css'))
    .pipe(gulp.dest('./dist/'));
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
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['sass', 'browserify','dist']);
