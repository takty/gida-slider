/**
 *
 * Gida Slider - Hero (JS)
 *
 * @author Takuto Yanagida
 * @version 2021-06-29
 *
 */


window.GIDA = window['GIDA'] ?? {};


window.GIDA.slider_hero_initialize = function (id, opts) {
	const NS          = 'gida-slider-hero';
	const CLS_SLIDES  = NS + '-slides';
	const CLS_VISIBLE = 'visible';
	const CLS_DISPLAY = 'display';
	const CLS_VIEW    = 'view';
	const CLS_PAUSE   = 'pause';
	const OFFSET_VIEW = 100;

	const root = id ? document.getElementById(id) : document.getElementsByClassName(NS)[0];
	if (!root) return;

	if (opts === undefined) opts = {};
	const effectType   = opts['effect_type']      ?? 'slide';
	const timeDur      = opts['duration_time']    ?? 8;  // [second]
	const timeTran     = opts['transition_time']  ?? 1;  // [second]
	const randomTiming = opts['is_random_timing'] ?? false;

	const slides = Array.prototype.slice.call(root.querySelectorAll(`.${CLS_SLIDES} > li`));
	const size   = slides.length;
	const pics   = [];
	let effect   = null;

	let onTransitionEnd = null;
	let hasVideo        = false;


	// -------------------------------------------------------------------------


	// @include _common.js
	// @include _transition-slide.js
	// @include _transition-scroll.js
	// @include _transition-fade.js
	// @include _picture-image.js
	// @include _picture-video.js


	// -------------------------------------------------------------------------


	initImages();

	document.addEventListener('DOMContentLoaded', () => {
		const io = new IntersectionObserver((es) => {
			for (const e of es) root.classList[e.isIntersecting ? 'add' : 'remove'](CLS_VIEW);
		}, { rootMargin: `${OFFSET_VIEW}px 0px` });
		io.observe(root);

		transition(0, 0);
	});
	if (hasVideo) setTimeout(tryResizeVideo, 100);
	function tryResizeVideo() {
		const finish = onResizeVideo();
		if (!finish) setTimeout(tryResizeVideo, 100);
	}


	// -------------------------------------------------------------------------


	function initImages() {
		const scroll = root.classList.contains(CLS_SCROLL);
		for (const sl of slides) {
			if (scroll) sl.classList.add(CLS_SCROLL);

			sl.style.opacity = 0;  // for avoiding flickering slides on page loading
			let p = null;
			if (isVideo(sl)) {
				p = new PictureVideo(sl);
				hasVideo = true;
			} else {
				p = new PictureImage(sl);
			}
			sl.insertBefore(p.getElement(), sl.firstChild);
			pics.push(p);
		}
		if (hasVideo) onResize(onResizeVideo);
		switch (effectType) {
			case 'slide' : effect = new TransitionSlide(size, slides, timeTran); break;
			case 'scroll': effect = new TransitionScroll(size, slides, timeTran); break;
			case 'fade'  : effect = new TransitionFade(size, slides, timeTran); break;
			default      : effect = new TransitionSlide(size, slides, timeTran); break;
		}
	}

	function isVideo(sl) {
		if (sl.dataset.video) return true;
		const vs = sl.querySelectorAll(':scope > video');
		return 0 < vs.length;
	}

	function onResizeVideo() {
		let finish = true;
		for (let i = 0; i < size; i += 1) {
			const p = pics[i];
			if (p instanceof PictureVideo) {
				if (!p.onResize()) finish = false;
			}
		}
		return finish;
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
		await effect.transition(idx, dir);
		if (onTransitionEnd) onTransitionEnd();
		curIdx = idx;
		display(idx);
	}

	async function display(idx) {
		for (let i = 0; i < slides.length; i += 1) {
			pics[i].display((i % size) === idx);
		}
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


	// -------------------------------------------------------------------------


	return {
		next           : () => { transition((curIdx === size - 1) ? 0   : (curIdx + 1),  1); },
		previous       : () => { transition((curIdx === 0) ? (size - 1) : (curIdx - 1), -1); },
		onTransitionEnd: (fn) => { onTransitionEnd = fn; }
	};

}
