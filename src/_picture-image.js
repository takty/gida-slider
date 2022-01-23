/**
 * Image Picture
 *
 * @author Takuto Yanagida
 * @version 2021-08-25
 */


const CLS_PIC    = NS + '-picture';
const CLS_DUAL   = 'dual';
const CLS_SCROLL = 'scroll';

const RANDOM_RATE = 10;

class PictureImage {

	constructor(sl) {
		const p = document.createElement('div');
		p.classList.add(CLS_PIC);
		if (sl.classList.contains(CLS_SCROLL)) p.classList.add(CLS_SCROLL);

		const imgs = sl.querySelectorAll(':scope > img, :scope > a > img');
		if (imgs.length) {
			p.appendChild(imgs[0]);
			if (1 < imgs.length) {
				p.classList.add(CLS_DUAL);
				p.appendChild(imgs[1]);
			}
		} else if (sl.dataset.img) {
			p.appendChild(this._createImage(sl.dataset.img, sl.dataset.imgSrcset ?? null, sl.dataset.imgSizes ?? null));
			if (sl.dataset.imgSub) {
				p.classList.add(CLS_DUAL);
				p.appendChild(this._createImage(sl.dataset.imgSub, sl.dataset.imgSubSrcset ?? null, sl.dataset.imgSubSizes ?? null));
			}
		}
		this.p = p;
	}

	_createImage(src, srcset, sizes) {
		const img = document.createElement('img');
		img.src = src;
		if (srcset) img.srcset = srcset;
		if (sizes)  img.sizes  = sizes;
		return img;
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
