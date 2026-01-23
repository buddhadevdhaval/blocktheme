document.addEventListener( 'DOMContentLoaded', () => {
	console.log( 'HM Mega Menu Block loaded' );
	document.querySelectorAll( '.has-mega-menu' ).forEach( ( menuItem ) => {
		const toggle = menuItem.querySelector(
			'.wp-block-navigation-item__content'
		);

		if ( ! toggle ) {
			return;
		}

		// Click toggle (mobile + desktop)
		toggle.addEventListener( 'click', ( e ) => {
			e.preventDefault();

			// Close others
			document
				.querySelectorAll( '.has-mega-menu.is-open' )
				.forEach( ( item ) => {
					if ( item !== menuItem ) {
						item.classList.remove( 'is-open' );
					}
				} );

			menuItem.classList.toggle( 'is-open' );

			toggle.setAttribute(
				'aria-expanded',
				menuItem.classList.contains( 'is-open' )
			);
		} );
	} );

	// Close on outside click
	document.addEventListener( 'click', ( e ) => {
		if ( ! e.target.closest( '.has-mega-menu' ) ) {
			document
				.querySelectorAll( '.has-mega-menu.is-open' )
				.forEach( ( item ) => item.classList.remove( 'is-open' ) );
		}
	} );
} );
