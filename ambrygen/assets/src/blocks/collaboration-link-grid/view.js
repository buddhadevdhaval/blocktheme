document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll(
		'.wp-block-ambrygen-collaboration-link-grid'
	);

	blocks.forEach( ( block ) => {
		if ( ! block.classList.contains( 'variation-with-accordion' ) ) {
			return;
		}

		const toggle = block.querySelector( '.download-list__toggle' );

		if ( ! toggle ) {
			return;
		}

		const controlsId = toggle.getAttribute( 'aria-controls' );
		const items = controlsId ? document.getElementById( controlsId ) : null;

		if ( ! items ) {
			return;
		}

		const setExpandedState = ( isExpanded ) => {
			toggle.setAttribute(
				'aria-expanded',
				isExpanded ? 'true' : 'false'
			);
			toggle.setAttribute(
				'aria-label',
				isExpanded ? 'Collapse links section' : 'Expand links section'
			);
			items.classList.toggle( 'is-collapsed', ! isExpanded );
		};

		setExpandedState( false );

		toggle.addEventListener( 'click', () => {
			const isExpanded =
				toggle.getAttribute( 'aria-expanded' ) === 'true';
			setExpandedState( ! isExpanded );
		} );
	} );
} );
