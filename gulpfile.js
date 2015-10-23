/// <binding ProjectOpened='sass:watch' />
var gulp = require('gulp');

var uglify = require('gulp-uglify');

var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');

var rename = require('gulp-rename');

var crc32 = require('buffer-crc32');

var fs = require('fs');

gulp.task('minify-js', function () {
	return gulp.src('ng-passcheck/src/*.js')
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('ng-passcheck/dist'));
});

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

gulp.task('passwords', function () {
	function isNotEmpty(line) {
		return Boolean(line.length);
	}

	function parseLine(line) {
		return line.trim();
	}

	var lines = fs.readFileSync('ng-passcheck/src/passwords.txt').toString().split('\n');
	var result = lines.filter(isNotEmpty).map(parseLine);
	var json = JSON.stringify({ 'format': 'text', 'dictionary': result });
	fs.writeFileSync('ng-passcheck/dist/passwords.json', json);
});

gulp.task('passwords:hashed', function() {
	function isNotEmpty(line) {
		return Boolean(line.length);
	}

	function parseLine(line) {
		return crc32.unsigned(line.trim());
	}

	var lines = fs.readFileSync('ng-passcheck/src/passwords.txt').toString().split('\n');
	var result = lines.filter(isNotEmpty).map(parseLine);
	var json = JSON.stringify({ 'format': 'crc32', 'dictionary': result });
	fs.writeFileSync('ng-passcheck/dist/passwords-hashed.json', json);
});

gulp.task('build', ['minify-js', 'passwords', 'passwords:hashed']);