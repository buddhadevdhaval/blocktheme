( function () {
	function setActiveItem( container, activeItem ) {
		if ( ! container || ! activeItem ) {
			return;
		}

		container
			.querySelectorAll( '.tabs-table-content__item' )
			.forEach( ( item ) => {
				item.classList.toggle( 'is-active', item === activeItem );

				const header = item.querySelector(
					'.tabs-table-content__header'
				);

				if ( header ) {
					header.setAttribute(
						'aria-expanded',
						item === activeItem ? 'true' : 'false'
					);
				}
			} );
	}

	function getItemFromHash( container ) {
		const hash = window.location.hash.replace( /^#/, '' );

		if ( ! hash ) {
			return null;
		}

		const escapedHash =
			window.CSS && typeof window.CSS.escape === 'function'
				? window.CSS.escape( hash )
				: hash.replace( /[^a-zA-Z0-9_-]/g, '\\$&' );

		return container.querySelector( `#${ escapedHash }.tabs-table-content__item` );
	}

	function initTabsTable( container ) {
		if ( ! container ) {
			return;
		}

		const items = Array.from(
			container.querySelectorAll( '.tabs-table-content__item' )
		);

		if ( ! items.length ) {
			return;
		}

		const activateFromHash = () => {
			const hashItem = getItemFromHash( container );

			if ( hashItem ) {
				setActiveItem( container, hashItem );
			}
		};

		items.forEach( ( item ) => {
			const header = item.querySelector( '.tabs-table-content__header' );

			if ( ! header || ! item.id ) {
				return;
			}

			header.addEventListener( 'click', () => {
				setActiveItem( container, item );
				if ( window.location.hash !== `#${ item.id }` ) {
					window.history.replaceState( null, '', `#${ item.id }` );
				}
			} );

			header.addEventListener( 'keydown', ( event ) => {
				if ( event.key !== 'Enter' && event.key !== ' ' ) {
					return;
				}

				event.preventDefault();
				setActiveItem( container, item );
				if ( window.location.hash !== `#${ item.id }` ) {
					window.history.replaceState( null, '', `#${ item.id }` );
				}
			} );
		} );

		const initialActiveItem =
			items.find( ( item ) => item.classList.contains( 'is-active' ) ) ||
			items[ 0 ];

		if ( initialActiveItem ) {
			setActiveItem( container, initialActiveItem );
		}

		activateFromHash();
		window.addEventListener( 'hashchange', activateFromHash );
	}

	document.addEventListener( 'DOMContentLoaded', () => {
		document
			.querySelectorAll( '.tabs-table-content' )
			.forEach( initTabsTable );
	} );
} )();
