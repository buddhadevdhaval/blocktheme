import Swiper from 'swiper/bundle';

document.addEventListener( 'DOMContentLoaded', () => {
	const mediaSliders = document.querySelectorAll(
		'.multimedia-member-item__media-slider'
	);

	mediaSliders.forEach( ( sliderElement ) => {
		if ( sliderElement.classList.contains( 'swiper-initialized' ) ) {
			return;
		}

		const slides = sliderElement.querySelectorAll( '.swiper-slide' );
		const nextEl = sliderElement.querySelector( '.custom-next' );
		const prevEl = sliderElement.querySelector( '.custom-prev' );

		new Swiper( sliderElement, {
			slidesPerView: 1,
			spaceBetween: 0,
			loop: slides.length > 1,

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
