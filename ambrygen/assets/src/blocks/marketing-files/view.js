document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll( '.marketing-files' );

	blocks.forEach( ( block ) => {
		const items = Array.from(
			block.querySelectorAll( '.test-catlouge__item' )
		);

		items.forEach( ( item ) => {
			const toggle = item.querySelector( '.test-catlouge__item-toggle' );
			const content = item.querySelector( '.test-catlouge__item-content' );

			if ( ! toggle || ! content ) {
				return;
			}

			toggle.addEventListener( 'click', () => {
				const isOpen = item.classList.contains( 'is-open' );

				item.classList.toggle( 'is-open', ! isOpen );
				toggle.setAttribute(
					'aria-expanded',
					isOpen ? 'false' : 'true'
				);

				if ( isOpen ) {
					content.style.maxHeight = '0px';
				} else {
					content.style.maxHeight = `${ content.scrollHeight }px`;
				}
			} );
		} );
	} );
} );
