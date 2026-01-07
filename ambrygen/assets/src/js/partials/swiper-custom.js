import Swiper from 'swiper/bundle';

document.addEventListener( 'DOMContentLoaded', function() {
	const sliders = document.querySelectorAll( '.our-history-slide' );

	if ( sliders.length > 0 ) {
		sliders.forEach( ( slider, index ) => {
			// Create unique IDs for the current slider and its navigation buttons
			const sliderId = `slider-${ index }`;
			const sliderContainer = slider.closest( '.card-list-slider' );

			// Ensure the slider container exists and has navigation buttons
			const nextButton = sliderContainer ? sliderContainer.querySelector( '.swiper-button-next' ) : null;
			const prevButton = sliderContainer ? sliderContainer.querySelector( '.swiper-button-prev' ) : null;

			// Only initialize Swiper if navigation buttons are available
			if ( nextButton && prevButton ) {
				// Assign unique IDs to the buttons for clarity or accessibility
				nextButton.setAttribute( 'data-slider-id', sliderId );
				prevButton.setAttribute( 'data-slider-id', sliderId );

				// Initialize Swiper instance with customized settings
				new Swiper( slider, {
					slidesPerView: 1.2,
					loop: false,
					spaceBetween: 8,
					autoHeight: true,
					navigation: {
						nextEl: nextButton,
						prevEl: prevButton,
					},
					breakpoints: {
						580: {
							slidesPerView: 1.2,
							spaceBetween: 8,
						},
						640: {
							slidesPerView: 1.8,
							spaceBetween: 8,
						},
						991: {
							slidesPerView: 2.5,
							spaceBetween: 8,
						},
						1200: {
							slidesPerView: 3,
							spaceBetween: 10,
						},
					},
				} );
			}
		} );
	}
} );
