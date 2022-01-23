/**
 * Fade Transition
 *
 * @author Takuto Yanagida
 * @version 2021-06-25
 */


class TransitionFade {

	constructor(size, slides, tranTime) {
		this._size = size;
		this._sls  = slides;
		this._time = tranTime;

		for (let i = 0; i < this._size; i += 1) {
			this._sls[i].style.opacity = (i === 0) ? 1 : 0;
		}
		setTimeout(() => {
			for (let i = 0; i < this._size; i += 1) {
				this._sls[i].style.transition = 'opacity ' + this._time + 's';
			}
		}, 10);
	}

	async transition(idx, dir) {
		for (let i = 0; i < this._size; i += 1) {
			this._sls[i].style.opacity = (i === idx) ? 1 : 0;
			this._sls[i].style.pointerEvents = (i === idx) ? 'auto' : 'none';
		}
		await asyncTimeout(this._time * 1000).set();
	}
}
