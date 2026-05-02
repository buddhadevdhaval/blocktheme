// Vertical Tabs
document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.vertical-tabs' ).forEach( ( vTabsContainer ) => {
		const vItems = Array.from(
			vTabsContainer.querySelectorAll( '.vertical-tabs__item' )
		);

		if ( vItems.length === 0 ) {
			return;
		}

		vItems.forEach( ( item, index ) => {
			const stepLabel = item.querySelector( '.vertical-tabs__step-label' );

			if ( stepLabel ) {
				stepLabel.textContent = `Step ${ index + 1 }`;
			}
		} );

		const setActiveTab = ( nextIndex, shouldFocus = false ) => {
			vItems.forEach( ( item, index ) => {
				const tab = item.querySelector( '.vertical-tabs__header[role="tab"]' );
				const panel = item.querySelector(
					'.vertical-tabs__content[role="tabpanel"]'
				);
				const isActive = index === nextIndex;

				item.classList.toggle( 'is-active', isActive );

				if ( tab ) {
					tab.setAttribute( 'aria-selected', isActive ? 'true' : 'false' );
					tab.setAttribute( 'tabindex', isActive ? '0' : '-1' );

					if ( shouldFocus && isActive ) {
						tab.focus();
					}
				}

				if ( panel ) {
					panel.hidden = ! isActive;
				}
			} );
		};

		const getItemIndexFromEvent = ( eventTarget ) =>
			vItems.findIndex( ( item ) => item.contains( eventTarget ) );

		setActiveTab( 0 );

		vTabsContainer.addEventListener( 'click', ( event ) => {
			const tab = event.target.closest( '.vertical-tabs__header[role="tab"]' );

			if ( ! tab || ! vTabsContainer.contains( tab ) ) {
				return;
			}

			const itemIndex = getItemIndexFromEvent( tab );

			if ( itemIndex !== -1 ) {
				setActiveTab( itemIndex );
			}
		} );

		vTabsContainer.addEventListener( 'keydown', ( event ) => {
			const currentTab = event.target.closest(
				'.vertical-tabs__header[role="tab"]'
			);

			if ( ! currentTab || ! vTabsContainer.contains( currentTab ) ) {
				return;
			}

			const currentIndex = getItemIndexFromEvent( currentTab );

			if ( currentIndex === -1 ) {
				return;
			}

			let nextIndex = null;

			switch ( event.key ) {
				case 'ArrowUp':
				case 'ArrowLeft':
					nextIndex =
						( currentIndex - 1 + vItems.length ) % vItems.length;
					break;
				case 'ArrowDown':
				case 'ArrowRight':
					nextIndex = ( currentIndex + 1 ) % vItems.length;
					break;
				case 'Home':
					nextIndex = 0;
					break;
				case 'End':
					nextIndex = vItems.length - 1;
					break;
				case 'Enter':
				case ' ':
					nextIndex = currentIndex;
					break;
				default:
					return;
			}

			event.preventDefault();
			setActiveTab( nextIndex, true );
		} );
	} );
} );
