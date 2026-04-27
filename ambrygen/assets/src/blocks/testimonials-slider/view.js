import Swiper from 'swiper';
import {
	Autoplay,
	EffectFade,
	Navigation,
	Pagination,
} from 'swiper/modules';

document.addEventListener( 'DOMContentLoaded', () => {
	const testimonialSliders = document.querySelectorAll( '.testimonial-swiper' );

	testimonialSliders.forEach( ( sliderElement ) => {
		const sliderRoot = sliderElement.closest( '.testimonial-slider__swiper' );
		if ( ! sliderRoot ) {
			return;
		}

		const slidesPerView = Math.max(
			1,
			parseInt( sliderElement.dataset.slidesPerView || '1', 10 ) || 1
		);
		const autoplayEnabled = sliderElement.dataset.autoplay === 'true';
		const paginationElement = sliderRoot.querySelector(
			'.testimonial-swiper-pagination'
		);
		const nextEl = sliderRoot.querySelector( '.custom-next' );
		const prevEl = sliderRoot.querySelector( '.custom-prev' );
		const useFade = slidesPerView === 1;

		new Swiper( sliderElement, {
			modules: [ Navigation, Pagination, EffectFade, Autoplay ],
			loop: sliderElement.querySelectorAll( '.swiper-slide' ).length > 1,
			speed: 600,
			slidesPerView,
			spaceBetween: 0,
			effect: useFade ? 'fade' : 'slide',
			fadeEffect: useFade
				? {
						crossFade: true,
				  }
				: undefined,
			navigation:
				nextEl && prevEl
					? {
							nextEl,
							prevEl,
					  }
					: false,
			pagination: paginationElement
				? {
						el: paginationElement,
						clickable: true,
				  }
				: false,
			autoplay: autoplayEnabled
				? {
						delay: 3000,
						disableOnInteraction: false,
				  }
				: false,
		} );
	} );
} );
