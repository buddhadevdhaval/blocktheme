document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll(
		'.test-catalog-with-table-block'
	);

	const normalizeValue = ( value ) =>
		String( value || '' )
			.toLowerCase()
			.replace( /[^a-z0-9]+/g, ' ' )
			.trim();

	const matchesQuery = ( element, query ) => {
		const normalizedQuery = normalizeValue( query );

		if ( ! normalizedQuery ) {
			return false;
		}

		const searchFields = [
			element.dataset.searchText,
			element.dataset.searchTitle,
			element.dataset.searchGenes,
		]
			.map( normalizeValue )
			.filter( Boolean );

		if (
			searchFields.some(
				( fieldValue ) =>
					fieldValue === normalizedQuery ||
					fieldValue.startsWith( normalizedQuery ) ||
					fieldValue.includes( normalizedQuery )
			)
		) {
			return true;
		}

		const queryTokens = normalizedQuery.split( /\s+/ ).filter( Boolean );

		if ( ! queryTokens.length ) {
			return false;
		}

		return queryTokens.every( ( token ) =>
			searchFields.some( ( fieldValue ) =>
				fieldValue
					.split( /\s+/ )
					.some( ( fieldToken ) => fieldToken.includes( token ) || ( fieldToken.length >= 2 && token.includes( fieldToken ) ) )
			)
		);
	};

	blocks.forEach( ( block ) => {
		const searchInput = block.querySelector( '.genes-table__search-input' );
		const nav = block.querySelector( '.tabs__nav' );
		const select = block.querySelector( '.tabs__select' );
		const buttons = Array.from( block.querySelectorAll( '.tabs__tab' ) );
		const panels = Array.from( block.querySelectorAll( '.tabs__panel' ) );

		if ( nav ) {
			const activateTab = ( targetId ) => {
				buttons.forEach( ( button ) => {
					const isActive =
						button.getAttribute( 'data-tab-target' ) === targetId;
					button.classList.toggle( 'is-active', isActive );
					button.setAttribute(
						'aria-selected',
						isActive ? 'true' : 'false'
					);
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
					activateTab(
						button.getAttribute( 'data-tab-target' ) || ''
					);
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

		const resultsWrap = block.querySelector(
			'.catlouge-search-results-wrap'
		);
		const resultNode = block.querySelector( '.catlouge-search-result' );
		const resultGrid = block.querySelector(
			'.catlouge-search-result-grid'
		);
		const sourceCards = Array.from(
			block.querySelectorAll(
				'.tabs__panel .cardiology-filter__card[data-search-text]'
			)
		);

		const updateResults = () => {
			if ( ! resultNode || ! resultGrid ) {
				return;
			}

			const query = searchInput.value.trim();

			if ( ! query ) {
				resultNode.textContent = '';
				resultGrid.innerHTML = '';
				if ( resultsWrap ) {
					resultsWrap.hidden = true;
				}
				return;
			}

			const seenKeys = new Set();
			const uniqueMatches = [];

			sourceCards.forEach( ( card ) => {
				if ( matchesQuery( card, query ) ) {
					const cardKey =
						card.dataset.productId ||
						card
							.querySelector( '.cardiology-filter__card-name' )
							?.textContent?.trim() ||
						card.dataset.searchTitle;

					if ( cardKey && ! seenKeys.has( cardKey ) ) {
						seenKeys.add( cardKey );
						uniqueMatches.push( card );
					}
				}
			} );

			if ( resultsWrap ) {
				resultsWrap.hidden = false;
			}

			resultGrid.innerHTML = '';
			if ( ! uniqueMatches.length ) {
				resultNode.textContent = `No featured tests matched "${ query }".`;
				return;
			}

			resultNode.textContent = `${ uniqueMatches.length } featured test(s) matched "${ query }".`;
			uniqueMatches.forEach( ( card ) => {
				resultGrid.appendChild( card.cloneNode( true ) );
			} );
		};

		searchInput.addEventListener( 'input', updateResults );
		searchInput.addEventListener( 'search', updateResults );
	} );
} );
