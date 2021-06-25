/**
 *
 * Buttons
 *
 * @author Takuto Yanagida
 * @version 2021-06-25
 *
 */


const CLS_PREV = NS + '-prev';
const CLS_NEXT = NS + '-next';

function initButtons(size, root, transitionFn) {
	const prevBtn = root.getElementsByClassName(CLS_PREV)[0];
	const nextBtn = root.getElementsByClassName(CLS_NEXT)[0];
	if (size === 1) {
		if (prevBtn) prevBtn.style.display = 'none';
		if (nextBtn) nextBtn.style.display = 'none';
		return;
	}
	const prevFn = async () => { await transitionFn(null, -1); };
	const nextFn = async () => { await transitionFn(null,  1); };
	if (prevBtn) prevBtn.addEventListener('click', async () => { prevBtn.disabled = true; await prevFn(); prevBtn.disabled = false; });
	if (nextBtn) nextBtn.addEventListener('click', async () => { nextBtn.disabled = true; await nextFn(); nextBtn.disabled = false; });
	if (window.ontouchstart === null) _initFlick(root, prevFn, nextFn);
}

function _initFlick(root, prevFn, nextFn) {
	const DX = 50;
	let stX, mvX, mvY;

	const frame = root.getElementsByClassName(CLS_FRAME)[0];
	frame.addEventListener('touchstart', (e) => {
		stX = e.touches[0].pageX;
		mvX = mvY = null;
	});
	frame.addEventListener('touchmove', (e) => {
		mvX = e.changedTouches[0].pageX;
		mvY = e.changedTouches[0].pageY;
	});
	frame.addEventListener('touchend', (e) => {
		if (mvX === null || mvY === null) return;
		if (mvX < stX - DX) {  // <-
			nextFn();
			if (e.cancelable === true) e.preventDefault();
		} else if (stX + DX < mvX) {  // ->
			prevFn();
			if (e.cancelable === true) e.preventDefault();
		}
	});
}
