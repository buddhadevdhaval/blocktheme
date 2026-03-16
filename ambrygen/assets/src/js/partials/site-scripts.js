// import ResizeObserver from 'resize-observer-polyfill';
// window.ResizeObserver = ResizeObserver;

// import SimpleBar from 'simplebar';
// import 'simplebar/dist/simplebar.css';

// const simpleBars = new Map();

// const initSimpleBar = (context = document) => {
// 	context
// 		.querySelectorAll('.nav__item--mega-menu__wrapper')
// 		.forEach((el) => {
// 			if (!simpleBars.has(el)) {
// 				const instance = new SimpleBar(el, {
// 					autoHide: false,
// 				});
// 				simpleBars.set(el, instance);
// 			}
// 		});
// };

// const recalcSimpleBars = () => {
// 	simpleBars.forEach((instance) => {
// 		instance.recalculate();
// 	});
// };

// const forceRecalc = () => {
// 	setTimeout(() => {
// 		recalcSimpleBars();
// 	}, 60);
// };
// menuToggle.addEventListener('click', () => {
// 	navOverlay.classList.add('open');

// 	initSimpleBar(navOverlay);
// 	forceRecalc();
// });
// navItems.forEach((item) => {
// 	item.addEventListener('mouseenter', () => {
// 		item.classList.add('active');

// 		initSimpleBar(item);
// 		forceRecalc();
// 	});
// });submenuLinks.forEach((link) => {
// 	link.addEventListener('mouseenter', () => {
// 		forceRecalc();
// 	});
// });

(function () {
	if (!window.ambrygenAjax) {
		return;
	}

	function getCurrentPage(container) {
		let current = parseInt(container.getAttribute('data-ambrygen-current') || '1', 10);
		if (!current || current < 1) {
		const active = container.querySelector(
			'.pagination__link--active, .page-numbers.current'
		);
			if (active) {
				const text = (active.textContent || '').trim();
				if (/^\d+$/.test(text)) {
					current = parseInt(text, 10);
				}
			}
		}
		return current || 1;
	}

	function getPageFromLink(link, container) {
		if (link.dataset.ambrygenPage) {
			return parseInt(link.dataset.ambrygenPage, 10);
		}

		const href = link.getAttribute('href') || '';
		const match = href.match(/(?:query-\d+-page|paged|page)=(\d+)/);
		if (match) {
			return parseInt(match[1], 10);
		}

		const text = (link.textContent || '').trim();
		if (/^\d+$/.test(text)) {
			return parseInt(text, 10);
		}

		const ariaLabel = link.getAttribute('aria-label') || '';
		const ariaMatch = ariaLabel.match(/Page\s+(\d+)/i);
		if (ariaMatch) {
			return parseInt(ariaMatch[1], 10);
		}

		const current = getCurrentPage(container);
		if (link.classList.contains('pagination__nav--prev')) {
			return Math.max(1, current - 1);
		}
		if (link.classList.contains('pagination__nav--next')) {
			return current + 1;
		}

		return null;
	}

	function handleClick(event) {
		const link = event.target.closest(
			'.pagination__link, .pagination__nav, .page-numbers, .wp-block-query-pagination-previous, .wp-block-query-pagination-next, .wp-block-query-pagination a'
		);
		if (!link) {
			return;
		}

		const container = link.closest('.ambrygen-ajax-pagination');
		if (!container) {
			return;
		}

		event.preventDefault();
		const page = getPageFromLink(link, container);
		if (!page) {
			return;
		}

		const scope = container.getAttribute('data-ambrygen-scope') || '';

		const formData = new FormData();
		formData.append('action', 'ambrygen_conference_pagination');
		formData.append('nonce', window.ambrygenAjax.nonce);
		formData.append('scope', scope);
		formData.append('paged', page);

		container.classList.add('is-loading');

		fetch(window.ambrygenAjax.ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			body: formData,
		})
			.then((response) => response.json())
			.then((result) => {
				if (!result || !result.success || !result.data || !result.data.html) {
					return;
				}
				const content = container.querySelector('.ambrygen-ajax-pagination__content');
				if (content) {
					content.innerHTML = result.data.html;
				}
				container.setAttribute(
					'data-ambrygen-current',
					String(result.data.current || page)
				);
			})
			.catch(() => {})
			.finally(() => {
				container.classList.remove('is-loading');
			});
	}

	document.addEventListener('click', handleClick);
})();
