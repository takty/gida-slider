/**
 * Common Functions
 *
 * @author Takuto Yanagida
 * @version 2022-07-19
 */


const resizeListeners = [];

function onResize(fn, doFirst = false) {
	if (doFirst) fn();
	resizeListeners.push(throttle(fn));
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
