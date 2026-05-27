document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll( '.test-catalog-with-table-block' );

	blocks.forEach( ( block ) => {
		const searchInput = block.querySelector( '.genes-table__search-input' );
		const resultsWrap = block.querySelector( '.catlouge-search-results-wrap' );
		const resultNode = block.querySelector( '.catlouge-search-result' );
		const resultGrid = block.querySelector( '.catlouge-search-result-grid' );
		const nav = block.querySelector( '.tabs__nav' );
		const select = block.querySelector( '.tabs__select' );
		const buttons = Array.from( block.querySelectorAll( '.tabs__tab' ) );
		const panels = Array.from( block.querySelectorAll( '.tabs__panel' ) );
		const sourceCards = Array.from(
			block.querySelectorAll( '.tabs__panel .cardiology-filter__card[data-search-text]' )
		);

		if ( nav ) {
			const activateTab = ( targetId ) => {
				buttons.forEach( ( button ) => {
					const isActive =
						button.getAttribute( 'data-tab-target' ) === targetId;
					button.classList.toggle( 'is-active', isActive );
					button.setAttribute( 'aria-selected', isActive ? 'true' : 'false' );
				} );
				panels.forEach( ( panel ) => {
					const isActive = panel.id === targetId;
					panel.classList.toggle( 'is-active', isActive );
					panel.hidden = ! isActive;
				} );
				if ( select ) {
					select.value = targetId;
				}
			};

			buttons.forEach( ( button ) => {
				button.addEventListener( 'click', () => {
					activateTab( button.getAttribute( 'data-tab-target' ) || '' );
				} );
			} );

			if ( select ) {
				select.addEventListener( 'change', ( event ) => {
					activateTab( event.target.value );
				} );
			}
		}

		if ( ! searchInput ) {
			return;
		}

		const updateResults = () => {
			const query = searchInput.value.trim().toLowerCase();
			const matches = sourceCards.filter( ( card ) =>
				( card.dataset.searchText || '' ).includes( query )
			);

			if ( ! resultNode || ! resultGrid ) {
				return;
			}

			if ( ! query ) {
				resultNode.textContent = '';
				resultGrid.innerHTML = '';
				if ( resultsWrap ) {
					resultsWrap.hidden = true;
				}
				return;
			}

			if ( resultsWrap ) {
				resultsWrap.hidden = false;
			}

			resultNode.textContent = matches.length
				? `${ matches.length } featured test(s) matched "${ query }".`
				: `No featured tests matched "${ query }".`;

			resultGrid.innerHTML = '';
			matches.forEach( ( card ) => {
				resultGrid.appendChild( card.cloneNode( true ) );
			} );
		};

		searchInput.addEventListener( 'input', updateResults );
		searchInput.addEventListener( 'search', updateResults );
	} );
} );
