/**
 *
 * Gulpfile
 *
 * @author Takuto Yanagida
 * @version 2021-06-24
 *
 */


'use strict';

const gulp = require('gulp');

const { makeJsTask, makeSassTask, makeCopyTask } = require('./common');


// -----------------------------------------------------------------------------


const js = gulp.parallel(
	makeJsTask('./src/show.js'),
	makeJsTask('./src/hero.js')
);

const sass = gulp.parallel(
	makeSassTask('./src/show.scss'),
	makeSassTask('./src/hero.scss')
);

exports.build = gulp.parallel(js, sass);

const watch = (done) => {
	gulp.watch('src/**/*.js', gulp.series(js));
	gulp.watch('src/**/*.scss', gulp.series(sass));
	done();
};

exports.default = gulp.series(exports.build, watch);


// -----------------------------------------------------------------------------


const doc_js = gulp.series(js, makeCopyTask([
	'dist/**/hero.min.js*(.map)',
	'dist/**/show.min.js*(.map)',
], './docs/js'));


const doc_css = gulp.series(sass, makeCopyTask([
	'dist/**/hero.min.css*(.map)',
	'dist/**/show.min.css*(.map)',
], './docs/css'));

const doc_sass = makeSassTask('docs/style.scss', './docs/css');

const doc_watch = (done) => {
	gulp.watch('src/**/*.js', doc_js);
	gulp.watch('src/**/*.scss', doc_css);
	gulp.watch('docs/style.scss', doc_sass);
	done();
};

const doc_build = gulp.parallel(doc_js, doc_css, doc_sass);

exports.doc = gulp.series(doc_build, doc_watch);
