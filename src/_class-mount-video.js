/**
 * Mount Video
 *
 * @author Takuto Yanagida
 * @version 2022-11-03
 */

class MountVideo {

	static CLS_VIDEO = NS + '-video';

	#elm   = null;
	#video = null;
	#ar    = null;

	constructor(li) {
		this.#elm = document.createElement('div');
		this.#elm.classList.add(MountVideo.CLS_VIDEO);

		const vs = li.querySelectorAll(':scope > video, :scope > a > video');
		if (1 === vs.length) {
			const v = vs[0];
			this.#initialize(v);
			this.#elm.appendChild(v);
			this.#video = v;
		} else if (li.dataset.video) {
			const v = this.#createVideo(li);
			this.#initialize(v);
			this.#elm.appendChild(v);
			this.#video = v;
		}
	}

	#createVideo(li) {
		const v = document.createElement('video');
		const s = document.createElement('source');
		s.setAttribute('src', li.dataset.video);
		v.appendChild(s);
		return v;
	}

	#initialize(v) {
		v.muted = true;
		v.playsinline = true;
		v.setAttribute('muted', true);
		v.setAttribute('playsinline', true);
		v.addEventListener('loadedmetadata', () => {
			const ar = v.clientWidth / v.clientHeight;
			this.#ar = (0 | (ar * 1000)) / 1000;
		});
	}

	getElement() {
		return this.#elm;
	}

	transition(isCur, size) {
		if (isCur) {
			this.#video.setAttribute('autoplay', true);
			this.#video.play();
			if (size === 1) this.#video.setAttribute('loop', true);
		}
	}

	display(isCur) {
		if (!isCur) {
			this.#video.pause();
			this.#video.currentTime = 0;
		}
	}

	getDuration(timeDur, timeTran, doRandom) {
		return this.#video.duration - timeTran;
	}

	onResize() {
		if (!this.#ar) return false;
		const arFrame = this.#elm.clientWidth / this.#elm.clientHeight;
		if (this.#ar < arFrame) {
			this.#video.classList.remove('height');
			this.#video.classList.add('width');
		} else {
			this.#video.classList.remove('width');
			this.#video.classList.add('height');
		}
		return true;
	}

}
