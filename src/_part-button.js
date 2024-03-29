/**
 * Buttons
 *
 * @author Takuto Yanagida
 * @version 2022-07-28
 */


const CLS_PREV   = NS + '-prev';
const CLS_NEXT   = NS + '-next';
const CLS_ACTIVE = 'active';
const DX_FLICK   = 32;

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
	const sts = { prev: null, next: null };
	let px;

	frame.addEventListener('touchstart', e => { px = e.touches[0].pageX; });
	frame.addEventListener('touchmove', e => {
		if (px === null) return;
		const x = e.changedTouches[0].pageX;

		if (px + DX_FLICK < x) {  // ->
			prevFn();
			_setCommonFlickProcess(e, prevBtn, 'prev', sts);
			px = null;
		} else if (x < px - DX_FLICK) {  // <-
			nextFn();
			_setCommonFlickProcess(e, nextBtn, 'next', sts);
			px = null;
		}
	});
	frame.addEventListener('touchend', () => { px = null; });
}

function _setCommonFlickProcess(e, btn, which, sts) {
	if (e.cancelable === true) e.preventDefault();
	if (!btn) return;
	clearTimeout(sts[which]);
	btn.classList.add(CLS_ACTIVE);
	sts[which] = setTimeout(() => { btn.classList.remove(CLS_ACTIVE); }, timeTran * 1000 / 2);
}
