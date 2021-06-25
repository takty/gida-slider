/**
 *
 * Backgrounds
 *
 * @author Takuto Yanagida
 * @version 2021-06-24
 *
 */


const CLS_BGS = NS + '-backgrounds';

const bgs = [];

function initBackgrounds(size, root, slides, time) {
	const frame = document.createElement('div');
	frame.classList.add(CLS_BGS);
	root.insertBefore(frame, root.firstChild);

	for (let i = 0; i < size; i += 1) {
		const sl  = slides[i];
		const bg  = document.createElement('div');
		const img = sl.dataset.img ?? sl.dataset.imgLeft;
		if (img) {
			bg.style.backgroundImage    = `url('${img}')`;
			bg.style.transitionDuration = `${time * 2}s`;
		}
		frame.appendChild(bg);
		bgs.push(bg);
	}
}

function transitionBackgrounds(idx, size) {
	for (let i = 0; i < size; i += 1) {
		if (!bgs[i]) continue;
		bgs[i].classList[i === idx ? 'add' : 'remove'](CLS_VISIBLE);
	}
}
