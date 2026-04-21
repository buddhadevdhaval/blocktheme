import Swiper from 'swiper/bundle';
document.addEventListener('DOMContentLoaded', () => {

	const testimonialSliders = document.querySelectorAll('.testimonial-swiper');

	if (testimonialSliders.length > 0) {
		testimonialSliders.forEach((sliderElement) => {
			const paginationElement = sliderElement.parentElement.querySelector('.testimonial-swiper-pagination');

			new Swiper(sliderElement, {
				loop: true,
				effect: 'fade',
				fadeEffect: {
					crossFade: true
				},
				speed: 600,
				slidesPerView: 3,
				spaceBetween: 0,
				pagination: paginationElement ? {
					el: paginationElement,
					clickable: true,
				} : false,
			});
		});
	}

});
