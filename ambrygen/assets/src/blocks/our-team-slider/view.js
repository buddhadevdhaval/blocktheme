import Swiper from 'swiper/bundle';

document.addEventListener('DOMContentLoaded', () => {
	const sliders = document.querySelectorAll('.our-leadership-slider');

	sliders.forEach((sliderElement) => {
		let config = {};
		const configAttr = sliderElement.getAttribute('data-swiper-config');

		if (configAttr) {
			try {
				config = JSON.parse(configAttr);
			} catch (error) { }
		}

		const nextEl = sliderElement.querySelector('.custom-next');
		const prevEl = sliderElement.querySelector('.custom-prev');
		const paginationEl =
			sliderElement.querySelector('.swiper-pagination');
		const autoplayConfig = config.autoplay
			? {
				delay: 3000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			}
			: false;

		new Swiper(sliderElement, {
			slidesPerView: 1.4,
			spaceBetween: 20,
			loop: true,
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},

			navigation:
				config.navigation_show === false
					? false
					: {
						nextEl,
						prevEl,
					},
			pagination: paginationEl
				? {
					el: paginationEl,
					clickable: true,
				}
				: false,
			autoplay: autoplayConfig,

			breakpoints: {
				576: { slidesPerView: 2.5 },
				991: { slidesPerView: 3.5 },
				1200: {
					slidesPerView: 4.4,
					spaceBetween: 32,
				},
			},

			on: {
				init() {
					sliderElement.classList.add('is-initialized');
				},
			},

			...config,
		});
	});

	// ── Offcanvas Logic ──────────────────────────────────
	const leadershipBlocks = document.querySelectorAll('.our-leadership');

	leadershipBlocks.forEach((block) => {
		const cards = block.querySelectorAll('.our-leadership__card');
		const offcanvas = block.querySelector('.offcanvas-sidebar');

		if (!offcanvas || !cards.length) {
			return;
		}

		const closeBtn = offcanvas.querySelector('.offcanvas-sidebar__close');
		const nameEl = offcanvas.querySelector('.our-team-offcanvas__name');
		const roleEl = offcanvas.querySelector('.our-team-offcanvas__role');
		const imageEl = offcanvas.querySelector('.our-team-offcanvas__image');
		const bioEl = offcanvas.querySelector('.our-team-offcanvas__bio');
		const panel = offcanvas.querySelector('.offcanvas-sidebar__panel');

		if (
			!panel ||
			!closeBtn ||
			!nameEl ||
			!roleEl ||
			!imageEl ||
			!bioEl
		) {
			return;
		}

		let lastFocusedElement = null;

		function openOffcanvas(card) {
			lastFocusedElement = card;

			const name = card.getAttribute('data-team-name') || '';
			const designation =
				card.getAttribute('data-team-designation') || '';
			const imageSrc = card.getAttribute('data-team-image') || '';
			const bioTemplate = card.querySelector('.our-team__bio-template');

			nameEl.textContent = name;
			roleEl.textContent = designation;
			imageEl.src = imageSrc;
			imageEl.alt = name;

			if (bioTemplate) {
				bioEl.replaceChildren(bioTemplate.content.cloneNode(true));
			} else {
				bioEl.textContent = '';
			}

			offcanvas.classList.add('is-active');
			offcanvas.setAttribute('aria-hidden', 'false');
			document.body.classList.add('offcanvas-sidebar-open');

			setTimeout(() => {
				closeBtn.focus();
			}, 100);
		}

		function closeOffcanvas() {
			offcanvas.classList.remove('is-active');
			offcanvas.setAttribute('aria-hidden', 'true');
			document.body.classList.remove('offcanvas-sidebar-open');

			if (lastFocusedElement) {
				lastFocusedElement.focus();
				lastFocusedElement = null;
			}
		}

		cards.forEach((card) => {
			card.addEventListener('click', () => {
				openOffcanvas(card);
			});

			card.addEventListener('keydown', (event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					openOffcanvas(card);
				}
			});
		});

		if (closeBtn) {
			closeBtn.addEventListener('click', closeOffcanvas);
		}

		const overlay = offcanvas.querySelector(
			'.offcanvas-sidebar__overlay'
		);

		if (overlay) {
			overlay.addEventListener('click', closeOffcanvas);
		}

		document.addEventListener('keydown', (e) => {
			if (
				e.key === 'Escape' &&
				offcanvas.classList.contains('is-active')
			) {
				closeOffcanvas();
			}
		});

		panel.addEventListener('keydown', (e) => {
			if (e.key !== 'Tab') {
				return;
			}

			const { ownerDocument } = panel;
			const focusableElements = panel.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);

			if (!focusableElements.length) {
				return;
			}

			const firstFocusable = focusableElements[0];
			const lastFocusable =
				focusableElements[focusableElements.length - 1];

			if (e.shiftKey) {
				if (ownerDocument.activeElement === firstFocusable) {
					e.preventDefault();
					lastFocusable.focus();
				}
			} else if (ownerDocument.activeElement === lastFocusable) {
				e.preventDefault();
				firstFocusable.focus();
			}
		});
	});
});
