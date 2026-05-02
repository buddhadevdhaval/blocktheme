import Swiper from 'swiper';
import { Navigation, EffectFade, Keyboard, A11y } from 'swiper/modules';

document.addEventListener( 'DOMContentLoaded', () => {
	let resizeHandler;
	let swiperInstance = null;
	let cleanupObserver = null;
	const focusableSelector =
		'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

	const debounce = ( func, wait = 250 ) => {
		let timeout;

		return function debouncedFunction( ...args ) {
			clearTimeout( timeout );
			timeout = setTimeout( () => func( ...args ), wait );
		};
	};

	const destroySwiper = ( container ) => {
		const activeSwiper = swiperInstance || container?.swiper;

		if ( activeSwiper ) {
			activeSwiper.destroy( true, true );
			swiperInstance = null;
		}
	};

	const restoreFocus = ( element ) => {
		if ( ! element ) {
			return;
		}

		const focusTarget =
			element.matches( focusableSelector )
				? element
				: element.querySelector( focusableSelector );

		if ( focusTarget ) {
			focusTarget.focus();
			return;
		}

		element.setAttribute( 'tabindex', '-1' );
		element.focus();
		element.removeAttribute( 'tabindex' );
	};

	const cleanup = () => {
		const container = document.querySelector( '.testimonial_slider' );

		if ( resizeHandler ) {
			window.removeEventListener( 'resize', resizeHandler );
		}

		if ( cleanupObserver ) {
			cleanupObserver.disconnect();
			cleanupObserver = null;
		}

		if ( container ) {
			destroySwiper( container );
		}
	};

	const getLiveRegionText = ( current, total, rootSection ) => {
		const template =
			rootSection?.dataset.testimonialsStatusTemplate ||
			'Slide %1$d of %2$d';

		return template
			.replace( '%1$d', current )
			.replace( '%2$d', total );
	};

	const updateLiveRegion = ( swiper, container, rootSection ) => {
		const statusId = rootSection?.dataset.testimonialsStatusId;
		if ( ! statusId || ! swiper ) {
			return;
		}

		const statusElement = container.querySelector( `#${ statusId }` );
		if ( ! statusElement ) {
			return;
		}

		const current = swiper.realIndex + 1;
		const total = swiper.slides.length;

		statusElement.textContent = getLiveRegionText(
			current,
			total,
			rootSection
		);
	};

	const ensureSwiperControls = ( container, rootSection ) => {
		const statusId = rootSection?.dataset.testimonialsStatusId;
		const prevLabel =
			rootSection?.dataset.testimonialsPrevLabel ||
			'Previous testimonial';
		const nextLabel =
			rootSection?.dataset.testimonialsNextLabel ||
			'Next testimonial';

		if ( statusId && ! container.querySelector( `#${ statusId }` ) ) {
			const liveRegion = document.createElement( 'div' );
			liveRegion.className = 'screen-reader-text';
			liveRegion.id = statusId;
			liveRegion.setAttribute( 'aria-live', 'polite' );
			liveRegion.setAttribute( 'aria-atomic', 'true' );
			liveRegion.textContent = getLiveRegionText( 1, 0, rootSection );
			container.appendChild( liveRegion );
		}

		if ( ! container.querySelector( '.swiper-buttons' ) ) {
			const buttonWrapper = document.createElement( 'div' );
			buttonWrapper.className = 'swiper-buttons';

			const prevButton = document.createElement( 'button' );
			prevButton.type = 'button';
			prevButton.className = 'custom-prev';
			prevButton.setAttribute( 'aria-label', prevLabel );

			const nextButton = document.createElement( 'button' );
			nextButton.type = 'button';
			nextButton.className = 'custom-next';
			nextButton.setAttribute( 'aria-label', nextLabel );

			if ( statusId ) {
				prevButton.setAttribute( 'aria-controls', statusId );
				nextButton.setAttribute( 'aria-controls', statusId );
			}

			buttonWrapper.appendChild( prevButton );
			buttonWrapper.appendChild( nextButton );
			container.appendChild( buttonWrapper );
		}
	};

	const initMobileSwiper = () => {
		const container = document.querySelector( '.testimonial_slider' );
		const parentGrid = container
			? container.closest( '.ambry-testimonials__grid' )
			: document.querySelector( '.ambry-testimonials__grid' );
		if ( ! parentGrid ) {
			return;
		}

		const rootSection = parentGrid.closest(
			'.wp-block-ambrygen-testimonials'
		);

		/* =========================
		 * DESKTOP
		 * ========================= */
		if ( window.innerWidth > 767 ) {
			if ( ! container ) {
				return;
			}

			const activeElement = document.activeElement;
			const wasFocusInSlider =
				activeElement && container.contains( activeElement );
			const focusedSlide = wasFocusInSlider
				? activeElement.closest( '.ambry-testimonials__grid__item' )
				: null;

			destroySwiper( container );

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

				if ( wasFocusInSlider ) {
					restoreFocus(
						focusedSlide && focusedSlide.isConnected
							? focusedSlide
							: slides[ 0 ]
					);
				}

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

			ensureSwiperControls( swiperContainer, rootSection );

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

				swiperInstance = new Swiper( swiperContainer, {
					modules: [ Navigation, EffectFade, Keyboard, A11y ],
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
					keyboard: {
						enabled: true,
						onlyInViewport: true,
					},
					a11y: {
						enabled: true,
						prevSlideMessage: 'Previous testimonial',
						nextSlideMessage: 'Next testimonial',
						firstSlideMessage: 'This is the first testimonial',
						lastSlideMessage: 'This is the last testimonial',
					},
				} );

				swiperInstance.on( 'slideChange', () =>
					updateLiveRegion(
						swiperInstance,
						swiperContainer,
						rootSection
					)
				);
				updateLiveRegion( swiperInstance, swiperContainer, rootSection );
			}
		}
	};

	const rootGrid = document.querySelector( '.ambry-testimonials__grid' );

	if ( rootGrid ) {
		cleanupObserver = new MutationObserver( () => {
			if ( ! document.body.contains( rootGrid ) ) {
				cleanup();
			}
		} );

		cleanupObserver.observe( document.body, {
			childList: true,
			subtree: true,
		} );
	}

	resizeHandler = debounce( initMobileSwiper, 250 );
	initMobileSwiper();
	window.addEventListener( 'resize', resizeHandler );
	window.addEventListener( 'beforeunload', cleanup, { once: true } );
} );
