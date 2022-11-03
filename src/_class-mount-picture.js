/**
 * Mount Picture
 *
 * @author Takuto Yanagida
 * @version 2022-11-03
 */

class MountPicture {

	static CLS_PIC  = NS + '-picture';
	static CLS_DUAL = 'dual';

	static RANDOM_RATE = 10;

	#elm = null;

	constructor(li) {
		this.#elm = document.createElement('div');
		this.#elm.classList.add(MountPicture.CLS_PIC);

		const is = li.querySelectorAll(':scope > img, :scope > a > img');
		if (is.length) {
			this.#elm.appendChild(is[0]);
			if (1 < is.length) {
				this.#elm.classList.add(MountPicture.CLS_DUAL);
				this.#elm.appendChild(is[1]);
			}
		} else if (li.dataset.img) {
			const i = this.#createImage(li, { src: 'img', srcset: 'imgSrcset', sizes: 'imgSizes' });
			this.#elm.appendChild(i);
			if (li.dataset.imgSub) {
				this.#elm.classList.add(MountPicture.CLS_DUAL);
				const i = this.#createImage(li, { src: 'imgSub', srcset: 'imgSubSrcset', sizes: 'imgSubSizes' });
				this.#elm.appendChild(i);
			}
		}
	}

	#createImage(li, keys) {
		const i = document.createElement('img');
		i.src = li.dataset[keys.src];

		const srcset = li.dataset[keys.srcset] ?? null;
		const sizes  = li.dataset[keys.sizes]  ?? null;
		if (srcset) i.srcset = srcset;
		if (sizes)  i.sizes  = sizes;
		return i;
	}

	getElement() {
		return this.#elm;
	}

	transition(isCur, size) {
	}

	display(isCur) {
	}

	getDuration(timeDur, timeTran, doRandom) {
		if (doRandom) {
			const f = (1 + 0.01 * MountPicture.RANDOM_RATE * (1 - Math.random() * 2));
			return timeDur * f;
		}
		return timeDur;
	}

}
