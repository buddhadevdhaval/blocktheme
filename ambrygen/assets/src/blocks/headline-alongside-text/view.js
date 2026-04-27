const TOOLTIP_SELECTOR = '.ambrygen-tooltip';

function setActiveTooltip( activeNode ) {
	document.querySelectorAll( TOOLTIP_SELECTOR ).forEach( ( node ) => {
		node.classList.toggle( 'is-tooltip-active', node === activeNode );
	} );
}

document.addEventListener( 'click', ( event ) => {
	const tooltipNode = event.target.closest( TOOLTIP_SELECTOR );

	if ( ! tooltipNode ) {
		setActiveTooltip( null );
		return;
	}

	const isMobile = window.matchMedia( '(hover: none), (pointer: coarse)' )
		.matches;

	if ( isMobile ) {
		event.preventDefault();
		event.stopPropagation();
		tooltipNode.classList.toggle( 'is-tooltip-active' );
	} else {
		setActiveTooltip( null );
	}
} );

document.addEventListener( 'keydown', ( event ) => {
	if ( 'Escape' === event.key ) {
		setActiveTooltip( null );
	}
} );
