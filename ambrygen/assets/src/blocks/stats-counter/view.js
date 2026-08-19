( () => {
	function formatCounterValue( value, targetText ) {
		if ( targetText.includes( ',' ) ) {
			return value.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ',' );
		}

		return value.toString();
	}

	function animateStatsCounter( element, duration = 1500 ) {
		if (
			! element ||
			window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
		) {
			return;
		}

		const text = element.dataset.targetText || element.textContent.trim();
		const finalValue = parseInt(
			element.dataset.targetValue || text.replace( /[^0-9]/g, '' ),
			10
		);

		if ( Number.isNaN( finalValue ) ) {
			return;
		}

		const startTime = Date.now();

		function updateCounter() {
			const elapsed = Date.now() - startTime;
			const progress = Math.min( elapsed / duration, 1 );
			const easeOut = 1 - Math.pow( 1 - progress, 3 );
			const currentValue = Math.floor( finalValue * easeOut );
			const nextValue = formatCounterValue( currentValue, text );

			if ( element.textContent !== nextValue ) {
				element.textContent = nextValue;
			}

			if ( progress < 1 ) {
				requestAnimationFrame( updateCounter );
				return;
			}

			element.textContent = text;
		}

		updateCounter();
	}

	function initStatsCounterBlock() {
		const statsCounters = Array.from(
			document.querySelectorAll(
				'.wp-block-ambrygen-stats-counter, .counter-block'
			)
		).flatMap( ( block ) => {
			const counter = block.querySelector( '.stats-counter' );
			return counter ? [ counter ] : [];
		} );

		if ( ! statsCounters.length ) {
			return;
		}

		if ( typeof window.IntersectionObserver !== 'function' ) {
			statsCounters.forEach( ( counter ) => {
				counter
					.querySelectorAll( '.stats-counter__number-value' )
					.forEach( ( element, index ) => {
						setTimeout( () => {
							animateStatsCounter( element, 1500 );
						}, index * 150 );
					} );
			} );
			return;
		}

		const observer = new window.IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					if ( ! entry.isIntersecting ) {
						return;
					}

					entry.target
						.querySelectorAll( '.stats-counter__number-value' )
						.forEach( ( element, index ) => {
							setTimeout( () => {
								animateStatsCounter( element, 1500 );
							}, index * 150 );
						} );

					observer.unobserve( entry.target );
				} );
			},
			{
				threshold: 0.5,
				rootMargin: '0px',
			}
		);

		statsCounters.forEach( ( counter ) => observer.observe( counter ) );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initStatsCounterBlock );
	} else {
		initStatsCounterBlock();
	}
} )();
