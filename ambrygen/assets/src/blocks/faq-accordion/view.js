document.addEventListener('DOMContentLoaded', () => {
	const accordions = document.querySelectorAll('.faq__item');

	accordions.forEach((accordion) => {
		const summary = accordion.querySelector('summary');

		if (summary) {
			accordion.addEventListener('toggle', () => {
				summary.setAttribute('aria-expanded', accordion.open);
			});
		}
	});
});
