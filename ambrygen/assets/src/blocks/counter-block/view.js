function animateCounter( element, duration = 1500 ) {
	const text = element.textContent.trim();
	const numText = text.replace( /[^0-9]/g, '' );
	const finalValue = parseInt( numText, 10 );

	if ( Number.isNaN( finalValue ) ) {
		return;
	}

	const suffix = text.replace( /[0-9,]/g, '' );
	const startTime = Date.now();

	function updateCounter() {
		const elapsed = Date.now() - startTime;
		const progress = Math.min( elapsed / duration, 1 );
		const easeOut = 1 - Math.pow( 1 - progress, 3 );
		const currentValue = Math.floor( finalValue * easeOut );
		const formatted = currentValue.toLocaleString();

		element.textContent = formatted + suffix;

		if ( progress < 1 ) {
			requestAnimationFrame( updateCounter );
			return;
		}

		element.textContent = text;
	}

	updateCounter();
}

document.addEventListener( 'DOMContentLoaded', () => {
	const observerOptions = {
		threshold: 0.5,
		rootMargin: '0px',
	};

	const observer = new IntersectionObserver( ( entries ) => {
		entries.forEach( ( entry ) => {
			if ( ! entry.isIntersecting ) {
				return;
			}

			const numberElements = entry.target.querySelectorAll(
				'.stats-counter__number'
			);

			numberElements.forEach( ( element, index ) => {
				setTimeout( () => {
					animateCounter( element, 1500 );
				}, index * 150 );
			} );

			observer.unobserve( entry.target );
		} );
	}, observerOptions );

	const statsCounters = document.querySelectorAll(
		'.counter-block .stats-counter, .counter-block .intro__stats-wrapper'
	);

	statsCounters.forEach( ( counter ) => observer.observe( counter ) );
} );
