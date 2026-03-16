import Swiper from 'swiper/bundle';

document.addEventListener('DOMContentLoaded', () => {
	const mediaSliders = document.querySelectorAll(
		'.image-gallery-slider-item__media-slider'
	);

	mediaSliders.forEach((sliderElement) => {
		let config = {};
		const configAttr = sliderElement.getAttribute('data-swiper-config');

		if (configAttr) {
			try {
				config = JSON.parse(configAttr);
			} catch (e) { }
		}

		new Swiper(sliderElement, {
			slidesPerView: 1,
			spaceBetween: 0,
			loop: true,
			navigation:
				config.navigation_show === false
					? false
					: {
						nextEl: sliderElement.querySelector('.custom-next'),
						prevEl: sliderElement.querySelector('.custom-prev'),
					},
			pagination:
				config.pagination_show === false
					? false
					: {
						el: sliderElement.querySelector('.swiper-pagination'),
						clickable: true,
					},
			autoplay: config.autoplay
				? {
					delay: 3000,
					disableOnInteraction: false,
					pauseOnMouseEnter: true,
				}
				: false,
			keyboard: {
				enabled: true,
			},
		});
	});
});
