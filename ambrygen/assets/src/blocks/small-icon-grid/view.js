( function () {
	const BLOCK_SELECTOR = '.wp-block-ambrygen-small-icon-grid';
	const TOOLTIP_SELECTOR = '.ambrygen-tooltip';

	function getBlockNodes() {
		return Array.from( document.querySelectorAll( BLOCK_SELECTOR ) );
	}

	function setActiveTooltip( blockNode, activeNode ) {
		if ( ! blockNode ) {
			return;
		}

		blockNode.querySelectorAll( TOOLTIP_SELECTOR ).forEach( ( node ) => {
			node.classList.toggle( 'is-tooltip-active', node === activeNode );
		} );
	}

	function closeTooltips( activeBlockNode = null ) {
		getBlockNodes().forEach( ( blockNode ) => {
			if ( blockNode !== activeBlockNode ) {
				setActiveTooltip( blockNode, null );
			}
		} );
	}

	document.addEventListener( 'click', ( event ) => {
		const blockNode = event.target.closest( BLOCK_SELECTOR );
		const tooltipNode = event.target.closest( TOOLTIP_SELECTOR );

		if ( ! blockNode || ! tooltipNode ) {
			closeTooltips();
			return;
		}

		const isMobile = window.matchMedia(
			'(hover: none), (pointer: coarse)'
		).matches;
		const isActive = tooltipNode.classList.contains( 'is-tooltip-active' );

		closeTooltips( blockNode );

		if ( isMobile ) {
			event.preventDefault();
			event.stopPropagation();
			setActiveTooltip( blockNode, isActive ? null : tooltipNode );
		} else {
			setActiveTooltip( blockNode, null );
		}
	} );

	document.addEventListener( 'keydown', ( event ) => {
		if ( 'Escape' === event.key ) {
			closeTooltips();
		}
	} );
} )();
