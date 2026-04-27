/**
 * Hero Section Slider Functionality
 *
 * Handles slider navigation, autoplay, and touch gestures using Swiper.js.
 */

import Swiper from 'swiper/bundle';
import { __, sprintf } from '@wordpress/i18n';

document.addEventListener( 'DOMContentLoaded', () => {
	const sliders = document.querySelectorAll( '.hero-section__slider.swiper' );

	sliders.forEach( ( sliderElement ) => {
		if ( sliderElement.classList.contains( 'is-initialized' ) ) {
			return;
		}

		const configAttr = sliderElement.getAttribute( 'data-swiper-config' );
		let config = {};

		try {
			config = configAttr ? JSON.parse( configAttr ) : {};
		} catch {
			config = {};
		}

		const nextEl = sliderElement.querySelector( '.custom-next' );
		const prevEl = sliderElement.querySelector( '.custom-prev' );
		const paginationEl =
			sliderElement.querySelector( '.swiper-pagination' );

		const swiperOptions = {
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			loop: sliderElement.querySelectorAll( '.swiper-slide' ).length > 1,
			speed: 800,
			autoplay: config.autoplay || false,
			navigation:
				config.navigation && nextEl && prevEl
					? {
							nextEl,
							prevEl,
					  }
					: false,
			pagination:
				config.pagination && paginationEl
					? {
							el: paginationEl,
							clickable: true,
							bulletClass: 'hero-section__dot',
							bulletActiveClass: 'active',
							renderBullet( index, className ) {
								const bullet =
									document.createElement( 'button' );

								bullet.className = className;
								bullet.setAttribute(
									'aria-label',
									sprintf(
										/* translators: %d: Slide number. */
										__( 'Go to slide %d', 'ambrygen-web' ),
										index + 1
									)
								);

								return bullet.outerHTML;
							},
					  }
					: false,
			on: {
				init() {
					sliderElement.classList.add( 'is-initialized' );
				},
			},
		};

		new Swiper( sliderElement, swiperOptions );
	} );
} );
