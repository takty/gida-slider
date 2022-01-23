/**
 * Indicators
 *
 * @author Takuto Yanagida
 * @version 2021-06-23
 */


const CLS_SLIDE_CNT = NS + '-slide-count';
const CLS_SLIDE_IDX = NS + '-slide-index';

let slideCntElms = [];
let slideIdxElms = [];

function initIndicators(size, root) {
	slideCntElms = root.querySelectorAll('.' + CLS_SLIDE_CNT);
	slideIdxElms = root.querySelectorAll('.' + CLS_SLIDE_IDX);
	for (const elm of slideCntElms) elm.innerHTML = size;
	for (const elm of slideIdxElms) elm.innerHTML = 1;
}

function transitionIndicators(idx) {
	for (const elm of slideIdxElms) elm.innerHTML = (idx + 1);
}
