document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll( '.test-catalog-block' );

	blocks.forEach( ( block ) => {
		const endpoint = block.dataset.trackEndpoint || '';
		const clickEndpoint = block.dataset.clickEndpoint || '';
		const pageId = block.dataset.pageId || '';
		const pageTitle = block.dataset.pageTitle || '';
		const pagePath = block.dataset.pagePath || '';
		const nav = block.querySelector( '.tabs__nav' );
		const select = block.querySelector( '.tabs__select' );
		const buttons = Array.from( block.querySelectorAll( '.tabs__tab' ) );
		const panels = Array.from( block.querySelectorAll( '.tabs__panel' ) );
		const trackingLinks = Array.from(
			block.querySelectorAll(
				'.test-catlouge__link[data-material-id][data-file-id]'
			)
		);

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
				panel.hidden = ! isActive;
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

		if ( endpoint && typeof fetch === 'function' && trackingLinks.length ) {
			const storagePrefix = 'ambrygen:mm:view:';
			const dedupe = new Set();
			const payloadItems = [];
			const nowKey = new Date().toISOString().slice( 0, 10 );

			trackingLinks.forEach( ( link ) => {
				const materialId = link.getAttribute( 'data-material-id' );
				const fileId = link.getAttribute( 'data-file-id' );
				const dedupeKey = [ pageId || pagePath, materialId, fileId ].join(
					':'
				);
				const storageKey = `${ storagePrefix }${ nowKey }:${ dedupeKey }`;

				if (
					! materialId ||
					! fileId ||
					dedupe.has( dedupeKey )
				) {
					return;
				}

				dedupe.add( dedupeKey );

				try {
					if (
						window.localStorage &&
						window.localStorage.getItem( storageKey )
					) {
						return;
					}
				} catch ( error ) {}

				payloadItems.push( {
					material_id: Number( materialId ),
					file_id: Number( fileId ),
				} );

				try {
					if ( window.localStorage ) {
						window.localStorage.setItem( storageKey, '1' );
					}
				} catch ( error ) {}
			} );

			if ( payloadItems.length ) {
				fetch( endpoint, {
					method: 'POST',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify( {
						page_id: Number( pageId ) || 0,
						page_title: pageTitle,
						page_path: pagePath,
						items: payloadItems,
					} ),
					keepalive: true,
				} ).catch( () => {} );
			}
		}

		if ( clickEndpoint && typeof fetch === 'function' && trackingLinks.length ) {
			trackingLinks.forEach( ( link ) => {
				link.addEventListener( 'click', () => {
					const materialId = Number(
						link.getAttribute( 'data-material-id' )
					);
					const fileId = Number( link.getAttribute( 'data-file-id' ) );

					if ( ! materialId || ! fileId ) {
						return;
					}

					fetch( clickEndpoint, {
						method: 'POST',
						credentials: 'same-origin',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify( {
							material_id: materialId,
							file_id: fileId,
							page_id: Number( pageId ) || 0,
							page_title: pageTitle,
							page_path: pagePath,
						} ),
						keepalive: true,
					} ).catch( () => {} );
				} );
			} );
		}
	} );
} );
