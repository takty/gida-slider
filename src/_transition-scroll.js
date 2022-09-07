/**
 * Scroll Transition
 *
 * @author Takuto Yanagida
 * @version 2022-09-07
 */


class TransitionScroll {

	constructor(size, slides, tranTime) {
		this._size = size;
		this._sls  = slides;
		this._time = tranTime;

		this._cur   = 0;
		this._doing = false;
		this._queue = [];

		const ps = this._calcPosition(0, 1);
		for (let i = 0; i < this._sls.length; i += 1) {
			this._sls[i].style.opacity   = 1;
			this._sls[i].style.transform = `translateX(${ps[i] * 100}%)`;
		}
	}

	async transition(idx, dir) {
		this._queue.push(cur => this._doTransition(cur, idx, dir));
		if (this._doing) return;
		this._doing = true;
		while (this._queue.length) {
			this._cur = await this._queue.shift()(this._cur);
		}
		this._doing = false;
	}

	async _doTransition(curIdx, newIdx, dir) {
		if (0 === dir) {
			const r = (curIdx < newIdx) ? newIdx - curIdx : newIdx + this._size - curIdx;
			const l = (newIdx < curIdx) ? curIdx - newIdx : curIdx + this._size - newIdx;
			dir = (l < r) ? -1 : 1;
		}
		const ps = this._calcPosition(curIdx, dir);
		for (let i = 0; i < this._sls.length; i += 1) {
			this._sls[i].style.transition = '';
			this._sls[i].style.transform  = `translateX(${ps[i] * 100}%)`;
		}
		await asyncTimeout(10).set();  // Wait

		let d = 0;
		if (dir ===  1) d = newIdx - curIdx;
		if (dir === -1) d = curIdx - newIdx;
		if (d < 0) d += this._size;

		let curPs = ps;
		for (let i = 0; i < d; i += 1) {
			const tf = (d === 1) ? 'ease' : ((i === 0) ? 'ease-in' : ((i === d - 1) ? 'ease-out' : 'linear'));
			[curPs, curIdx] = this._shift(curPs, curIdx, dir, this._time / d, tf);
			await asyncTimeout(Math.floor(this._time * 1000 / d)).set();
		}
		return curIdx;
	}

	_shift(curPs, curIdx, dir, time, tf = 'ease') {
		const len = this._sls.length;

		let newIdx = curIdx + dir;
		if (len - 1 < newIdx) newIdx = 0;
		if (newIdx < 0) newIdx = len - 1;

		const newPs = this._calcPosition(newIdx, dir);

		for (let i = 0; i < len; i += 1) {
			const t = (Math.abs(curPs[i] - newPs[i]) === 1) ? `transform ${time}s ${tf}` : '';
			this._sls[i].style.transition = t;
			this._sls[i].style.transform  = `translateX(${newPs[i] * 100}%)`;
		}
		return [newPs, newIdx];
	}

	_calcPosition(idx, dir) {
		const len = this._sls.length;
		const ps  = new Array(len);
		ps[idx] = 0;

		const hs = (dir !== -1) ? Math.ceil((len - 1) / 2) : Math.floor((len - 1) / 2);
		const rs = len - 1 - hs;
		for (let i = 1; i <= hs; i += 1) {
			let j = idx + i;
			if (len - 1 < j) j -= len;
			ps[j] = i;
		}
		for (let i = 1; i <= rs; i += 1) {
			let j = idx - i;
			if (j < 0) j += len;
			ps[j] = -i;
		}
		return ps;
	}

}
