/**
 *
 * Scroll Transition
 *
 * @author Takuto Yanagida
 * @version 2021-06-25
 *
 */


class TransitionScroll {

	constructor(size, slides, tranTime) {
		this._size      = size;
		this._sls       = slides;
		this._time      = tranTime;
		this._curIdx    = 0;
		this._curIdxPsd = 0;
		this._curPos    = this._calcPosition(0, 1);

		for (let i = 0; i < this._sls.length; i += 1) {
			this._sls[i].style.opacity = 1;
			this._sls[i].style.transform = `translateX(${this._curPos[i] * 100}%)`;
		}
	}

	async transition(idx, dir) {
		this._curPos = this._calcPosition(this._curIdxPsd, dir);
		for (let i = 0; i < this._sls.length; i += 1) {
			this._sls[i].style.transition = '';
			this._sls[i].style.transform  = 'translateX(' + 100 * this._curPos[i] + '%)';
		}
		await asyncTimeout(10).set();  // Wait

		let d = 0;
		if (dir ===  1) d = idx - this._curIdx;
		if (dir === -1) d = this._curIdx - idx;
		if (d < 0) d += this._size;

		for (let i = 0; i < d; i += 1) {
			this._curPos = this.shift(this._curPos, dir, this._time / d);
			await asyncTimeout(Math.floor(this._time * 1000 / d)).set();
		}
		this._curIdx = idx;
	}

	shift(curPos, dir, time) {
		this._curIdxPsd += dir;
		if (this._sls.length - 1 < this._curIdxPsd) this._curIdxPsd = 0;
		if (this._curIdxPsd < 0) this._curIdxPsd = this._sls.length - 1;

		const pos = this._calcPosition(this._curIdxPsd, dir);

		for (let i = 0; i < this._sls.length; i += 1) {
			const t = (Math.abs(curPos[i] - pos[i]) === 1) ? `transform ${time}s` : '';
			this._sls[i].style.transition = t;
			this._sls[i].style.transform  = `translateX(${100 * pos[i]}%)`;
		}
		return pos;
	}

	_calcPosition(idxPsd, dir) {
		const sizePsd = this._sls.length;
		const pos = new Array(sizePsd);
		pos[idxPsd] = 0;
		const hs = (dir !== -1) ? Math.ceil((sizePsd - 1) / 2) : Math.floor((sizePsd - 1) / 2);
		const rs = sizePsd - 1 - hs;
		for (let i = 1; i <= hs; i += 1) {
			let j = idxPsd + i;
			if (sizePsd - 1 < j) j -= sizePsd;
			pos[j] = i;
		}
		for (let i = 1; i <= rs; i += 1) {
			let j = idxPsd - i;
			if (j < 0) j += sizePsd;
			pos[j] = -i;
		}
		return pos;
	}

}
