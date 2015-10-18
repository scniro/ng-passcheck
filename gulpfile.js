﻿/// <binding ProjectOpened='sass:watch' />
var gulp = require('gulp');

var uglify = require('gulp-uglify');

var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');

var rename = require('gulp-rename');

gulp.task('sass', function () {
	return gulp.src('demo-site/sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('demo-site/css'));
});

gulp.task('sass:watch', function () {
	gulp.watch('demo-site/sass/*.scss', ['sass']);
});