function equalizeCardInfoHeight() {
	const cards = document.querySelectorAll(
		'.get-started-ambry-block .card-grid-block .card-col .card-info'
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
		card.style.height = maxHeight + 'px';
	} );
}

// Run on load
window.addEventListener( 'load', equalizeCardInfoHeight );

// Run on resize
window.addEventListener( 'resize', () => {
	setTimeout( equalizeCardInfoHeight, 200 );
} );
