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
		const autoplayToggle = sliderElement.querySelector(
			'[data-hero-autoplay-toggle]'
		);
		const slideCount =
			sliderElement.querySelectorAll( '.swiper-slide' ).length;
		const announcerElement = sliderElement.querySelector(
			'[data-slide-announcer]'
		);
		let shouldManageFocus = false;
		const updateSlideAnnouncer = ( swiper ) => {
			if ( ! announcerElement || ! swiper || slideCount < 1 ) {
				return;
			}

			announcerElement.textContent = sprintf(
				/* translators: 1: Current slide number, 2: Total slides. */
				__( 'Slide %1$d of %2$d', 'ambrygen-web' ),
				swiper.realIndex + 1,
				slideCount
			);
		};
		const focusableSelector =
			'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
		let swiperInstance = null;
		const updateAutoplayToggle = ( isPaused ) => {
			if ( ! autoplayToggle ) {
				return;
			}

			autoplayToggle.classList.toggle( 'is-paused', isPaused );
			autoplayToggle.setAttribute( 'aria-pressed', String( isPaused ) );
			autoplayToggle.setAttribute(
				'aria-label',
				isPaused
					? __( 'Start autoplay', 'ambrygen-web' )
					: __( 'Pause autoplay', 'ambrygen-web' )
			);
		};
		const manageSlideFocus = ( swiper ) => {
			if ( ! shouldManageFocus || ! swiper ) {
				return;
			}

			const activeElement = sliderElement.ownerDocument.activeElement;

			if (
				! activeElement ||
				sliderElement.ownerDocument.body === activeElement ||
				! sliderElement.contains( activeElement )
			) {
				shouldManageFocus = false;
				return;
			}

			const activeSlide = swiper.slides[ swiper.activeIndex ];

			if ( ! activeSlide ) {
				shouldManageFocus = false;
				return;
			}

			const firstFocusable =
				activeSlide.querySelector( focusableSelector );

			if ( firstFocusable ) {
				firstFocusable.focus();
			}

			shouldManageFocus = false;
		};

		sliderElement.addEventListener( 'keydown', ( event ) => {
			if (
				'ArrowLeft' === event.key ||
				'ArrowRight' === event.key ||
				'Enter' === event.key ||
				' ' === event.key
			) {
				shouldManageFocus = true;
			}

			if ( ! swiperInstance || slideCount < 2 ) {
				return;
			}

			if ( 'ArrowLeft' === event.key ) {
				event.preventDefault();
				swiperInstance.slidePrev();
			}

			if ( 'ArrowRight' === event.key ) {
				event.preventDefault();
				swiperInstance.slideNext();
			}
		} );

		sliderElement.addEventListener( 'click', () => {
			if (
				sliderElement.contains(
					sliderElement.ownerDocument.activeElement
				)
			) {
				shouldManageFocus = true;
			}
		} );

		if ( autoplayToggle ) {
			autoplayToggle.addEventListener( 'click', () => {
				if ( ! swiperInstance?.autoplay ) {
					return;
				}

				if ( swiperInstance.autoplay.running ) {
					swiperInstance.autoplay.stop();
					updateAutoplayToggle( true );
					return;
				}

				swiperInstance.autoplay.start();
				updateAutoplayToggle( false );
			} );
		}

		const swiperOptions = {
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			loop: slideCount > 1,
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
				init( instance ) {
					swiperInstance = instance;
					sliderElement.classList.add( 'is-initialized' );
					updateSlideAnnouncer( instance );
					updateAutoplayToggle( ! instance.autoplay?.running );
				},
				slideChange( instance ) {
					updateSlideAnnouncer( instance );
					manageSlideFocus( instance );
				},
			},
		};

		swiperInstance = new Swiper( sliderElement, swiperOptions );
	} );
} );
