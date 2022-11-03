/**
 * Slide
 *
 * @author Takuto Yanagida
 * @version 2022-11-03
 */

class Slide {

	static CLS_SCROLL      = 'scroll';
	static CLS_PRE_DISPLAY = 'pre-display';
	static CLS_DISPLAY     = 'display';

	#idx  = 0;
	#cap  = null;
	#mnt  = null;
	#type = '';

	constructor(li, idx, useCaption = true) {
		this.#idx = idx;
		this.#cap = useCaption ? Caption.create(li) : null;

		if (this.#isVideo(li)) {
			this.#mnt  = new MountVideo(li);
			this.#type = 'video';
		} else {
			this.#mnt  = new MountPicture(li);
			this.#type = 'image';
		}
		if (li.classList.contains(Slide.CLS_SCROLL)) {
			this.#mnt.getElement().classList.add(Slide.CLS_SCROLL);
		}
		li.insertBefore(this.#mnt.getElement(), li.firstChild);
		const e = li.querySelector('a') ?? li;
		e.insertBefore(this.#mnt.getElement(), e.firstChild);
	}

	getType() {
		return this.#type;
	}

	#isVideo(li) {
		if (li.dataset.video) return true;
		const v = li.querySelector(':scope > video, :scope > a > video');
		return null !== v;
	}

	onResize() {
		if ('video' === this.#type && !this.#mnt.onResize()) return false;
		if (this.#cap) this.#cap.onResize();
		return true;
	}

	onPreDisplay(cur, size) {
		const m = ((this.#idx % size) === cur) ? 'add' : 'remove';
		this.#mnt.getElement().classList[m](Slide.CLS_PRE_DISPLAY);
		if (this.#cap) this.#cap.getElement().classList[m](Slide.CLS_PRE_DISPLAY);
	}

	transition(cur, size) {
		this.#mnt.transition((this.#idx % size) === cur, size);
	}

	display(cur, size) {
		const m = ((this.#idx % size) === cur) ? 'add' : 'remove';
		this.#mnt.getElement().classList[m](Slide.CLS_DISPLAY);
		if (this.#cap) this.#cap.getElement().classList[m](Slide.CLS_DISPLAY);

		this.#mnt.display((this.#idx % size) === cur);
	}

	getDuration(timeDur, timeTran, randomTiming) {
		return this.#mnt.getDuration(timeDur, timeTran, randomTiming);
	}

}