// Vertical Tabs
document.addEventListener( 'DOMContentLoaded', () => {
	const vTabsContainer = document.querySelector( '.vertical-tabs' );

	if ( vTabsContainer ) {
		const vItems = vTabsContainer.querySelectorAll(
			'.vertical-tabs__item'
		);

		if ( vItems.length > 0 ) {
			// ✅ Add active class to first tab by default
			vItems[ 0 ].classList.add( 'is-active' );
		}

		vItems.forEach( ( item ) => {
			item.addEventListener( 'click', () => {
				// Remove active class from all
				vItems.forEach( ( t ) => t.classList.remove( 'is-active' ) );

				// Add active class to clicked
				item.classList.add( 'is-active' );
			} );
		} );
	}
} );
