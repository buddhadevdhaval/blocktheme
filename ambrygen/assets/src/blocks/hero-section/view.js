/**
 * Hero Section Slider Functionality
 *
 * Handles slider navigation, autoplay, and touch gestures using Swiper.js.
 */

import Swiper from 'swiper/bundle';

document.addEventListener( 'DOMContentLoaded', () => {
	const sliders = document.querySelectorAll( '.hero-section__slider.swiper' );

	sliders.forEach( ( sliderElement ) => {
		// Parse configuration from data attribute
		const configAttr = sliderElement.getAttribute( 'data-swiper-config' );
		let config = {};

		try {
			config = configAttr ? JSON.parse( configAttr ) : {};
		} catch ( e ) {
			// eslint-disable-next-line no-console
			console.error( 'Failed to parse Swiper config:', e );
		}

		const swiperOptions = {
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			loop: true,
			speed: 800,
			autoplay: config.autoplay || false,
			navigation: config.navigation
				? {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev',
				  }
				: false,
			pagination: config.pagination
				? {
						el: '.swiper-pagination',
						clickable: true,
						bulletClass: 'hero-section__dot',
						bulletActiveClass: 'active',
						renderBullet( index, className ) {
							return (
								'<button class="' +
								className +
								'" aria-label="Go to slide ' +
								( index + 1 ) +
								'"></button>'
							);
						},
				  }
				: false,
			on: {
				init() {
					sliderElement.classList.add( 'is-initialized' );
				},
			},
		};

		// Initialize Swiper
		new Swiper( sliderElement, swiperOptions );
	} );
} );
