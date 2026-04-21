import Swiper from 'swiper/bundle';

document.addEventListener( 'DOMContentLoaded', () => {
	const mediaSliders = document.querySelectorAll(
		'.image-gallery-slider-item__media-slider'
	);

	mediaSliders.forEach( ( sliderElement ) => {
		const nextEl = sliderElement.querySelector( '.custom-next' );
		const prevEl = sliderElement.querySelector( '.custom-prev' );

		new Swiper( sliderElement, {
			slidesPerView: 1,
			spaceBetween: 0,
			loop: true,

			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},

			speed: 500,
			navigation:
				nextEl && prevEl
					? {
							nextEl,
							prevEl,
					  }
					: false,
			pagination: false,
			autoplay: false,

			keyboard: {
				enabled: true,
			},
		} );
	} );
} );
