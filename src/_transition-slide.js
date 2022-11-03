/**
 * Slide Transition
 *
 * @author Takuto Yanagida
 * @version 2021-06-25
 */


class TransitionSlide {

	constructor(size, slides, tranTime) {
		this._size = size;
		this._lis  = slides;
		this._time = tranTime;

		for (let i = 0; i < this._size; i += 1) {
			this._lis[i].style.transform = 'translateX(' + (i ? 100 : 0) + '%)';
		}
		setTimeout(() => {
			for (let i = 0; i < this._size; i += 1) {
				this._lis[i].style.opacity = 1;
				this._lis[i].style.transition = 'transform ' + this._time + 's';
			}
		}, 10);
	}

	async transition(idx, dir) {
		for (let i = 0; i < this._size; i += 1) {
			this._lis[i].style.transform = (i <= idx) ? 'translateX(0%)' : 'translateX(100%)';
		}
		await asyncTimeout(this._time * 1000).set();
	}

}
