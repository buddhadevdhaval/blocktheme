function equalizeCardInfoHeight( gallery ) {
	const cards = gallery.querySelectorAll(
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

function equalizeGalleries() {
	document
		.querySelectorAll( '.image-grid-block' )
		.forEach( equalizeCardInfoHeight );
}

function debounce( callback, delay = 200 ) {
	let timeoutId;

	return () => {
		window.clearTimeout( timeoutId );
		timeoutId = window.setTimeout( callback, delay );
	};
}

window.addEventListener( 'load', equalizeGalleries );
window.addEventListener( 'resize', debounce( equalizeGalleries ) );
