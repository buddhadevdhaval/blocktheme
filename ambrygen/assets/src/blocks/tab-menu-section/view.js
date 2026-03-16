document.addEventListener( 'DOMContentLoaded', function () {
	document
		.querySelectorAll( '.tab-menu-section' )
		.forEach( function ( wrapper ) {
			const tabs = wrapper.querySelectorAll( '.tab-menu-section__tab' );
			const offset = parseInt(
				wrapper.getAttribute( 'data-offset' ) || '250',
				10
			);
			const isSticky = wrapper.getAttribute( 'data-is-sticky' ) === 'true';

			if ( ! tabs.length ) {
				return;
			}

			/* -----------------------------
		   CLICK SCROLL
		--------------------------------*/
			tabs.forEach( function ( tab ) {
				tab.addEventListener( 'click', function () {
					const targetId = this.dataset.scrollTarget;
					const target = document.getElementById( targetId );

					if ( ! target ) {
						return;
					}

					const targetPosition =
						target.getBoundingClientRect().top +
						window.pageYOffset -
						offset;

					window.scrollTo( {
						top: targetPosition,
						behavior: 'smooth',
					} );
				} );
			} );

			/* -----------------------------
		   STICKY BEHAVIOR
		--------------------------------*/
			if ( isSticky ) {
				const wrapperTop =
					wrapper.getBoundingClientRect().top +
					window.pageYOffset;

				window.addEventListener( 'scroll', function () {
					if ( window.pageYOffset >= wrapperTop ) {
						wrapper.classList.add( 'is-sticky' );
					} else {
						wrapper.classList.remove( 'is-sticky' );
					}
				} );
			}

			/* -----------------------------
		   ACTIVE TAB ON SCROLL
		--------------------------------*/
			const sections = [];

			tabs.forEach( ( tab ) => {
				const targetId = tab.dataset.scrollTarget;
				const section = document.getElementById( targetId );
				if ( section ) {
					sections.push( {
						tab,
						section,
					} );
				}
			} );

			window.addEventListener( 'scroll', function () {
				let currentTab = null;

				sections.forEach( ( item ) => {
					const rect = item.section.getBoundingClientRect();
					if ( rect.top <= offset && rect.bottom > offset ) {
						currentTab = item.tab;
					}
				} );

				if ( currentTab ) {
					tabs.forEach( ( t ) => t.classList.remove( 'active' ) );
					currentTab.classList.add( 'active' );
				}
			} );
		} );
} );
