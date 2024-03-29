/**
 * Rivets
 *
 * @author Takuto Yanagida
 * @version 2021-06-24
 */


const CLS_RIVETS = NS + '-rivets';
const CLS_RIVET  = NS + '-rivet';

const rivets = [];

function initRivets(size, root, transitionFn) {
	if (size === 1) return;
	const rs = root.getElementsByClassName(CLS_RIVETS)[0];
	if (!rs) return;
	const dir = size === 2 ? 1 : 0;

	for (let i = 0; i < size; i += 1) {
		const idx = i;
		const r = document.createElement('span');
		r.id = id + '-rivet-' + idx;
		r.className = CLS_RIVET;
		r.addEventListener('click', () => { transitionFn(idx, dir); });
		rs.appendChild(r);
		rivets.push(r);
	}
}

function transitionRivets(idx) {
	for (const r of rivets) r.classList.remove(CLS_VISIBLE);
	if (rivets[idx]) rivets[idx].classList.add(CLS_VISIBLE);
}
