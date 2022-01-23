/**
 * Captions
 *
 * @author Takuto Yanagida
 * @version 2021-08-25
 */


const CLS_CAP = NS + '-caption';

const caps = [];

function createCaption(sl, time) {
	const c = sl.querySelector(':scope > div, :scope > a > div');
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
		_wrapDiv(c);
	}
	caps.push(c);
}

function _wrapText(c) {
	for (let i = 0; i < c.childNodes.length; i += 1) {
		const cs = c.childNodes[i];
		if (cs.nodeType === 3/*TEXT_NODE*/) {
			const str = cs.nodeValue.trim();
			if (str === '') continue;
			const span = document.createElement('span');
			span.appendChild(document.createTextNode(str));
			cs.parentNode.replaceChild(span, cs);
		}
	}
}

function _wrapDiv(c) {
	let tags = [];
	const css = Array.from(c.childNodes);
	for (let cs of css) {
		if (cs.nodeType === 1/*ELEMENT_NODE*/) {
			if (cs.tagName === 'DIV') {
				if (tags.length) {
					const div = document.createElement('div');
					for (const t of tags) div.appendChild(c.removeChild(t));
					c.insertBefore(div, cs);
					tags.length = 0;
				}
			} else {
				tags.push(cs);
			}
		}
	}
	if (tags.length) {
		const div = document.createElement('div');
		for (const t of tags) div.appendChild(c.removeChild(t));
		c.appendChild(div);
	}
}

function onResizeCaption() {
	if (window.innerWidth < 600) {
		for (const c of caps) {
			if (!c) continue;
			c.classList.remove(c.dataset.caption);
			c.classList.add('subtitle');
		}
	} else {
		for (const c of caps) {
			if (!c) continue;
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