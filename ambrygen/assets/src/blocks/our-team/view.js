document.addEventListener( 'DOMContentLoaded', () => {
	const teamBlocks = document.querySelectorAll( '.our-team' );

	teamBlocks.forEach( ( block ) => {
		const cards = block.querySelectorAll( '.our-team__card' );
		const offcanvas = block.querySelector( '.offcanvas-sidebar' );

		if ( ! offcanvas || ! cards.length ) {
			return;
		}

		const overlay = offcanvas.querySelector(
			'.offcanvas-sidebar__overlay'
		);
		const panel = offcanvas.querySelector( '.offcanvas-sidebar__panel' );
		const closeBtn = offcanvas.querySelector( '.offcanvas-sidebar__close' );
		const nameEl = offcanvas.querySelector( '.our-team-offcanvas__name' );
		const roleEl = offcanvas.querySelector( '.our-team-offcanvas__role' );
		const imageEl = offcanvas.querySelector( '.our-team-offcanvas__image' );
		const bioEl = offcanvas.querySelector( '.our-team-offcanvas__bio' );

		let lastFocusedElement = null;

		function openOffcanvas( card ) {
			lastFocusedElement = card;

			// Populate content from data attributes.
			const name = card.getAttribute( 'data-team-name' ) || '';
			const designation =
				card.getAttribute( 'data-team-designation' ) || '';
			const imageSrc = card.getAttribute( 'data-team-image' ) || '';
			const bio = card.getAttribute( 'data-team-bio' ) || '';

			nameEl.textContent = name;
			roleEl.textContent = designation;
			imageEl.src = imageSrc;
			imageEl.alt = name;
			bioEl.innerHTML = bio;

			// Show offcanvas.
			offcanvas.classList.add( 'is-active' );
			offcanvas.setAttribute( 'aria-hidden', 'false' );
			document.body.classList.add( 'offcanvas-sidebar-open' );

			// Focus the close button.
			setTimeout( () => {
				closeBtn.focus();
			}, 100 );
		}

		function closeOffcanvas() {
			offcanvas.classList.remove( 'is-active' );
			offcanvas.setAttribute( 'aria-hidden', 'true' );
			document.body.classList.remove( 'offcanvas-sidebar-open' );

			// Return focus to the card that opened the panel.
			if ( lastFocusedElement ) {
				lastFocusedElement.focus();
				lastFocusedElement = null;
			}
		}

		// Open on card click.
		cards.forEach( ( card ) => {
			if ( ! card.hasAttribute( 'tabindex' ) ) {
				card.setAttribute( 'tabindex', '0' );
			}

			card.addEventListener( 'click', () => {
				openOffcanvas( card );
			} );

			card.addEventListener( 'keydown', ( e ) => {
				if ( e.key === 'Enter' || e.key === ' ' ) {
					e.preventDefault();
					openOffcanvas( card );
				}
			} );
		} );

		// Close on close button click.
		if ( closeBtn ) {
			closeBtn.addEventListener( 'click', closeOffcanvas );
		}

		// Close on overlay click.
		if ( overlay ) {
			overlay.addEventListener( 'click', closeOffcanvas );
		}

		// Close on Escape key.
		document.addEventListener( 'keydown', ( e ) => {
			if (
				e.key === 'Escape' &&
				offcanvas.classList.contains( 'is-active' )
			) {
				closeOffcanvas();
			}
		} );

		// Trap focus within the panel.
		panel.addEventListener( 'keydown', ( e ) => {
			if ( e.key !== 'Tab' ) {
				return;
			}

			const { ownerDocument } = panel;
			const focusableElements = panel.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);

			if ( ! focusableElements.length ) {
				return;
			}

			const firstFocusable = focusableElements[ 0 ];
			const lastFocusable =
				focusableElements[ focusableElements.length - 1 ];

			if ( e.shiftKey ) {
				if ( ownerDocument.activeElement === firstFocusable ) {
					e.preventDefault();
					lastFocusable.focus();
				}
			} else if ( ownerDocument.activeElement === lastFocusable ) {
				e.preventDefault();
				firstFocusable.focus();
			}
		} );
	} );
} );
