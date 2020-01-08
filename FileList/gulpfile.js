var gulp = require('gulp');
var rename = require("gulp-rename");
var replace = require('gulp-replace');

gulp.task('default', function () {
    return gulp.src('./build/FilesList.build.js') 
        .pipe(replace(/^.*?require\(.*?\n/gm, ''))
        .pipe(rename("./build/FilesList.release.js"))
        .pipe(gulp.dest('./'));
})
