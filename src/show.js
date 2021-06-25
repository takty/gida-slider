/**
 *
 * Gida Slider - Show (JS)
 *
 * @author Takuto Yanagida
 * @version 2021-06-25
 *
 */


function gida_slider_show_page(id, idx) {
	const btn = document.getElementById(id + '-rivet-' + idx);
	if (btn) btn.click();
}

function gida_slider_show_initialize(id, opts) {
	const NS          = 'gida-slider-show';
	const CLS_FRAME   = NS + '-frame';
	const CLS_SLIDES  = NS + '-slides';
	const CLS_VISIBLE = 'visible';
	const CLS_DISPLAY = 'display';
	const CLS_VIEW    = 'view';
	const CLS_PAUSE   = 'pause';
	const OFFSET_VIEW = 100;

	const root = id ? document.getElementById(id) : document.getElementsByClassName(NS)[0];
	if (!root) return;

	if (opts === undefined) opts = {};
	const effectType   = opts['effect_type']           ?? 'slide';
	const timeDur      = opts['duration_time']         ?? 8;  // [second]
	const timeTran     = opts['transition_time']       ?? 1;  // [second]
	const randomTiming = opts['is_random_timing']      ?? false;
	let bgVisible      = opts['is_background_visible'] ?? true;
	let sideVisible    = opts['is_side_slide_visible'] ?? false;

	if (effectType !== 'scroll') sideVisible = false;
	if (sideVisible) {
		bgVisible = false;
		const ss = root.querySelector('.' + CLS_SLIDES);
		ss.style.overflow = 'visible';
	}

	const slides = Array.prototype.slice.call(root.querySelectorAll(`.${CLS_SLIDES} > li`));
	const size   = slides.length;
	const pics   = [];
	let effect   = null;


	// -------------------------------------------------------------------------


	// @include _common.js
	// @include _part-background.js
	// @include _part-button.js
	// @include _part-rivet.js
	// @include _part-thumbnail.js
	// @include _part-indicator.js
	// @include _part-caption.js
	// @include _transition-slide.js
	// @include _transition-scroll.js
	// @include _transition-fade.js
	// @include _picture-image.js
	// @include _picture-video.js


	// -------------------------------------------------------------------------


	initImages();
	if (bgVisible) initBackgrounds(size, root, slides, timeTran);

	document.addEventListener('DOMContentLoaded', () => {
		initButtons(size, root, transition);
		initThumbnails(size);
		initIndicators(size, root);
		initRivets(size, root, transition);

		const io = new IntersectionObserver((es) => {
			for (const e of es) root.classList[e.isIntersecting ? 'add' : 'remove'](CLS_VIEW);
		}, { rootMargin: `${OFFSET_VIEW}px 0px` });
		io.observe(root);

		transition(0, 0);
	});


	// -------------------------------------------------------------------------


	function initImages() {
		if (effectType === 'scroll' && 1 < size && size < 5) {
			cloneSlides();
		}
		const scroll = root.classList.contains(CLS_SCROLL);
		for (const sl of slides) {
			if (scroll) sl.classList.add(CLS_SCROLL);

			sl.style.opacity = 0;  // for avoiding flickering slides on page loading
			createCaption(sl, timeTran);
			const p = sl.dataset.video ? new PictureVideo(sl) : new PictureImage(sl);
			const e = sl.querySelector('a') ?? sl;
			e.insertBefore(p.getElement(), e.firstChild);
			pics.push(p);
		}
		onResize(onResizeCaption, true);
		switch (effectType) {
			case 'slide' : effect = new TransitionSlide(size, slides, timeTran); break;
			case 'scroll': effect = new TransitionScroll(size, slides, timeTran); break;
			case 'fade'  : effect = new TransitionFade(size, slides, timeTran); break;
			default      : effect = new TransitionSlide(size, slides, timeTran); break;
		}
	}

	function cloneSlides() {
		for (let i = 0; i < size; i += 1) {
			const sl  = slides[i];
			const nsl = sl.cloneNode(true);
			slides.push(nsl);
			sl.parentNode.appendChild(nsl);
		}
	}


	// -------------------------------------------------------------------------


	let curIdx = 0;
	let stStep = null;
	let last   = 0;

	async function transition(idx, dir) {
		[idx, dir] = getIdxDir(idx, dir);

		const t = window.performance.now();
		if (dir !== 0 && t - last < timeTran * 1000) return;
		last = t;

		for (let i = 0; i < slides.length; i += 1) {
			pics[i].transition((i % size) === idx, size);
		}
		transitionBackgrounds(idx, size);
		transitionThumbnails(idx);
		transitionIndicators(idx);
		transitionRivets(idx);

		await effect.transition(idx, dir);
		curIdx = idx;
		display(idx);
	}

	async function display(idx) {
		for (let i = 0; i < slides.length; i += 1) {
			pics[i].display((i % size) === idx);
		}
		displayCaption(idx, size);
		if (size === 1) return;

		const dt = pics[idx].getDuration(timeDur, timeTran, randomTiming);
		if (stStep) stStep.clear();
		stStep = asyncTimeout(Math.ceil(dt * 1000), step);
		await stStep.set();
	}

	async function step() {
		if (root.classList.contains(CLS_VIEW) && !root.classList.contains(CLS_PAUSE)) {
			transition(null, 1);
		} else {
			asyncTimeout(timeDur * 1000, step).set();
		}
	}

	function getIdxDir(idx, dir) {
		if (idx === null) {
			idx = curIdx + dir;
			if (size - 1 < idx) idx = 0;
			if (idx < 0) idx = size - 1;
		} else if (dir === 0) {
			if (curIdx < idx) {
				dir = 1;
				if ((curIdx - (idx - size)) < (idx - curIdx)) dir = -1;
			}
			if (idx < curIdx) {
				dir = -1;
				if (((idx + size) - curIdx) < (curIdx - idx)) dir = 1;
			}
		}
		return [idx, dir];
	}

}
