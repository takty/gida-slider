/**
 * Backgrounds
 *
 * @author Takuto Yanagida
 * @version 2022-07-09
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
		const img = sl.querySelector(':scope img');
		if (img) {
			bg.style.backgroundImage    = `url('${img.src}')`;
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
