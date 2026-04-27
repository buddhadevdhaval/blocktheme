function equalizeCardInfoHeight( ctaTiles ) {
	const cards = ctaTiles.querySelectorAll(
		'.card-grid-block .card-col .card-info'
	);

	if ( ! cards.length ) {
		return;
	}

	// Reset height first
	cards.forEach( ( card ) => {
		card.style.height = 'auto';
	} );

	// Find tallest height
	let maxHeight = 0;
	cards.forEach( ( card ) => {
		const height = card.offsetHeight;
		if ( height > maxHeight ) {
			maxHeight = height;
		}
	} );

	// Apply tallest height
	cards.forEach( ( card ) => {
		card.style.height = `${ maxHeight }px`;
	} );
}

function initCtaTiles( ctaTiles ) {
	const equalize = () => equalizeCardInfoHeight( ctaTiles );

	equalize();

	ctaTiles.querySelectorAll( 'img' ).forEach( ( image ) => {
		if ( image.complete ) {
			return;
		}

		image.addEventListener( 'load', equalize, { once: true } );
	} );

	if ( 'ResizeObserver' in window ) {
		const observer = new window.ResizeObserver( equalize );
		observer.observe( ctaTiles );
		return;
	}

	window.addEventListener( 'resize', debounce( equalize ) );
}

function debounce( callback, delay = 200 ) {
	let timeoutId;

	return () => {
		window.clearTimeout( timeoutId );
		timeoutId = window.setTimeout( callback, delay );
	};
}

function initAllCtaTiles() {
	document.querySelectorAll( '.cta-tiles' ).forEach( initCtaTiles );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initAllCtaTiles );
} else {
	initAllCtaTiles();
}
