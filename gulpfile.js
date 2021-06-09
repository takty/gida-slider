/**
 *
 * Gulpfile
 *
 * @author Takuto Yanagida
 * @version 2021-06-09
 *
 */


/* eslint-disable no-undef */
'use strict';

const SASS_OUTPUT_STYLE = 'compressed';  // 'expanded' or 'compressed'


const path = require('path');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ pattern: ['gulp-*'] });


// -----------------------------------------------------------------------------



const sass = gulp.parallel(
	make_task_fn_copy('./src/slide-show.scss'),
	make_task_fn_copy('./src/background-image.scss'),
);

const js = gulp.parallel(
	make_task_fn_js('./src/slide-show.js'),
	make_task_fn_js('./src/background-image.js'),
);

const build = gulp.parallel(js, sass);

const watch = (done) => {
	gulp.watch('src/**/*.js', gulp.series(js));
	gulp.watch('src/**/*.scss', gulp.series(sass));
	done();
};

exports.default = gulp.series(build, watch);


// -----------------------------------------------------------------------------


const doc_lib = () => gulp.src(['node_modules/stile/dist/**/*'])
	.pipe($.plumber())
	.pipe($.rename((p) => { p.dirname = p.dirname.replace(path.sep + 'dist', ''); }))
	.pipe(gulp.dest('./stile/'));

const doc_sass = gulp.series(doc_lib, make_task_fn_sass('docs/style.scss', './docs/css'));

const doc_js = gulp.series(js, make_task_fn_copy([
	'node_modules/stile/dist/js/stile-full.min.js',
	'dist/background-image/background-image.min.js',
	'dist/slide-show/slide-show.min.js'
], './docs'));

const doc_watch = (done) => {
	gulp.watch('src/**/*.js', gulp.series(js, doc_js));
	gulp.watch('src/**/*.scss', gulp.series(sass, doc_sass));
	gulp.watch('docs/style.scss', gulp.series(doc_sass));
	done();
};

const doc_build = gulp.parallel(doc_js, doc_sass);

const doc_default = gulp.series(doc_build, doc_watch);

exports.doc = gulp.parallel(exports.default, doc_default);


// -----------------------------------------------------------------------------


function make_task_fn_js(src, dest = './dist', base = 'src') {
	return () => gulp.src(src, { base: base })
		.pipe($.plumber())
		.pipe($.babel())
		.pipe($.terser())
		.pipe($.rename({ extname: '.min.js' }))
		.pipe($.changed(dest))
		.pipe(gulp.dest(dest));
}

function make_task_fn_sass(src, dest = './dist', base = 'src') {
	return () => gulp.src(src, { base: base })
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.dartSass({ outputStyle: SASS_OUTPUT_STYLE }))
		.pipe($.autoprefixer({ remove: false }))
		.pipe($.rename({ extname: '.min.css' }))
		.pipe($.sourcemaps.write('.'))
		.pipe($.changed(dest))
		.pipe(gulp.dest(dest));
}

function make_task_fn_copy(src, dest = './dist', base = 'src') {
	return () => gulp.src(src, { base: base })
		.pipe($.plumber())
		.pipe($.changed(dest))
		.pipe(gulp.dest(dest));
}
