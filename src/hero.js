/**
 * Gida Slider - Hero
 *
 * @author Takuto Yanagida
 * @version 2022-11-04
 */


window.GIDA = window['GIDA'] ?? {};

window.GIDA.sliders = window.GIDA['sliders'] ?? {};

window.GIDA.slider_hero = function (id, opts = {}) {
	const NS          = 'gida-slider-hero';
	const CLS_SLIDES  = NS + '-slides';
	const CLS_VISIBLE = 'visible';
	const CLS_START   = 'start';
	const CLS_VIEW    = 'view';
	const CLS_PAUSE   = 'pause';
	const CLS_SCROLL  = 'scroll';
	const OFFSET_VIEW = 100;

	const root = id ? document.getElementById(id) : document.getElementsByClassName(NS)[0];
	if (!root) return;

	const effectType   = opts['effect_type']     ?? 'slide';  // 'scroll' or 'fade'
	const timeDur      = opts['duration_time']   ?? 8;  // [second]
	const timeTran     = opts['transition_time'] ?? 1;  // [second]
	const randomTiming = opts['random_timing']   ?? false;

	const lis  = Array.prototype.slice.call(root.querySelectorAll(`.${CLS_SLIDES} > li`));
	const size = lis.length;
	const sss  = [];
	let effect = null;

	let onTransitionEnd = null;


	// -------------------------------------------------------------------------


	// @include _common.js
	// @include _class-slide.js
	// @include _class-mount-picture.js
	// @include _class-mount-video.js
	// @include _transition-slide.js
	// @include _transition-scroll.js
	// @include _transition-fade.js


	// -------------------------------------------------------------------------


	const hasVideo = initSlides();

	if (hasVideo) setTimeout(tryResizeVideo, 100);
	function tryResizeVideo() {
		const finish = onResizeSlide();
		if (!finish) setTimeout(tryResizeVideo, 100);
	}

	onLoad(() => {
		initResizeEventHandler();

		initViewportDetection(root, CLS_VIEW, OFFSET_VIEW);

		transition(0, 0);
		console.log(`Gida Slider - Hero (#${id}): started`);
		setTimeout(() => root.classList.add(CLS_START), 0);
	});


	// -------------------------------------------------------------------------


	function initSlides() {
		const isScroll = root.classList.contains(CLS_SCROLL);
		let hasVideo = false;

		for (let i = 0; i < lis.length; i += 1) {
			if (isScroll) lis[i].classList.add(CLS_SCROLL);

			const ss = new Slide(lis[i], i, false);
			if ('video' === ss.getType) hasVideo = true;
			sss.push(ss);
		}
		onResize(onResizeSlide);
		switch (effectType) {
			case 'slide' : effect = new TransitionSlide(size, lis, timeTran); break;
			case 'scroll': effect = new TransitionScroll(size, lis, timeTran); break;
			case 'fade'  : effect = new TransitionFade(size, lis, timeTran); break;
			default      : effect = new TransitionSlide(size, lis, timeTran); break;
		}
		return hasVideo;
	}

	function onResizeSlide() {
		let finish = true;
		for (const ss of sss) {
			if (!ss.onResize()) finish = false;
		}
		return finish;
	}


	// -------------------------------------------------------------------------


	let curIdx    = 0;
	let stStep    = null;
	let last      = 0;
	let stReserve = null;

	async function transition(idx, dir) {
		[idx, dir] = getIdxDir(idx, dir);

		const t = window.performance.now();
		if (dir !== 0 && t - last < timeTran * 1000) {
			clearTimeout(stReserve);
			stReserve = setTimeout(() => transition(idx, dir), timeTran * 1000 - (t - last));
			return;
		}
		last = t;

		for (const ss of sss) ss.onPreDisplay(idx, size);
		for (const ss of sss) ss.transition(idx, size);

		await effect.transition(idx, dir);
		if (onTransitionEnd) onTransitionEnd();
		curIdx = idx;
		display(idx);
	}

	async function display(idx) {
		for (const ss of sss) ss.display(idx, size);
		if (size === 1) return;

		const dt = sss[idx].getDuration(timeDur, timeTran, randomTiming);
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


	const fs = {
		move: idx => transition(idx, size === 2 ? 1 : 0),
		next: ()  => transition((curIdx === size - 1) ? 0          : (curIdx + 1),  1),
		prev: ()  => transition((curIdx === 0       ) ? (size - 1) : (curIdx - 1), -1),

		onTransitionEnd: fn => { onTransitionEnd = fn; }
	};
	window.GIDA.sliders[id] = fs;
	return fs;

}
