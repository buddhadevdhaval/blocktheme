( function () {
	function decodeHtml( value ) {
		const txt = document.createElement( 'textarea' );
		txt.innerHTML = value || '';
		return txt.value;
	}

	function escapeHtml( value ) {
		return ( value || '' ).replace( /[&<>"']/g, ( char ) => {
			const map = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#039;',
			};
			return map[ char ];
		} );
	}

	function buildCard( post ) {
		const title = decodeHtml( post?.title?.rendered || '' );
		const url = post?.link || '#';
		const terms = post?._embedded?.[ 'wp:term' ]?.flat?.() || [];
		const category = decodeHtml( terms?.[ 0 ]?.name || 'Category' );

		return `
			<div class="features-tabs__card">
				<div class="features-tabs__content-head">
					<div class="features-tabs__category body2-semibold">${ escapeHtml(
						category
					) }</div>
					<div class="heading-5 features-tabs__card-title">
						${ escapeHtml(
							title
						) } <div class="badge badge--blue"><i class="badge__dot"></i>Test</div>
					</div>
				</div>
				<a class="features-tabs__view-link site-btn is-style-site-text-btn has-icon icon-arrow-up" href="${ escapeHtml(
					url
				) }" aria-label="View test for ${ escapeHtml(
					title
				) }">View Test</a>
			</div>
		`;
	}

	function getApiBase() {
		if ( window?.wpApiSettings?.root ) {
			return window.wpApiSettings.root.replace( /\/$/, '' );
		}
		return `${ window.location.origin }/wp-json`;
	}

	async function loadPanelPosts( panel, termSlug ) {
		if ( ! panel || panel.dataset.loaded === '1' ) {
			return;
		}

		panel.dataset.loaded = 'loading';
		panel.innerHTML =
			'<div class="features-tabs__grid"><p>Loading...</p></div>';

		try {
			const apiBase = getApiBase();
			let termId = null;

			if ( termSlug && termSlug !== 'all' ) {
				const termRes = await fetch(
					`${ apiBase }/wp/v2/test_type?slug=${ encodeURIComponent(
						termSlug
					) }`
				);
				const termData = await termRes.json();
				termId =
					Array.isArray( termData ) && termData[ 0 ]?.id
						? Number( termData[ 0 ].id )
						: null;
			}

			let postsUrl = `${ apiBase }/wp/v2/blood-test?per_page=100&_embed=wp:term`;
			if ( termId ) {
				postsUrl += `&test_type=${ termId }`;
			}
			if ( termSlug && termSlug !== 'all' && ! termId ) {
				postsUrl = `${ apiBase }/wp/v2/blood-test?per_page=1&include=0`;
			}

			const postsRes = await fetch( postsUrl );
			const posts = await postsRes.json();

			if ( ! Array.isArray( posts ) || posts.length === 0 ) {
				panel.innerHTML =
					'<div class="features-tabs__grid"><p>No posts found for this tab.</p></div>';
				panel.dataset.loaded = '1';
				return;
			}

			panel.innerHTML = `<div class="features-tabs__grid">${ posts
				.map( buildCard )
				.join( '' ) }</div>`;
			panel.dataset.loaded = '1';
		} catch ( error ) {
			panel.innerHTML =
				'<div class="features-tabs__grid"><p>Unable to load posts.</p></div>';
			panel.dataset.loaded = '0';
		}
	}

	function initTabs( container ) {
		if ( ! container ) {
			return;
		}
		const tabs = Array.from(
			container.querySelectorAll( '.tabs__tab[data-tab-target]' )
		);
		const panels = Array.from(
			container.querySelectorAll( '.tabs__panel' )
		);

		if ( ! tabs.length || ! panels.length ) {
			return;
		}

		const activateTab = ( target ) => {
			tabs.forEach( ( tab ) => {
				tab.classList.toggle(
					'is-active',
					tab.dataset.tabTarget === target
				);
			} );

			panels.forEach( ( panel ) => {
				panel.classList.toggle( 'is-active', panel.id === target );
			} );

			const activePanel = panels.find( ( panel ) => panel.id === target );
			loadPanelPosts( activePanel, target );
		};

		let activeTarget = tabs.find( ( tab ) =>
			tab.classList.contains( 'is-active' )
		)?.dataset.tabTarget;
		if ( ! activeTarget && tabs[ 0 ] ) {
			activeTarget = tabs[ 0 ].dataset.tabTarget;
		}
		if ( activeTarget ) {
			activateTab( activeTarget );
		}

		tabs.forEach( ( tab ) => {
			tab.addEventListener( 'click', ( event ) => {
				event.preventDefault();
				activateTab( tab.dataset.tabTarget || '' );
			} );
		} );
	}

	document.querySelectorAll( '.tabs-content' ).forEach( initTabs );
} )();
