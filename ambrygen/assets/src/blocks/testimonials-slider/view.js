import Swiper from 'swiper';
import {
	Autoplay,
	A11y,
	EffectFade,
	Keyboard,
	Navigation,
	Pagination,
} from 'swiper/modules';

const initTestimonialSliders = () => {
	const testimonialSliders = document.querySelectorAll(
		'.testimonial-swiper'
	);

	testimonialSliders.forEach( ( sliderElement ) => {
		if ( sliderElement.classList.contains( 'swiper-initialized' ) ) {
			return;
		}

		const sliderRoot = sliderElement.closest(
			'.testimonial-slider__swiper'
		);
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
		const slideCount =
			sliderElement.querySelectorAll( '.swiper-slide' ).length;

		new Swiper( sliderElement, {
			modules: [
				Pagination,
				Navigation,
				EffectFade,
				Autoplay,
				Keyboard,
				A11y,
			],
			loop: false,
			rewind: slideCount > 1,
			speed: 600,
			slidesPerView,
			spaceBetween: 0,
			effect: useFade ? 'fade' : 'slide',
			fadeEffect: useFade
				? {
						crossFade: true,
				  }
				: undefined,
			pagination: paginationElement
				? {
						el: paginationElement,
						clickable: true,
				  }
				: false,
			navigation:
				prevEl && nextEl
					? {
							prevEl,
							nextEl,
					  }
					: false,
			autoplay: autoplayEnabled
				? {
						delay: 3000,
						disableOnInteraction: false,
				  }
				: false,
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
			a11y: {
				enabled: true,
				prevSlideMessage: 'Previous testimonial',
				nextSlideMessage: 'Next testimonial',
			},
		} );
	} );
};

if ( 'loading' === document.readyState ) {
	document.addEventListener( 'DOMContentLoaded', initTestimonialSliders );
} else {
	initTestimonialSliders();
}
