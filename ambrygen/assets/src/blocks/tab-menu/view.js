document.addEventListener( 'DOMContentLoaded', function () {
	const OFFSET = 250; // same offset you use for scroll

	document
		.querySelectorAll( '.secondary-sticky-tabs' )
		.forEach( function ( wrapper ) {
			const tabs = wrapper.querySelectorAll( '.tab-button' );

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
						OFFSET;

					window.scrollTo( {
						top: targetPosition,
						behavior: 'smooth',
					} );
				} );
			} );

			/* -----------------------------
		   STICKY BEHAVIOR
		--------------------------------*/
			// Get real position in document
			const wrapperTop =
				wrapper.getBoundingClientRect().top + window.pageYOffset;

			window.addEventListener( 'scroll', function () {
				if ( window.pageYOffset >= wrapperTop ) {
					wrapper.classList.add( 'is-sticky' );
				} else {
					wrapper.classList.remove( 'is-sticky' );
				}
			} );

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
				let currentSection = null;

				sections.forEach( ( item ) => {
					const rect = item.section.getBoundingClientRect();
					if ( rect.top <= OFFSET && rect.bottom > OFFSET ) {
						currentSection = item.tab;
					}
				} );

				if ( currentSection ) {
					tabs.forEach( ( t ) => t.classList.remove( 'active' ) );
					currentSection.classList.add( 'active' );
				}
			} );
		} );
} );
