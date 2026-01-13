// view.js - Vanilla JS only (No @wordpress/interactivity)
document.addEventListener( 'DOMContentLoaded', () => {
	const megaMenus = document.querySelectorAll( '.mega-menu-item' );

	megaMenus.forEach( ( menu ) => {
		const toggleBtn = menu.querySelector( '.mega-menu-toggle' );
		const menuContent = menu.querySelector( '.mega-menu-content' );

		if ( toggleBtn && menuContent ) {
			toggleBtn.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				menuContent.classList.toggle( 'is-open' );
				toggleBtn.classList.toggle( 'is-active' );
			} );
		}
	} );
} );
