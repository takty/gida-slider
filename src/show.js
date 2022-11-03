/**
 * Gida Slider - Show
 *
 * @author Takuto Yanagida
 * @version 2022-11-04
 */


window.GIDA = window['GIDA'] ?? {};

window.GIDA.sliders = window.GIDA['sliders'] ?? {};

window.GIDA.slider_show = function (id, opts = {}) {
	const NS          = 'gida-slider-show';
	const CLS_FRAME   = NS + '-frame';
	const CLS_SLIDES  = NS + '-slides';
	const CLS_VISIBLE = 'visible';
	const CLS_START   = 'start';
	const CLS_VIEW    = 'view';
	const CLS_PAUSE   = 'pause';
	const CLS_SCROLL  = 'scroll';
	const OFFSET_VIEW = 100;

	const root = id ? document.getElementById(id) : document.getElementsByClassName(NS)[0];
	if (!root) return;

	const effectType   = opts['effect_type']        ?? 'slide';  // 'scroll' or 'fade'
	const timeDur      = opts['duration_time']      ?? 8;  // [second]
	const timeTran     = opts['transition_time']    ?? 1;  // [second]
	const randomTiming = opts['random_timing']      ?? false;
	let bgVisible      = opts['background_visible'] ?? true;
	let sideVisible    = opts['side_slide_visible'] ?? false;

	root.style.setProperty('--transition-time', `${timeTran}s`);

	if (effectType !== 'scroll') sideVisible = false;
	if (sideVisible) {
		bgVisible = false;
		const ss = root.querySelector('.' + CLS_SLIDES);
		ss.style.overflow = 'visible';
	}

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
	// @include _class-caption.js
	// @include _part-background.js
	// @include _part-button.js
	// @include _part-rivet.js
	// @include _part-thumbnail.js
	// @include _part-indicator.js
	// @include _transition-slide.js
	// @include _transition-scroll.js
	// @include _transition-fade.js


	// -------------------------------------------------------------------------


	const hasVideo = initSlides();
	if (bgVisible) initBackgrounds(size, root, lis);

	if (hasVideo) setTimeout(tryResizeVideo, 100);
	function tryResizeVideo() {
		const finish = onResizeSlide();
		if (!finish) setTimeout(tryResizeVideo, 100);
	}

	const frame = root.getElementsByClassName(CLS_FRAME)[0];
	if (0 < navigator.maxTouchPoints) {
		frame.addEventListener('pointerenter', e => {
			const m = (e.pointerType === 'mouse') ? 'remove' : 'add';
			frame.classList[m]('touch');
		}, { once: true });
	}

	onLoad(() => {
		initResizeEventHandler();

		initButtons(size, root, transition);
		initThumbnails(size);
		initIndicators(size, root);
		initRivets(size, root, transition);

		initViewportDetection(root, CLS_VIEW, OFFSET_VIEW);

		transition(0, 0);
		console.log(`Gida Slider - Show (#${id}): started`);
		setTimeout(() => root.classList.add(CLS_START), 0);
	});


	// -------------------------------------------------------------------------


	function initSlides() {
		if (effectType === 'scroll' && 1 < size && size < 5) {
			cloneLis();
			if (size === 2) cloneLis();
		}
		const isScroll = root.classList.contains(CLS_SCROLL);
		let hasVideo = false;

		for (let i = 0; i < lis.length; i += 1) {
			if (isScroll) lis[i].classList.add(CLS_SCROLL);

			const ss = new Slide(lis[i], i);
			if ('video' === ss.getType()) hasVideo = true;
			sss.push(ss);
		}
		onResize(onResizeSlide, true);
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

	function cloneLis() {
		for (let i = 0; i < size; i += 1) {
			const li  = lis[i];
			const nls = li.cloneNode(true);
			lis.push(nls);
			li.parentNode.appendChild(nls);
		}
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

		transitionBackgrounds(idx, size);
		transitionThumbnails(idx);
		transitionIndicators(idx);
		transitionRivets(idx);

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
		} else if (dir === 0 && curIdx !== idx) {
			const r = (curIdx < idx) ? idx - curIdx : idx + size - curIdx;
			const l = (idx < curIdx) ? curIdx - idx : curIdx + size - idx;
			dir = (l < r) ? -1 : 1;
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
