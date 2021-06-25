/**
 *
 * Image Picture
 *
 * @author Takuto Yanagida
 * @version 2021-06-24
 *
 */


const CLS_PIC    = NS + '-picture';
const CLS_DUAL   = 'dual';
const CLS_SCROLL = 'scroll';

const RANDOM_RATE = 10;

class PictureImage {

	constructor(sl) {
		const p = document.createElement('div');
		p.classList.add(CLS_PIC);
		if (sl.classList.contains(CLS_SCROLL)) {
			p.classList.add(CLS_SCROLL);
		}
		const url    = sl.dataset.img;
		const urlSub = sl.dataset.imgSub;
		if (url && urlSub) {
			p.classList.add(CLS_DUAL);
			this._insertImage(p, urlSub, sl.dataset.imgSubPhone ?? null);
			this._insertImage(p, url, sl.dataset.imgPhone ?? null);
		} else {
			this._insertImage(p, url, sl.dataset.imgPhone ?? null);
		}
		this.p = p;
	}

	_insertImage(p, url, urlPh) {
		const img = document.createElement('img');
		img.src = url;
		if (urlPh) {
			img.srcset = `${url}, ${urlPh} 600w`;
		}
		p.insertBefore(img, p.firstChild);
	}

	getElement() {
		return this.p;
	}

	transition(isCur, size) {
	}

	display(isCur) {
		if (isCur) {
			this.p.classList.add(CLS_DISPLAY);
		} else {
			this.p.classList.remove(CLS_DISPLAY);
		}
	}

	getDuration(timeDur, timeTran, doRandom) {
		if (!doRandom) return timeDur;
		return dt * (1 + 0.01 * RANDOM_RATE * (1 - Math.random() * 2));
	}

}
