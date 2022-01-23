/**
 * Image Video
 *
 * @author Takuto Yanagida
 * @version 2021-08-25
 */


const CLS_VIDEO = NS + '-video';

class PictureVideo {

	constructor(sl) {
		const p = document.createElement('div');
		p.classList.add(CLS_VIDEO);

		const vs = sl.querySelectorAll(':scope > video, :scope > a > video');
		if (1 === vs.length) {
			const v = vs[0];
			this._initializeVideo(v);
			this.v = p.appendChild(v);
		} else if (sl.dataset.video) {
			const v = document.createElement('video');
			this._initializeVideo(v);
			this.v = p.appendChild(v);

			const s = document.createElement('source');
			s.setAttribute('src', sl.dataset.video);
			v.appendChild(s);
		}
		this.p = p;
	}

	_initializeVideo(v) {
		v.muted = true;
		v.playsinline = true;
		v.setAttribute('muted', true);
		v.setAttribute('playsinline', true);
		v.addEventListener('loadedmetadata', () => {
			const ar = v.clientWidth / v.clientHeight;
			this.ar = (0 | (ar * 1000)) / 1000;
		});
	}

	getElement() {
		return this.p;
	}

	transition(isCur, size) {
		if (isCur) {
			this.v.setAttribute('autoplay', true);
			this.v.play();
			if (size === 1) this.v.setAttribute('loop', true);
		}
	}

	display(isCur) {
		if (!isCur) {
			this.v.pause();
			this.v.currentTime = 0;
		}
	}

	getDuration(timeDur, timeTran, doRandom) {
		return this.v.duration - timeTran;
	}

	onResize() {
		if (!this.ar) return false;
		const arFrame = this.p.clientWidth / this.p.clientHeight;
		if (this.ar < arFrame) {
			this.v.classList.remove('height');
			this.v.classList.add('width');
		} else {
			this.v.classList.remove('width');
			this.v.classList.add('height');
		}
		return true;
	}

}
