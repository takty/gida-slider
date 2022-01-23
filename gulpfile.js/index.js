/**
 * Gulpfile
 *
 * @author Takuto Yanagida
 * @version 2021-10-14
 */


'use strict';

const gulp = require('gulp');

const { makeJsTask }        = require('./task-js');
const { makeSassTask }      = require('./task-sass');
const { makeCopyTask }      = require('./task-copy');
const { makeTimestampTask } = require('./task-timestamp');


// -----------------------------------------------------------------------------


const js = gulp.parallel(
	makeJsTask('./src/show.js', './dist/js'),
	makeJsTask('./src/hero.js', './dist/js')
);

const sass = gulp.parallel(
	makeSassTask('./src/show.scss', './dist/css'),
	makeSassTask('./src/hero.scss', './dist/css')
);

exports.build = gulp.parallel(js, sass);

const watch = (done) => {
	gulp.watch('src/**/*.js', gulp.series(js));
	gulp.watch('src/**/*.scss', gulp.series(sass));
	done();
};

exports.default = gulp.series(exports.build, watch);


// -----------------------------------------------------------------------------


const doc_js = gulp.series(js, makeCopyTask(['dist/js/*'], './docs/js'));

const doc_css = gulp.series(sass, makeCopyTask(['dist/css/*'], './docs/css'));

const doc_sass = makeSassTask('docs/style.scss', './docs/css');

const doc_timestamp = makeTimestampTask('docs/**/*.html', './docs');

const doc_watch = (done) => {
	gulp.watch('src/**/*.js', gulp.series(doc_js, doc_timestamp));
	gulp.watch('src/**/*.scss', gulp.series(doc_css, doc_timestamp));
	gulp.watch('docs/style.scss', gulp.series(doc_sass, doc_timestamp));
	done();
};

const doc_build = gulp.parallel(doc_js, doc_css, doc_sass, doc_timestamp);

exports.doc = gulp.series(doc_build, doc_watch);
