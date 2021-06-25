/**
 *
 * Captions
 *
 * @author Takuto Yanagida
 * @version 2021-06-24
 *
 */


const CLS_CAP = NS + '-caption';

const caps = [];

function createCaption(sl, time) {
	const c = sl.querySelector(':scope > div');
	if (c) {
		c.style.transitionDuration = time + 's';
		if (c.className === '') {
			c.classList.add(CLS_CAP);
			c.classList.add('subtitle');
		}
		if (!c.classList.contains('line') && !c.classList.contains('circle')) c.classList.add('subtitle');
		if (c.classList.contains('line'))     c.dataset.caption = 'line';
		if (c.classList.contains('circle'))   c.dataset.caption = 'circle';
		if (c.classList.contains('subtitle')) c.dataset.caption = 'subtitle';

		const ds = c.querySelectorAll(':scope > div');
		for (const d of ds) _wrapText(d);
		_wrapText(c);

		const ss = c.querySelectorAll(':scope > span');
		if (0 < ss.length) {
			const div = document.createElement('div');
			for (const s of ss) div.appendChild(c.removeChild(s));
			c.appendChild(div);
		}
	}
	caps.push(c);
}

function _wrapText(c) {
	for (let i = 0; i < c.childNodes.length; i += 1) {
		const cs = c.childNodes[i];
		if (cs.nodeType === 3/*TEXT_NODE*/) {
			if (cs.nodeValue.trim() === '') continue;
			const span = document.createElement('span');
			span.appendChild(document.createTextNode(cs.nodeValue));
			cs.parentNode.replaceChild(span, cs);
		}
	}
}

function onResizeCaption() {
	if (window.innerWidth < 600) {
		for (const c of caps) {
			c.classList.remove(c.dataset.caption);
			c.classList.add('subtitle');
		}
	} else {
		for (const c of caps) {
			c.classList.remove('subtitle');
			c.classList.add(c.dataset.caption);
		}
	}
}

function displayCaption(idx, size) {
	for (let i = 0; i < caps.length; i += 1) {
		if (!caps[i]) continue;
		if ((i % size) === idx) caps[i].classList.add(CLS_DISPLAY);
		else caps[i].classList.remove(CLS_DISPLAY);
	}
}
