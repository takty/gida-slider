/**
 * Buttons
 *
 * @author Takuto Yanagida
 * @version 2022-07-27
 */


const CLS_PREV   = NS + '-prev';
const CLS_NEXT   = NS + '-next';
const CLS_ACTIVE = 'active';
const DX_FLICK   = 50;

let stFlick = { prev: null, next: null };

function initButtons(size, root, transitionFn) {
	const frame   = root.getElementsByClassName(CLS_FRAME)[0];
	const prevBtn = root.getElementsByClassName(CLS_PREV)[0];
	const nextBtn = root.getElementsByClassName(CLS_NEXT)[0];
	if (size === 1) {
		if (prevBtn) prevBtn.style.display = 'none';
		if (nextBtn) nextBtn.style.display = 'none';
		return;
	}
	const prevFn = async () => { await transitionFn(null, -1); };
	const nextFn = async () => { await transitionFn(null,  1); };
	if (prevBtn) prevBtn.addEventListener('click', async () => { frame.dataset.disabled = true; await prevFn(); frame.dataset.disabled = false; });
	if (nextBtn) nextBtn.addEventListener('click', async () => { frame.dataset.disabled = true; await nextFn(); frame.dataset.disabled = false; });
	if (window.ontouchstart === null) _initFlick(frame, prevFn, nextFn, prevBtn, nextBtn);
}

function _initFlick(frame, prevFn, nextFn, prevBtn, nextBtn) {
	let stX, mvX;

	frame.addEventListener('touchstart', (e) => {
		stX = e.touches[0].pageX;
		mvX = null;
	});
	frame.addEventListener('touchmove', (e) => {
		mvX = e.changedTouches[0].pageX;
	});
	frame.addEventListener('touchend', (e) => {
		if (mvX === null) return;
		if (stX + DX_FLICK < mvX) {  // ->
			prevFn();
			_setCommonFlickProcess(e, prevBtn, 'prev');
		} else if (mvX < stX - DX_FLICK) {  // <-
			nextFn();
			_setCommonFlickProcess(e, nextBtn, 'next');
		}
	});
}

function _setCommonFlickProcess(e, btn, which) {
	if (e.cancelable === true) e.preventDefault();
	if (!btn) return;
	clearTimeout(stFlick[which]);
	btn.classList.add(CLS_ACTIVE);
	stFlick[which] = setTimeout(() => { btn.classList.remove(CLS_ACTIVE); }, timeTran * 1000 / 2);
}
