/**
 * Common Functions
 *
 * @author Takuto Yanagida
 * @version 2022-08-01
 */


const resizeListeners = [];

function onResize(fn, doFirst = false) {
	if (doFirst) fn();
	resizeListeners.push(throttle(fn));
}

function onLoad(fn) {
	if ('loading' === document.readyState) {
		document.addEventListener('DOMContentLoaded', fn);
	} else {
		setTimeout(fn, 0);
	}
}


// -----------------------------------------------------------------------------


function initResizeEventHandler() {
	window.addEventListener('resize', () => { for (const l of resizeListeners) l(); }, { passive: true });
}

function throttle(fn) {
	let isRunning;
	function run() {
		isRunning = false;
		fn();
	}
	return () => {
		if (isRunning) return;
		isRunning = true;
		requestAnimationFrame(run);
	};
}

function asyncTimeout(ms, fn = () => { }) {
	let tid = null;
	let res;
	return {
		set: () => new Promise((r) => {
			res = r
			tid = setTimeout(async () => {
				tid = null;
				await fn();
				r();
			}, ms);
		}),
		clear: () => {
			if (tid) {
				clearTimeout(tid);
				tid = null;
				res();
			}
		}
	};
}


// -----------------------------------------------------------------------------


function initViewportDetection(root, cls, offset) {
	const io = new IntersectionObserver((es) => {
		for (const e of es) root.classList[e.isIntersecting ? 'add' : 'remove'](cls);
	}, { rootMargin: `${offset}px 0px` });
	io.observe(root);

	document.addEventListener('visibilitychange', () => {
		const v = ('hidden' !== document.visibilityState);
		if (v) {
			const r = root.getBoundingClientRect();
			const h = window.innerHeight;
			if ((0 < r.top && r.top < h) || (0 < r.bottom && r.bottom < h)) {
				root.classList.add(cls);
			}
		} else {
			root.classList.remove(cls);
		}
	});
}
