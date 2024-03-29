/**
 * Scroll Transition
 *
 * @author Takuto Yanagida
 * @version 2022-11-02
 */


class TransitionScroll {

	constructor(size, slides, tranTime) {
		this._size = size;
		this._lis  = slides;
		this._time = tranTime;

		this._cur    = 0;
		this._curPsd = 0;
		this._doing  = false;
		this._queue  = [];

		const ps = this._calcPosition(0, 1);
		for (let i = 0; i < this._lis.length; i += 1) {
			this._lis[i].style.opacity   = 1;
			this._lis[i].style.transform = `translateX(${ps[i] * 100}%)`;
		}
	}

	async transition(idx, dir) {
		this._queue.push((cur, curPsd) => this._doTransition(cur, curPsd, idx, dir));
		if (this._doing) return;
		this._doing = true;
		while (this._queue.length) {
			[this._cur, this._curPsd] = await this._queue.shift()(this._cur, this._curPsd);
		}
		this._doing = false;
	}

	async _doTransition(curIdx, curIdxPsd, idx, dir) {
		if (0 === dir && curIdx !== idx) {
			const r = (curIdx < idx) ? idx - curIdx : idx + this._size - curIdx;
			const l = (idx < curIdx) ? curIdx - idx : curIdx + this._size - idx;
			dir = (l < r) ? -1 : 1;
		}
		let ps = this._calcPosition(curIdxPsd, dir);
		for (let i = 0; i < this._lis.length; i += 1) {
			this._lis[i].style.transition = '';
			this._lis[i].style.transform  = `translateX(${ps[i] * 100}%)`;
		}
		await asyncTimeout(100).set();  // Wait

		let d = 0;
		if (dir ===  1) d = idx - curIdx;
		if (dir === -1) d = curIdx - idx;
		if (d < 0) d += this._size;

		let idxPsd = curIdxPsd;
		for (let i = 0; i < d; i += 1) {
			[ps, idxPsd] = this._shift(ps, idxPsd, dir, this._time / d, this._getTransition(d, i));
			await asyncTimeout(Math.floor(this._time * 1000 / d)).set();
		}
		return [idx, idxPsd];
	}

	_getTransition(d, i) {
		if (d === 1) return 'ease';
		if (d === 2) {
			if (i === 0) return 'ease-in';
			if (i === 1) return 'ease-out';
		}
		return 'linear';
	}

	_shift(curPs, curIdxPsd, dir, time, tf = 'ease') {
		const lenPsd = this._lis.length;

		let idxPsd = curIdxPsd + dir;
		if (lenPsd - 1 < idxPsd) idxPsd = 0;
		if (idxPsd < 0) idxPsd = lenPsd - 1;

		const ps = this._calcPosition(idxPsd, dir);

		for (let i = 0; i < lenPsd; i += 1) {
			const t = (Math.abs(curPs[i] - ps[i]) === 1) ? `transform ${time}s ${tf}` : '';
			this._lis[i].style.transition = t;
			this._lis[i].style.transform  = `translateX(${ps[i] * 100}%)`;
		}
		return [ps, idxPsd];
	}

	_calcPosition(idxPsd, dir) {
		const lenPsd = this._lis.length;
		const ps     = new Array(lenPsd);

		const hs = (dir !== -1) ? Math.ceil((lenPsd - 1) / 2) : Math.floor((lenPsd - 1) / 2);
		const rs = lenPsd - 1 - hs;

		for (let i = 1; i <= hs; i += 1) {
			let j = idxPsd + i;
			if (lenPsd - 1 < j) j -= lenPsd;
			ps[j] = i;
		}
		for (let i = 1; i <= rs; i += 1) {
			let j = idxPsd - i;
			if (j < 0) j += lenPsd;
			ps[j] = -i;
		}
		ps[idxPsd] = 0;
		return ps;
	}

}
