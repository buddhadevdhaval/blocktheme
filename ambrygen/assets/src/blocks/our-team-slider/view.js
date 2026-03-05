import Swiper from 'swiper/bundle';
document.addEventListener( 'DOMContentLoaded', () => {
	const sliders = document.querySelectorAll( '.our-leadership-slider' );

	sliders.forEach( ( sliderElement ) => {
		let config = {};
		const configAttr = sliderElement.getAttribute( 'data-swiper-config' );

		if ( configAttr ) {
			try {
				config = JSON.parse( configAttr );
			} catch ( e ) {}
		}

		new Swiper( sliderElement, {
			//  modules: [Navigation],
			slidesPerView: 1.4,
			spaceBetween: 20,
			loop: true,

			navigation:
				config.navigation_show === false
					? false
					: {
							nextEl: '.custom-next',
							prevEl: '.custom-prev',
					  },

			breakpoints: {
				640: { slidesPerView: 2.5 },
				768: { slidesPerView: 2.5 },
				1024: { slidesPerView: 3.5 },
				1200: {
					slidesPerView: 4.4,
					spaceBetween: 32,
				},
			},

			on: {
				init() {
					sliderElement.classList.add( 'is-initialized' );
				},
			},

			// Merge any config passed via data-swiper-config
			...config,
		} );
	} );
} );
