import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

document.addEventListener('DOMContentLoaded', () => {
	const initMobileSwiper = () => {
		const container = document.querySelector('.ambry-testimonials.testimonials-slider');
		if (!container) return;

		// Wrapper can be swiper-wrapper OR normal wrapper
		const wrapper =
			container.querySelector('.swiper-wrapper') ||
			container.querySelector('.ambry-testimonials__wrapper');

		if (!wrapper) return;

		const slides = wrapper.children;

		const nextEl = container.querySelector('.swiper-button-next');
		const prevEl = container.querySelector('.swiper-button-prev');

		/* =========================
		 * DESKTOP
		 * ========================= */
		if (window.innerWidth > 767) {
			if (container.swiper) {
				container.swiper.destroy(true, true);
			}

			container.classList.remove(
				'swiper-initialized',
				'swiper-horizontal',
				'swiper-backface-hidden'
			);

			// 🔴 REMOVE swiper-wrapper
			if (wrapper.classList.contains('swiper-wrapper')) {
				wrapper.classList.remove('swiper-wrapper');
				wrapper.classList.add('ambry-testimonials__wrapper');
			}

			// Remove swiper-slide
			Array.from(slides).forEach((slide) => {
				slide.classList.remove('swiper-slide');
				slide.style.width = '';
				slide.style.marginRight = '';
			});

			wrapper.style.transform = '';
			wrapper.style.transition = '';

			return;
		}

		/* =========================
		 * MOBILE
		 * ========================= */
		if (window.innerWidth <= 767 && !container.swiper) {
			// 🟢 ADD swiper-wrapper back
			if (!wrapper.classList.contains('swiper-wrapper')) {
				wrapper.classList.remove('ambry-testimonials__wrapper');
				wrapper.classList.add('swiper-wrapper');
			}

			// Add swiper-slide
			Array.from(slides).forEach((slide) => {
				slide.classList.add('swiper-slide');
			});

			new Swiper(container, {
				modules: [Navigation],
				slidesPerView: 1,
				spaceBetween: 16,
				loop: false,
				navigation: {
					nextEl,
					prevEl,
				},
			});
		}
	};

	initMobileSwiper();
	window.addEventListener('resize', initMobileSwiper);
});
