/**
 * Thumbnails
 *
 * @author Takuto Yanagida
 * @version 2021-06-24
 */


const thumbs = [];

function initThumbnails(size) {
	if (size === 1) return;
	for (let i = 0; i < size; i += 1) {
		const tid = id + '-' + i;
		let it = document.querySelector('*[data-id="' + tid + '"]');
		if (!it) it = document.getElementById(tid);
		thumbs.push(it);
	}
}

function transitionThumbnails(idx) {
	for (const t of thumbs) {
		if (t) t.classList.remove(CLS_VISIBLE);
	}
	if (thumbs[idx]) thumbs[idx].classList.add(CLS_VISIBLE);
}
