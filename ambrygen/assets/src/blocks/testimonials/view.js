import Swiper from 'swiper';
import { Navigation, EffectFade } from 'swiper/modules';

document.addEventListener( 'DOMContentLoaded', () => {
	const initMobileSwiper = () => {
		const container = document.querySelector( '.testimonial_slider' );
		if ( ! container ) {
			return;
		}

		const parentGrid = container.closest( '.ambry-testimonials__grid' );
		if ( ! parentGrid ) {
			return;
		}

		/* =========================
		 * DESKTOP
		 * ========================= */
		if ( window.innerWidth > 767 ) {
			// Destroy swiper if exists
			if ( container.swiper ) {
				container.swiper.destroy( true, true );
			}

			// Get all testimonial items
			const wrapper = container.querySelector(
				'.ambry-testimonials__wrapper, .swiper-wrapper'
			);
			if ( wrapper ) {
				const slides = Array.from(
					wrapper.querySelectorAll(
						'.ambry-testimonials__grid__item'
					)
				);

				// Move slides out of wrapper directly into parent grid
				slides.forEach( ( slide ) => {
					slide.classList.remove( 'swiper-slide' );
					slide.style.width = '';
					slide.style.marginRight = '';
					parentGrid.appendChild( slide );
				} );

				// Remove the container and wrapper divs
				container.remove();
			}

			return;
		}

		/* =========================
		 * MOBILE
		 * ========================= */
		if ( window.innerWidth <= 768 ) {
			// Check if swiper container already exists
			let swiperContainer = document.querySelector(
				'.testimonial_slider'
			);

			if ( ! swiperContainer ) {
				// Create swiper container
				swiperContainer = document.createElement( 'div' );
				swiperContainer.className = 'testimonial_slider swiper';

				// Create wrapper
				const swiperWrapper = document.createElement( 'div' );
				swiperWrapper.className =
					'ambry-testimonials__wrapper swiper-wrapper';

				// Get all testimonial items from grid
				const items = Array.from(
					parentGrid.querySelectorAll(
						'.ambry-testimonials__grid__item'
					)
				);

				// Move items into wrapper
				items.forEach( ( item ) => {
					item.classList.add( 'swiper-slide' );
					swiperWrapper.appendChild( item );
				} );

				swiperContainer.appendChild( swiperWrapper );
				parentGrid.appendChild( swiperContainer );
			}

			// Initialize swiper if not already initialized
			if ( ! swiperContainer.swiper ) {
				const wrapper = swiperContainer.querySelector(
					'.swiper-wrapper, .ambry-testimonials__wrapper'
				);
				const slides = wrapper.children;

				// Ensure swiper classes are present
				if ( ! wrapper.classList.contains( 'swiper-wrapper' ) ) {
					wrapper.classList.add( 'swiper-wrapper' );
				}

				Array.from( slides ).forEach( ( slide ) => {
					slide.classList.add( 'swiper-slide' );
				} );

				new Swiper( swiperContainer, {
					modules: [ Navigation, EffectFade ],
					slidesPerView: 1,
					loop: false,
					effect: 'fade',
					fadeEffect: {
						crossFade: true,
					},
					speed: 600,
					navigation: {
						nextEl: '.custom-next',
						prevEl: '.custom-prev',
					},
				} );
			}
		}
	};

	initMobileSwiper();
	window.addEventListener( 'resize', initMobileSwiper );
} );
