/**
 * Caption
 *
 * @author Takuto Yanagida
 * @version 2022-11-03
 */

class Caption {

	static CLS_CAP = NS + '-caption';

	static CLS_SUBTITLE = 'subtitle';
	static CLS_CIRCLE   = 'circle';
	static CLS_LINE     = 'line';

	static create(li) {
		const elm = li.querySelector(':scope > div, :scope > a > div');
		return elm ? new Caption(elm) : null;
	}

	#elm = null;

	constructor(elm) {
		this.#elm = elm;

		if ('' === elm.className) {
			elm.classList.add(Caption.CLS_CAP);
			elm.classList.add(Caption.CLS_SUBTITLE);
		}
		if (!elm.classList.contains(Caption.CLS_LINE) && !elm.classList.contains(Caption.CLS_CIRCLE)) {
			elm.classList.add(Caption.CLS_SUBTITLE);
		}
		if (elm.classList.contains(Caption.CLS_LINE))     elm.dataset.caption = Caption.CLS_LINE;
		if (elm.classList.contains(Caption.CLS_CIRCLE))   elm.dataset.caption = Caption.CLS_CIRCLE;
		if (elm.classList.contains(Caption.CLS_SUBTITLE)) elm.dataset.caption = Caption.CLS_SUBTITLE;

		const ds = elm.querySelectorAll(':scope > div');
		for (const d of ds) this.#wrapText(d);
		this.#wrapText(elm);
		this.#wrapDiv(elm);
	}

	#wrapText(elm) {
		for (const n of Array.from(elm.childNodes)) {
			if (3 === n.nodeType) {  // TEXT_NODE
				const str = n.nodeValue.trim();
				if ('' !== str) {
					const e = document.createElement('span');
					e.appendChild(document.createTextNode(str));
					n.parentNode.replaceChild(e, n);
				}
			}
		}
	}

	#wrapDiv(elm) {
		const tags = [];
		for (const n of Array.from(elm.childNodes)) {
			if (1 === n.nodeType) {  // ELEMENT_NODE
				if ('DIV' === n.tagName) {
					if (tags.length) {
						const e = document.createElement('div');
						for (const t of tags) e.appendChild(elm.removeChild(t));
						elm.insertBefore(e, n);
						tags.length = 0;
					}
				} else {
					tags.push(n);
				}
			}
		}
		if (tags.length) {
			const e = document.createElement('div');
			for (const t of tags) e.appendChild(elm.removeChild(t));
			elm.appendChild(e);
		}
	}

	getElement() {
		return this.#elm;
	}

	onResize() {
		if (window.innerWidth < 600) {
			this.#elm.classList.remove(this.#elm.dataset.caption);
			this.#elm.classList.add(Caption.CLS_SUBTITLE);
		} else {
			this.#elm.classList.remove(Caption.CLS_SUBTITLE);
			this.#elm.classList.add(this.#elm.dataset.caption);
		}
	}

}