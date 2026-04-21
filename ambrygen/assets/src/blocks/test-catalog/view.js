document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll( '.test-catalog-block' );

	blocks.forEach( ( block ) => {
		const nav = block.querySelector( '.tabs__nav' );
		const select = block.querySelector( '.tabs__select' );
		const buttons = Array.from( block.querySelectorAll( '.tabs__tab' ) );
		const panels = Array.from( block.querySelectorAll( '.tabs__panel' ) );
		const items = Array.from( block.querySelectorAll( '.test-catlouge__item' ) );

		const activateTab = ( targetId ) => {
			if ( ! targetId ) {
				return;
			}

			buttons.forEach( ( button ) => {
				const isActive =
					button.getAttribute( 'data-tab-target' ) === targetId;
				button.classList.toggle( 'is-active', isActive );
				button.classList.toggle( 'active', isActive );
				button.setAttribute(
					'aria-selected',
					isActive ? 'true' : 'false'
				);
			} );

			panels.forEach( ( panel ) => {
				const isActive = panel.id === targetId;
				panel.classList.toggle( 'is-active', isActive );
				panel.classList.toggle( 'active', isActive );
			} );

			if ( select ) {
				select.value = targetId;
			}
		};

		if ( nav ) {
			buttons.forEach( ( button ) => {
				button.addEventListener( 'click', () => {
					activateTab(
						button.getAttribute( 'data-tab-target' ) || ''
					);
				} );
			} );
		}

		if ( select ) {
			select.addEventListener( 'change', ( event ) => {
				activateTab( event.target.value );
			} );
		}

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
