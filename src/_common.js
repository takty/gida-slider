/**
 *
 * Common Functions (JS)
 *
 * @author Takuto Yanagida
 * @version 2021-06-25
 *
 */


const resizeListeners = [];

document.addEventListener('DOMContentLoaded', () => {
	const ua = window.navigator.userAgent.toLowerCase();
	const isIe = (ua.indexOf('trident/7') !== -1);

	const opt = (isIe === 'ie11') ? false : { passive: true };
	window.addEventListener('resize', () => { for (let i = 0; i < resizeListeners.length; i += 1) resizeListeners[i](); }, opt);
});

function onResize(fn, doFirst = false) {
	if (doFirst) fn();
	resizeListeners.push(throttle(fn));

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
