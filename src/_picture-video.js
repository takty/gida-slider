/**
 *
 * Image Video
 *
 * @author Takuto Yanagida
 * @version 2021-06-24
 *
 */


const CLS_VIDEO = NS + '-video';

class PictureVideo {

	constructor(sl) {
		const p = document.createElement('div');
		p.classList.add(CLS_VIDEO);

		const v = document.createElement('video');
		v.muted = true;
		v.playsinline = true;
		v.setAttribute('muted', true);
		v.setAttribute('playsinline', true);
		v.addEventListener('loadedmetadata', () => {
			const ar = v.clientWidth / v.clientHeight;
			v.dataset.ar = (0 | (ar * 1000)) / 1000;
		});
		p.appendChild(v);

		const s = document.createElement('source');
		s.setAttribute('src', sl.dataset.video);
		v.appendChild(s);
		this.p = p;
		this.v = v;
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

}
