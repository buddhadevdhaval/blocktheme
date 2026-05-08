( () => {
	const initTabs = ( container ) => {
		const tabs = Array.from(
			container.querySelectorAll( '.icon_ajax_tab[data-tab-target]' )
		);
		const panels = Array.from(
			container.querySelectorAll( '.tabs__panel' )
		);

		if ( ! tabs.length || ! panels.length ) {
			return;
		}

		const activateTab = ( target ) => {
			tabs.forEach( ( tab ) => {
				const isActive = tab.dataset.tabTarget === target;
				tab.classList.toggle( 'is-active', isActive );
				tab.setAttribute( 'aria-selected', isActive ? 'true' : 'false' );
			} );

			panels.forEach( ( panel ) => {
				const isActive = panel.id === target;
				panel.classList.toggle( 'is-active', isActive );
				panel.hidden = ! isActive;
			} );
		};

		const activeTarget =
			tabs.find( ( tab ) => tab.classList.contains( 'is-active' ) )
				?.dataset.tabTarget || tabs[ 0 ]?.dataset.tabTarget;

		if ( activeTarget ) {
			activateTab( activeTarget );
		}

		tabs.forEach( ( tab ) => {
			tab.addEventListener( 'click', ( event ) => {
				event.preventDefault();
				activateTab( tab.dataset.tabTarget || '' );
			} );
		} );
	};

	document.addEventListener( 'DOMContentLoaded', () => {
		document
			.querySelectorAll( '.wp-block-ambrygen-icon-grids .tabs-content' )
			.forEach( initTabs );
	} );
} )();
