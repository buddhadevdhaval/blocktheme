import Swiper from 'swiper/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function parseHtmlDocument( html ) {
	const parser = new window.DOMParser();
	return parser.parseFromString( String( html || '' ), 'text/html' );
}

function sanitizeHtmlFragment( html, options = {} ) {
	const {
		allowedTags = [
			'A',
			'ARTICLE',
			'B',
			'BR',
			'BUTTON',
			'DIV',
			'EM',
			'FIGCAPTION',
			'FIGURE',
			'H1',
			'H2',
			'H3',
			'H4',
			'H5',
			'H6',
			'HR',
			'I',
			'IMG',
			'INPUT',
			'LABEL',
			'LI',
			'NAV',
			'OL',
			'OPTION',
			'P',
			'PATH',
			'PICTURE',
			'SOURCE',
			'SMALL',
			'SPAN',
			'STRONG',
			'SECTION',
			'SELECT',
			'SUP',
			'SUB',
			'SVG',
			'TEXTAREA',
			'TIME',
			'UL',
		],
		allowedAttrs = [
			'abbr',
			'accept',
			'action',
			'alt',
			'aria-controls',
			'aria-current',
			'aria-describedby',
			'aria-expanded',
			'aria-hidden',
			'aria-label',
			'aria-labelledby',
			'aria-live',
			'aria-modal',
			'aria-pressed',
			'aria-roledescription',
			'checked',
			'class',
			'data-*',
			'decoding',
			'disabled',
			'for',
			'height',
			'href',
			'id',
			'loading',
			'max',
			'method',
			'min',
			'name',
			'placeholder',
			'role',
			'rel',
			'sizes',
			'src',
			'srcset',
			'step',
			'target',
			'title',
			'type',
			'value',
			'viewBox',
			'width',
		],
		allowedProtocols = /^(https?:|mailto:|tel:|#|\/)/i,
	} = options;

	const allowedTagSet = new Set( allowedTags );
	const wildcardAttrs = allowedAttrs.filter( ( attr ) =>
		attr.endsWith( '*' )
	);
	const fixedAttrs = new Set(
		allowedAttrs.filter( ( attr ) => ! attr.endsWith( '*' ) )
	);
	const doc = parseHtmlDocument( `<div>${ html || '' }</div>` );
	const root = doc.body.firstElementChild;

	const isAllowedAttr = ( name ) =>
		fixedAttrs.has( name ) ||
		wildcardAttrs.some( ( pattern ) =>
			name.startsWith( pattern.slice( 0, -1 ) )
		);

	const walk = ( node ) => {
		if ( node.nodeType === Node.ELEMENT_NODE ) {
			const el = /** @type {Element} */ ( node );

			if ( ! allowedTagSet.has( el.tagName ) ) {
				const parent = el.parentNode;
				if ( parent ) {
					while ( el.firstChild ) {
						parent.insertBefore( el.firstChild, el );
					}
					parent.removeChild( el );
				}
				return;
			}

			[ ...el.attributes ].forEach( ( attr ) => {
				const name = attr.name.toLowerCase();
				const value = attr.value || '';

				if ( name === 'style' || name.startsWith( 'on' ) ) {
					el.removeAttribute( attr.name );
					return;
				}

				if ( ! isAllowedAttr( name ) ) {
					el.removeAttribute( attr.name );
					return;
				}

				if (
					[ 'href', 'src', 'action', 'formaction' ].includes(
						name
					) &&
					value &&
					! allowedProtocols.test( value )
				) {
					el.removeAttribute( attr.name );
				}
			} );
		}

		[ ...node.childNodes ].forEach( walk );
	};

	if ( root ) {
		[ ...root.childNodes ].forEach( walk );
	}

	const fragment = document.createDocumentFragment();
	while ( root?.firstChild ) {
		fragment.appendChild( root.firstChild );
	}

	return fragment;
}

function replaceWithSanitizedHtml( element, html, options ) {
	if ( ! element ) {
		return;
	}

	element.replaceChildren( sanitizeHtmlFragment( html, options ) );
}

function appendSanitizedHtml( element, html, options ) {
	if ( ! element ) {
		return;
	}

	element.appendChild( sanitizeHtmlFragment( html, options ) );
}

function replaceElementWithSanitizedHtml( element, html, options ) {
	if ( ! element || ! element.parentNode ) {
		return;
	}

	element.replaceWith( sanitizeHtmlFragment( html, options ) );
}

function initTooltips() {
	const tooltipSelector = '.ambrygen-tooltip';
	const isTouchDevice = window.matchMedia(
		'(hover: none), (pointer: coarse)'
	).matches;

	function decodeHtmlEntities( value ) {
		if ( ! value ) {
			return '';
		}
		const textarea = document.createElement( 'textarea' );
		textarea.innerHTML = String( value );
		return textarea.value;
	}

	function decodeBase64Unicode( value ) {
		if ( ! value ) {
			return '';
		}

		try {
			const binary = window.atob( String( value ) );
			const bytes = Array.from(
				binary,
				( c ) =>
					'%' + c.charCodeAt( 0 ).toString( 16 ).padStart( 2, '0' )
			).join( '' );
			return decodeURIComponent( bytes );
		} catch ( e ) {
			return '';
		}
	}

	function encodeBase64Unicode( value ) {
		if ( ! value ) {
			return '';
		}

		const utf8 = encodeURIComponent( String( value ) ).replace(
			/%([0-9A-F]{2})/g,
			( match, hex ) => String.fromCharCode( parseInt( hex, 16 ) )
		);
		return window.btoa( utf8 );
	}

	function stripHtmlText( html ) {
		if ( ! html ) {
			return '';
		}
		return String( html )
			.replace( /<[^>]*>/g, '' )
			.replace( /&nbsp;/g, ' ' )
			.trim();
	}

	function normalizeTooltipId( value ) {
		return String( value || '' )
			.trim()
			.toLowerCase()
			.replace( /['"]/g, '' )
			.replace( /[^a-z0-9_-]+/g, '-' )
			.replace( /_+/g, '-' )
			.replace( /-+/g, '-' )
			.replace( /^-+|-+$/g, '' );
	}

	function sanitizeInlineTooltipMarkup( html ) {
		if ( ! html ) {
			return '';
		}

		const allowedTags = new Set( [
			'A',
			'B',
			'BR',
			'DIV',
			'EM',
			'I',
			'P',
			'SPAN',
			'STRONG',
			'SUP',
		] );
		const allowedAttrs = new Set( [
			'class',
			'title',
			'data-tooltip',
			'data-tooltip-title',
			'href',
			'target',
			'rel',
		] );

		const template = parseHtmlDocument( `<div>${ html }</div>` ).body
			.firstElementChild;

		const walk = ( node ) => {
			if ( node.nodeType === Node.ELEMENT_NODE ) {
				const el = /** @type {Element} */ ( node );

				if ( ! allowedTags.has( el.tagName ) ) {
					const parent = el.parentNode;
					if ( parent ) {
						while ( el.firstChild ) {
							parent.insertBefore( el.firstChild, el );
						}
						parent.removeChild( el );
					}
					return;
				}

				[ ...el.attributes ].forEach( ( attr ) => {
					if ( ! allowedAttrs.has( attr.name.toLowerCase() ) ) {
						el.removeAttribute( attr.name );
					}
				} );
			}

			[ ...node.childNodes ].forEach( walk );
		};

		if ( template ) {
			[ ...template.childNodes ].forEach( walk );
		}

		return template ? template.innerHTML : '';
	}

	function hydrateEscapedTooltips() {
		const roots = document.querySelectorAll(
			'.block-description, .entry-content, .wp-block-post-content, .wp-block-post-content__content'
		);

		roots.forEach( ( root ) => {
			const walker = document.createTreeWalker(
				root,
				NodeFilter.SHOW_TEXT,
				null
			);

			const textNodes = [];
			while ( walker.nextNode() ) {
				const node = walker.currentNode;
				const text = node && node.nodeValue ? node.nodeValue : '';
				if (
					text &&
					text.includes( '&lt;' ) &&
					text.includes( 'ambrygen-tooltip' )
				) {
					textNodes.push( node );
				}
			}

			textNodes.forEach( ( node ) => {
				const raw = node.nodeValue || '';
				const decoded = decodeHtmlEntities( raw );
				if ( ! decoded.includes( 'ambrygen-tooltip' ) ) {
					return;
				}

				const safeHtml = sanitizeInlineTooltipMarkup( decoded );
				if ( ! safeHtml ) {
					return;
				}

				node.parentNode.replaceChild(
					sanitizeHtmlFragment( safeHtml, {
						allowedTags: [
							'A',
							'B',
							'BR',
							'DIV',
							'EM',
							'I',
							'P',
							'SPAN',
							'STRONG',
							'SUP',
						],
						allowedAttrs: [
							'class',
							'title',
							'data-tooltip',
							'data-tooltip-title',
							'href',
							'target',
							'rel',
						],
					} ),
					node
				);
			} );
		} );
	}

	function sanitizeTooltipFragment( html ) {
		if ( ! html ) {
			return document.createDocumentFragment();
		}

		// Tooltips are stored inside an HTML attribute, so editors often encode tags (e.g. &lt;em&gt;).
		// Decode once here so allowed tags can actually render.
		html = decodeHtmlEntities( html );

		const allowedTags = [
			'A',
			'B',
			'BR',
			'DIV',
			'EM',
			'I',
			'LI',
			'OL',
			'P',
			'SMALL',
			'SPAN',
			'STRONG',
			'SUP',
			'UL',
		];
		const fragment = sanitizeHtmlFragment( html, {
			allowedTags,
			allowedAttrs: [ 'href', 'target', 'rel' ],
		} );

		fragment.querySelectorAll?.( 'a[target="_blank"]' ).forEach( ( el ) => {
			el.setAttribute( 'rel', 'noopener noreferrer' );
		} );

		return fragment;
	}

	// Convert tooltip data attributes to div elements
	function initializeTooltipDivs() {
		document.querySelectorAll( tooltipSelector ).forEach( ( node ) => {
			// Skip if already has tooltip content div
			if ( node.querySelector( '.ambrygen-tooltip__content' ) ) {
				return;
			}

			// Create tooltip content div if tooltip content exists
			let tooltipB64 = node.getAttribute( 'data-tooltip-b64' );
			const tooltipIdRaw = node.getAttribute( 'data-tooltip-id' );
			const tooltipId = normalizeTooltipId( tooltipIdRaw );
			const rawTooltipAttr = node.getAttribute( 'data-tooltip' ) || '';

			// Auto-repair legacy markup that stored HTML directly in `data-tooltip`.
			// If HTML is detected and no b64 exists, migrate it to b64 and keep `data-tooltip` as plain text.
			if (
				rawTooltipAttr.includes( '<' ) &&
				rawTooltipAttr.includes( '>' )
			) {
				if ( ! tooltipB64 ) {
					tooltipB64 = encodeBase64Unicode( rawTooltipAttr );
					node.setAttribute( 'data-tooltip-b64', tooltipB64 );
				}
				node.setAttribute(
					'data-tooltip',
					stripHtmlText( rawTooltipAttr )
				);
			}

			const tooltipText =
				( tooltipB64 ? decodeBase64Unicode( tooltipB64 ) : '' ) || '';

			let htmlFromId = '';
			let titleFromId = '';
			if ( tooltipId ) {
				const source = document.getElementById(
					`ambrygen-tooltip-${ tooltipId }`
				);
				if ( source ) {
					htmlFromId = source.innerHTML || '';
					titleFromId =
						source.getAttribute( 'data-tooltip-title' ) || '';
				}
			}

			const resolvedHtml =
				htmlFromId ||
				tooltipText ||
				node.getAttribute( 'data-tooltip' );
			const tooltipTitle =
				node.getAttribute( 'data-tooltip-title' ) || titleFromId || '';

			if ( resolvedHtml ) {
				const tooltipDiv = document.createElement( 'div' );
				tooltipDiv.className = 'ambrygen-tooltip__content';

				if ( tooltipTitle ) {
					const titleElement = document.createElement( 'div' );
					titleElement.className = 'ambrygen-tooltip__title';
					titleElement.textContent = tooltipTitle;
					tooltipDiv.appendChild( titleElement );
				}

				const descElement = document.createElement( 'div' );
				descElement.className = 'ambrygen-tooltip__description';
				descElement.replaceChildren(
					sanitizeTooltipFragment( resolvedHtml )
				);
				tooltipDiv.appendChild( descElement );

				node.appendChild( tooltipDiv );
			}
		} );
	}

	function ensureTooltipPlacementStyles() {
		if ( document.getElementById( 'ambrygen-tooltip-placement-styles' ) ) {
			return;
		}

		const style = document.createElement( 'style' );
		style.id = 'ambrygen-tooltip-placement-styles';
		style.textContent = `
			.ambrygen-tooltip__content[data-tooltip-placement="mobile"]::before {
				left: var(--ambrygen-tooltip-arrow-left) !important;
				right: auto !important;
				transform: none !important;
			}

			.ambrygen-tooltip__content[data-tooltip-placement="right"]::before {
				left: var(--ambrygen-tooltip-arrow-left) !important;
				right: auto !important;
				transform: none !important;
			}

			.ambrygen-tooltip__content[data-tooltip-placement="left"]::before {
				left: var(--ambrygen-tooltip-arrow-left) !important;
				right: auto !important;
				transform: none !important;
			}
		`;
		document.head.appendChild( style );
	}

	function updateTooltipPlacement( node ) {
		if ( ! node ) {
			return;
		}

		const tooltipContent = node.querySelector(
			'.ambrygen-tooltip__content'
		);
		if ( ! tooltipContent ) {
			return;
		}

		const viewportPadding = 16;
		const nodeRect = node.getBoundingClientRect();
		const triggerCenter = nodeRect.left + nodeRect.width / 2;
		const shouldOpenRight = triggerCenter < window.innerWidth / 2;
		const isMobileViewport =
			window.matchMedia( '(max-width: 480px)' ).matches;
		const isTooltipActive =
			node.matches( ':hover, :focus-visible' ) ||
			node.classList.contains( 'is-tooltip-active' );
		const translateY = isTooltipActive ? ' translateY(-2px)' : '';

		if ( isMobileViewport ) {
			const tooltipWidth = Math.min(
				320,
				window.innerWidth - viewportPadding * 2
			);
			const desiredLeft = triggerCenter - tooltipWidth / 2;
			const clampedLeft = Math.min(
				Math.max( viewportPadding, desiredLeft ),
				window.innerWidth - viewportPadding - tooltipWidth
			);
			const leftOffset = clampedLeft - nodeRect.left;
			const arrowLeft = Math.min(
				Math.max( triggerCenter - clampedLeft - 14, 8 ),
				tooltipWidth - 36
			);

			tooltipContent.style.width = `${ tooltipWidth }px`;
			tooltipContent.style.minWidth = `${ tooltipWidth }px`;
			tooltipContent.style.maxWidth = `${ tooltipWidth }px`;
			tooltipContent.style.left = `${ leftOffset }px`;
			tooltipContent.style.right = 'auto';
			tooltipContent.style.transform = `translateX(0%)${ translateY }`;
			tooltipContent.style.setProperty(
				'--ambrygen-tooltip-arrow-left',
				`${ arrowLeft }px`
			);
			tooltipContent.style.setProperty(
				'--ambrygen-tooltip-arrow-right',
				'auto'
			);
			tooltipContent.style.setProperty(
				'--ambrygen-tooltip-shift-x',
				'0%'
			);
			tooltipContent.setAttribute( 'data-tooltip-placement', 'mobile' );
			return;
		}

		const tooltipWidth = Math.min(
			320,
			window.innerWidth - viewportPadding * 2
		);
		const desiredLeft = triggerCenter - tooltipWidth / 2;
		const clampedLeft = Math.min(
			Math.max( viewportPadding, desiredLeft ),
			window.innerWidth - viewportPadding - tooltipWidth
		);
		const leftOffset = clampedLeft - nodeRect.left;
		const rightOffset = nodeRect.right - ( clampedLeft + tooltipWidth );
		const arrowLeft = Math.min(
			Math.max( triggerCenter - clampedLeft - 14, 8 ),
			tooltipWidth - 36
		);

		tooltipContent.style.width = `${ tooltipWidth }px`;
		tooltipContent.style.minWidth = `${ tooltipWidth }px`;
		tooltipContent.style.maxWidth = '320px';
		tooltipContent.style.transform = `translateX(0%)${ translateY }`;
		tooltipContent.style.setProperty( '--ambrygen-tooltip-shift-x', '0%' );

		if ( shouldOpenRight ) {
			tooltipContent.style.left = `${ leftOffset }px`;
			tooltipContent.style.right = 'auto';
			tooltipContent.style.setProperty(
				'--ambrygen-tooltip-arrow-left',
				`${ arrowLeft }px`
			);
			tooltipContent.style.setProperty(
				'--ambrygen-tooltip-arrow-right',
				'auto'
			);
			tooltipContent.setAttribute( 'data-tooltip-placement', 'right' );
			return;
		}

		tooltipContent.style.left = 'auto';
		tooltipContent.style.right = `${ rightOffset }px`;
		tooltipContent.style.setProperty(
			'--ambrygen-tooltip-arrow-left',
			`${ arrowLeft }px`
		);
		tooltipContent.style.setProperty(
			'--ambrygen-tooltip-arrow-right',
			'auto'
		);
		tooltipContent.setAttribute( 'data-tooltip-placement', 'left' );
	}

	function bindTooltipPlacement() {
		const syncTooltipPlacement = ( event ) => {
			const eventTarget =
				event.target instanceof Element ? event.target : null;
			const tooltipNode = eventTarget
				? eventTarget.closest( tooltipSelector )
				: null;
			if ( tooltipNode ) {
				updateTooltipPlacement( tooltipNode );
			}
		};

		document.addEventListener( 'mouseenter', syncTooltipPlacement, true );
		document.addEventListener( 'focusin', syncTooltipPlacement );

		window.addEventListener( 'resize', () => {
			document.querySelectorAll( tooltipSelector ).forEach( ( node ) => {
				updateTooltipPlacement( node );
			} );
		} );
	}

	function clearActiveTooltips( exceptNode = null ) {
		document.querySelectorAll( tooltipSelector ).forEach( ( node ) => {
			if ( exceptNode && node === exceptNode ) {
				return;
			}
			node.classList.remove( 'is-tooltip-active' );
		} );
	}

	document.addEventListener( 'click', ( event ) => {
		const tooltipNode = event.target.closest( tooltipSelector );

		if ( ! tooltipNode ) {
			if ( isTouchDevice ) {
				clearActiveTooltips();
			}
			return;
		}

		if ( ! isTouchDevice ) {
			return;
		}

		// Allow clicking links inside tooltip content on touch devices.
		if ( event.target.closest( '.ambrygen-tooltip__content a' ) ) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		const willActivate =
			! tooltipNode.classList.contains( 'is-tooltip-active' );
		clearActiveTooltips();
		tooltipNode.classList.toggle( 'is-tooltip-active', willActivate );
		if ( willActivate ) {
			updateTooltipPlacement( tooltipNode );
		}
	} );

	document.addEventListener( 'keydown', ( event ) => {
		if ( 'Escape' === event.key ) {
			clearActiveTooltips();
		}
	} );

	// Initialize tooltip divs on page load
	hydrateEscapedTooltips();
	initializeTooltipDivs();
	ensureTooltipPlacementStyles();
	bindTooltipPlacement();
}

( function () {
	if ( ! window.ambrygenAjax ) {
		return;
	}

	/**
	 * Main update function for conferences and webinars
	 * @param {Element} container Archive results wrapper.
	 * @param {Object}  args      Override arguments for the request.
	 */
	function updateConferenceResults( container, args = {} ) {
		const scope = container.getAttribute( 'data-ambrygen-scope' ) || '';
		const postType =
			container.getAttribute( 'data-ambrygen-post-type' ) ||
			'conferences';
		let action = 'ambrygen_conference_pagination';
		if ( postType === 'webinar' ) {
			action = 'ambrygen_webinar_pagination';
		} else if ( postType === 'post' ) {
			action = 'ambrygen_blog_pagination';
		}
		const shouldScroll = args.scroll !== undefined ? args.scroll : true;

		// Collect current state from container if not explicitly provided
		const paged =
			args.paged !== undefined
				? args.paged
				: parseInt(
						container.getAttribute( 'data-ambrygen-current' ),
						10
				  ) || 1;
		const perPage =
			args.per_page !== undefined
				? args.per_page
				: parseInt(
						container.getAttribute( 'data-ambrygen-per-page' ),
						10
				  ) || 8;
		const search =
			args.s !== undefined
				? args.s
				: container.getAttribute( 'data-ambrygen-search' ) || '';
		let year = 0;
		if ( postType !== 'post' ) {
			if ( args.year !== undefined ) {
				year = args.year || new Date().getFullYear();
			} else {
				year =
					parseInt(
						container.getAttribute( 'data-ambrygen-year' ),
						10
					) || new Date().getFullYear();
			}
		}

		const tag =
			args.tag !== undefined
				? args.tag
				: parseInt(
						container.getAttribute( 'data-ambrygen-tag' ),
						10
				  ) || 0;

		const category =
			args.category !== undefined
				? args.category
				: parseInt(
						container.getAttribute( 'data-ambrygen-category' ),
						10
				  ) || 0;

		const formData = new FormData();
		formData.append( 'action', action );
		formData.append( 'nonce', window.ambrygenAjax.nonce );
		formData.append( 'scope', scope );
		formData.append( 'paged', String( paged ) );
		formData.append( 'per_page', String( perPage ) );
		if ( search ) {
			formData.append( 's', search );
		}
		if ( year ) {
			formData.append( 'year', String( year ) );
		}
		if ( tag ) {
			formData.append( 'tag', String( tag ) );
		}
		if ( category ) {
			formData.append( 'category', String( category ) );
		}

		container.classList.add( 'is-loading' );

		fetch( window.ambrygenAjax.ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			body: formData,
		} )
			.then( ( response ) => response.json() )
			.then( ( result ) => {
				if ( ! result?.success || ! result?.data?.html ) {
					return;
				}

				const content = container.querySelector(
					'.ambrygen-ajax-pagination__content'
				);
				if ( content ) {
					if ( args.load_more ) {
						const grid = content.querySelector(
							'.event-carousel__grid, .blog-listing'
						);
						if ( grid ) {
							const temp = document.createElement( 'div' );
							appendSanitizedHtml( temp, result.data.html );
							const newGrid = temp.querySelector(
								'.event-carousel__grid, .blog-listing'
							);
							if ( newGrid ) {
								appendSanitizedHtml( grid, newGrid.innerHTML );
							}
						}
					} else {
						replaceWithSanitizedHtml( content, result.data.html );
					}

					// Scroll to top of section if requested
					if ( shouldScroll && ! args.load_more ) {
						container.scrollIntoView( {
							behavior: 'smooth',
							block: 'start',
						} );
					}
				}

				// Update data attributes to persist state
				container.setAttribute(
					'data-ambrygen-current',
					String( result.data.current || paged )
				);
				container.setAttribute(
					'data-ambrygen-per-page',
					String( result.data.per_page || perPage )
				);

				if ( result.data.total_pages !== undefined ) {
					container.setAttribute(
						'data-ambrygen-total-pages',
						String( result.data.total_pages )
					);

					// Hide pagination if only 1 page
					const paginationRow = container.querySelector(
						'.pagination-buttons-row'
					);
					if ( paginationRow ) {
						paginationRow.style.display =
							result.data.total_pages <= 1 ? 'none' : '';
					}

					// Update Load More button visibility
					const loadMoreWrap = container.querySelector(
						'.load-more-btn, .load-more-btn-wrap, .load-more-wrap'
					);
					if ( loadMoreWrap ) {
						const current = parseInt(
							result.data.current || paged,
							10
						);
						const total = parseInt( result.data.total_pages, 10 );

						if ( current >= total ) {
							loadMoreWrap.classList.add( 'is-hidden' );
							loadMoreWrap.style.display = 'none';
						} else {
							loadMoreWrap.classList.remove( 'is-hidden' );
							loadMoreWrap.style.display = 'flex';
							// Update data attribute on either the wrapper or the button inside it
							loadMoreWrap.setAttribute(
								'data-total-pages',
								total
							);
							const btn = loadMoreWrap.querySelector( 'button' );
							if ( btn ) {
								btn.setAttribute( 'data-total-pages', total );
							}
						}
					}
				}

				if ( search ) {
					container.setAttribute( 'data-ambrygen-search', search );
				} else {
					container.removeAttribute( 'data-ambrygen-search' );
				}

				if ( result.data.year ) {
					container.setAttribute(
						'data-ambrygen-year',
						String( result.data.year )
					);

					// Update Year Dropdown UI if it's external to the content area
					if ( scope === 'past' ) {
						const yearBtnId =
							postType === 'webinar'
								? 'webinar-dropdown-btn'
								: 'category-dropdown-btn';
						const yearBtn = document.getElementById( yearBtnId );
						if ( yearBtn ) {
							yearBtn.textContent = result.data.year;
						}

						const yearMenuId =
							postType === 'webinar'
								? 'webinar-dropdown-menu-past'
								: 'category-dropdown-menu-past';
						const yearMenu = document.getElementById( yearMenuId );
						if ( yearMenu ) {
							yearMenu
								.querySelectorAll( 'a' )
								.forEach( ( link ) => {
									if (
										link.textContent.trim() ===
										String( result.data.year )
									) {
										link.setAttribute(
											'aria-current',
											'page'
										);
									} else {
										link.removeAttribute( 'aria-current' );
									}
								} );
						}
					}
				} else {
					container.removeAttribute( 'data-ambrygen-year' );
				}

				if ( tag ) {
					container.setAttribute(
						'data-ambrygen-tag',
						String( tag )
					);
				} else {
					container.removeAttribute( 'data-ambrygen-tag' );
				}

				if ( category ) {
					container.setAttribute(
						'data-ambrygen-category',
						String( category )
					);
				} else {
					container.removeAttribute( 'data-ambrygen-category' );
				}

				if ( ! args.load_more ) {
					hydrateInitialPagination( container );
				}
			} )
			.catch( () => {} )
			.finally( () => {
				container.classList.remove( 'is-loading' );
			} );
	}

	function getPageFromLink( link, container ) {
		if ( link.dataset.ambrygenPage ) {
			return parseInt( link.dataset.ambrygenPage, 10 );
		}

		const href = link.getAttribute( 'href' ) || '';
		const match = href.match( /(?:query-\d+-page|paged|page)=(\d+)/ );
		if ( match ) {
			return parseInt( match[ 1 ], 10 );
		}

		const text = ( link.textContent || '' ).trim();
		if ( /^\d+$/.test( text ) ) {
			return parseInt( text, 10 );
		}

		const current = parseInt(
			container.getAttribute( 'data-ambrygen-current' ) || '1',
			10
		);
		if (
			link.classList.contains( 'pagination__nav--prev' ) ||
			link.id?.includes( 'prev' )
		) {
			return Math.max( 1, current - 1 );
		}
		if (
			link.classList.contains( 'pagination__nav--next' ) ||
			link.id?.includes( 'next' )
		) {
			const totalPages = parseInt(
				container.getAttribute( 'data-ambrygen-total-pages' ) || '1',
				10
			);
			return Math.min( totalPages, current + 1 );
		}

		return null;
	}

	function handleConferenceActions( event ) {
		// 1. Pagination Link Click
		const link = event.target.closest(
			'.pagination__link, .pagination__nav, .page-numbers, .pagination-list button, .arrow-btn, .wp-block-query-pagination a'
		);
		if ( link ) {
			const container = link.closest( '.ambrygen-ajax-pagination' );
			if ( container ) {
				event.preventDefault();
				const page = getPageFromLink( link, container );
				if ( page ) {
					updateConferenceResults( container, { paged: page } );
				}
				return;
			}
		}

		// 2. Dropdown Selection (Year OR Per-Page)
		const dropdownLink = event.target.closest(
			'.tab-dropdown .dropdown-menu a'
		);
		if ( dropdownLink ) {
			let container = dropdownLink.closest( '.ambrygen-ajax-pagination' );
			const menu = dropdownLink.closest( '.dropdown-menu' );

			// If container not found (e.g. Year dropdown is outside results), look in parent wrapper
			if ( ! container ) {
				const wrapper = dropdownLink.closest(
					'.event-carousel, .latest-blogs'
				);
				container = wrapper
					? wrapper.querySelector( '.ambrygen-ajax-pagination' )
					: null;
			}

			if ( container && menu ) {
				event.preventDefault();
				const text = dropdownLink.textContent || '';
				const match = text.match( /(\d+)/ );

				if (
					match ||
					text.toLowerCase() === 'all years' ||
					dropdownLink.hasAttribute( 'data-tag-id' ) ||
					dropdownLink.hasAttribute( 'data-category-id' )
				) {
					let newVal = match ? parseInt( match[ 1 ], 10 ) : 0;
					if ( dropdownLink.hasAttribute( 'data-tag-id' ) ) {
						newVal = parseInt(
							dropdownLink.getAttribute( 'data-tag-id' ),
							10
						);
					} else if (
						dropdownLink.hasAttribute( 'data-category-id' )
					) {
						newVal = parseInt(
							dropdownLink.getAttribute( 'data-category-id' ),
							10
						);
					}
					// Case A: Per-Page Dropdown
					if ( menu.id && menu.id.endsWith( '-perpage' ) ) {
						const currentPaged = parseInt(
							container.getAttribute( 'data-ambrygen-current' ) ||
								'1',
							10
						);
						const currentPerPage = parseInt(
							container.getAttribute(
								'data-ambrygen-per-page'
							) || '8',
							10
						);

						// Calculate which page in the new "grid" contains the first item of the current view
						const currentStartOffset =
							( currentPaged - 1 ) * currentPerPage;
						const newPaged =
							Math.floor( currentStartOffset / newVal ) + 1;

						updateConferenceResults( container, {
							per_page: newVal,
							paged: newPaged,
						} );
					}
					// Case B: Year Dropdown
					else if (
						menu.id === 'category-dropdown-menu-past' ||
						menu.id === 'webinar-dropdown-menu-past'
					) {
						updateConferenceResults( container, {
							year: newVal,
							paged: 1,
							scroll: false,
						} );
					}
					// Case C: Blog Tag Dropdown
					else if ( menu.id === 'blog-tag-dropdown-menu' ) {
						updateConferenceResults( container, {
							tag: newVal,
							paged: 1,
							scroll: false,
						} );
					}

					// Update the toggle button text
					const toggle =
						menu.parentElement.querySelector( '.dropdown-toggle' );
					if ( toggle ) {
						toggle.textContent = text;
					}
				}
				return;
			}
		}

		// 4. Tab Button Click (Tag/Category filter)
		const tabBtn = event.target.closest( '.tab-button' );
		if ( tabBtn ) {
			const container = tabBtn
				.closest( '.event-carousel, .latest-blogs' )
				?.querySelector( '.ambrygen-ajax-pagination' );
			if ( container ) {
				event.preventDefault();
				const tagId = parseInt(
					tabBtn.getAttribute( 'data-tag-id' ) || '0',
					10
				);
				const categoryId = parseInt(
					tabBtn.getAttribute( 'data-category-id' ) || '0',
					10
				);

				const updateArgs = { paged: 1 };
				if ( tabBtn.hasAttribute( 'data-tag-id' ) ) {
					updateArgs.tag = tagId;
				}
				if ( tabBtn.hasAttribute( 'data-category-id' ) ) {
					updateArgs.category = categoryId;
				}

				updateConferenceResults( container, updateArgs );

				// Update tab state classes for conference filters
				const parent = tabBtn.closest( '.horizontal-tabs' );
				if ( parent ) {
					parent
						.querySelectorAll( '.tab-button' )
						.forEach( ( btn ) => {
							btn.classList.remove( 'active', 'is-active' );
							btn.setAttribute( 'aria-selected', 'false' );
						} );
					tabBtn.classList.add( 'active', 'is-active' );
					tabBtn.setAttribute( 'aria-selected', 'true' );
				}

				const mobileSelect = tabBtn
					.closest( '.category-filter-search__tabs' )
					?.querySelector( '.tabs__mobile-nav .tabs__select' );
				if ( mobileSelect && tabBtn.hasAttribute( 'data-tag-id' ) ) {
					mobileSelect.value =
						tabBtn.getAttribute( 'data-tag-id' ) || '0';
				}
			}
		}

		const mobileTabSelect = event.target.closest(
			'.category-filter-search__tabs .tabs__mobile-nav .tabs__select'
		);
		if ( mobileTabSelect ) {
			const container = mobileTabSelect
				.closest( '.event-carousel, .latest-blogs' )
				?.querySelector( '.ambrygen-ajax-pagination' );
			if ( container ) {
				const selectedValue = parseInt(
					mobileTabSelect.value || '0',
					10
				);
				const updateArgs = { paged: 1 };

				updateArgs.tag = Number.isNaN( selectedValue )
					? 0
					: selectedValue;
				updateConferenceResults( container, updateArgs );

				const tabsWrapper = mobileTabSelect.closest(
					'.category-filter-search__tabs'
				);
				const desktopTabs = tabsWrapper?.querySelectorAll(
					'.tabs__nav .tab-button'
				);
				if ( desktopTabs?.length ) {
					desktopTabs.forEach( ( btn ) => {
						const btnTagId = parseInt(
							btn.getAttribute( 'data-tag-id' ) || '0',
							10
						);
						const isActive = btnTagId === updateArgs.tag;

						btn.classList.toggle( 'active', isActive );
						btn.classList.toggle( 'is-active', isActive );
						btn.setAttribute(
							'aria-selected',
							isActive ? 'true' : 'false'
						);
					} );
				}
			}
		}

		// 5. Load More Button Click
		const loadMoreBtn = event.target.closest(
			'.load-more-btn, .load-more-btn-wrap, .load-more-wrap'
		);
		if ( loadMoreBtn ) {
			const container = loadMoreBtn.closest(
				'.ambrygen-ajax-pagination'
			);
			if ( container ) {
				event.preventDefault();
				const current = parseInt(
					container.getAttribute( 'data-ambrygen-current' ) || '1',
					10
				);
				const total = parseInt(
					container.getAttribute( 'data-ambrygen-total-pages' ) ||
						'1',
					10
				);

				if ( current < total ) {
					updateConferenceResults( container, {
						paged: current + 1,
						load_more: true,
						scroll: false,
					} );
				}
			}
		}
	}

	// 3. Search Form Handler
	function handleSearch( event ) {
		const form = event.target.closest( 'form' );
		if ( ! form ) {
			return;
		}

		if ( form.classList.contains( 'cs-wp-filters-form' ) ) {
			const getFields = form.querySelectorAll(
				'input[name], select[name], textarea[name]'
			);

			getFields.forEach( ( field ) => {
				if (
					field.disabled ||
					'button' === field.type ||
					'submit' === field.type
				) {
					return;
				}

				const value = String( field.value || '' ).trim();
				field.disabled = value === '';
			} );

			return;
		}

		if ( ! form.id?.includes( 'search-form' ) ) {
			return;
		}

		// Find the relevant container (Upcoming vs Past)
		// Usually the form is inside or adjacent to the content.
		// In our template, the form is outside .ambrygen-ajax-pagination but inside the same .event-carousel or .latest-blogs block.
		const wrapper = form.closest( '.event-carousel, .latest-blogs' );
		const container = wrapper
			? wrapper.querySelector( '.ambrygen-ajax-pagination' )
			: null;

		if ( container ) {
			event.preventDefault();
			const searchInput = form.querySelector( 'input[name="s"]' );
			updateConferenceResults( container, {
				s: searchInput ? searchInput.value : '',
				paged: 1,
			} );
		}
	}

	function renderDesktopPagination( totalPages, currentPage ) {
		if ( totalPages <= 1 ) {
			return '<button class="page-btn active">1</button>';
		}

		let html = '';
		let showDots = false;
		const range = 1;

		for ( let i = 1; i <= totalPages; i += 1 ) {
			if (
				i === 1 ||
				i === totalPages ||
				( i >= currentPage - range && i <= currentPage + range )
			) {
				html += `<button class="page-btn${
					i === currentPage ? ' active' : ''
				}">${ i }</button>`;
				showDots = true;
				continue;
			}

			if ( showDots ) {
				html += '<span class="dots">...</span>';
				showDots = false;
			}
		}

		return html;
	}

	function renderPopupPagination( totalPages, currentPage ) {
		let html = '';
		for ( let i = 1; i <= Math.max( 1, totalPages ); i += 1 ) {
			html += `<button class="page-btn${
				i === currentPage ? ' active' : ''
			}">${ i }</button>`;
		}

		return html;
	}

	function hydrateInitialPagination( container ) {
		const totalPages = parseInt(
			container.getAttribute( 'data-ambrygen-total-pages' ),
			10
		);
		if ( Number.isNaN( totalPages ) ) {
			return;
		}

		const currentPage =
			parseInt(
				container.getAttribute( 'data-ambrygen-current' ) || '1',
				10
			) || 1;
		const paginationRow = container.querySelector(
			'.pagination-buttons-row'
		);
		const desktopPaginationList = container.querySelector(
			'.desktop-pages .pagination-list'
		);
		const mobileTrigger = container.querySelector(
			'.mobile-pagination .page-trigger'
		);
		const popupGrid = container.querySelector(
			'.pagination-popup .popup-grid'
		);

		if ( paginationRow ) {
			paginationRow.style.display = totalPages <= 1 ? 'none' : '';
		}

		if ( desktopPaginationList ) {
			desktopPaginationList.innerHTML = renderDesktopPagination(
				totalPages,
				currentPage
			);
		}

		if ( mobileTrigger ) {
			mobileTrigger.textContent = `${ currentPage }/${ Math.max(
				1,
				totalPages
			) }`;
		}

		if ( popupGrid ) {
			popupGrid.innerHTML = renderPopupPagination(
				totalPages,
				currentPage
			);
		}
	}

	/**
	 */
	function initEventTabs() {
		// Support both legacy .event-tabs-list and new .tabs__nav structures
		const legacyTabList = document.querySelector( '.event-tabs-list' );
		const modernTabLists = document.querySelectorAll( '.tabs__nav' );

		// Handle legacy tabs
		if ( legacyTabList ) {
			const tabButtons = legacyTabList.querySelectorAll(
				'.wp-block-button__link'
			);
			const tabContents =
				document.querySelectorAll( '.event-tab-content' );

			tabButtons.forEach( ( button ) => {
				button.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					const tabData = button.getAttribute( 'data-tab' );
					if ( ! tabData ) {
						return;
					}

					tabButtons.forEach( ( btn ) =>
						btn.parentElement.classList.remove( 'active' )
					);
					button.parentElement.classList.add( 'active' );

					tabContents.forEach( ( content ) => {
						if ( content.id === `tab-${ tabData }` ) {
							content.classList.add( 'active' );
							content.style.display = 'block';
						} else {
							content.classList.remove( 'active' );
							content.style.display = 'none';
						}
					} );
				} );
			} );
		}

		// Handle modern tabs (Conferences post page)
		modernTabLists.forEach( ( nav ) => {
			const container = nav.closest( '.tabs-content' );
			if ( ! container ) {
				return;
			}
			const buttons = nav.querySelectorAll( '.tabs__tab' );
			const mobileSelect = container.querySelector(
				'.tabs__mobile-nav .tabs__select'
			);

			if ( mobileSelect && ! mobileSelect.__ambrygenTabsBound ) {
				mobileSelect.addEventListener( 'change', ( e ) => {
					const targetId = e.target.value || '';
					if ( ! targetId ) {
						return;
					}

					let targetButton = null;
					buttons.forEach( ( btn ) => {
						if (
							btn.getAttribute( 'data-tab-target' ) === targetId
						) {
							targetButton = btn;
						}
					} );
					if ( targetButton ) {
						targetButton.click();
					}
				} );
				mobileSelect.__ambrygenTabsBound = true;
			}

			buttons.forEach( ( button ) => {
				button.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					const targetId = button.getAttribute( 'data-tab-target' );
					if ( ! targetId ) {
						return;
					}

					// Toggle Button State
					buttons.forEach( ( btn ) => {
						btn.classList.remove( 'active', 'is-active' );
						btn.setAttribute( 'aria-selected', 'false' );
					} );
					button.classList.add( 'active', 'is-active' );
					button.setAttribute( 'aria-selected', 'true' );

					// Sync mobile dropdown.
					if ( mobileSelect ) {
						mobileSelect.value = targetId;
					}

					// Toggle Panel State
					const panels = container.querySelectorAll( '.tabs__panel' );
					panels.forEach( ( panel ) => {
						if ( panel.id === targetId ) {
							panel.classList.add( 'active', 'is-active' );
						} else {
							panel.classList.remove( 'active', 'is-active' );
						}
					} );
				} );
			} );
		} );
	}

	document.addEventListener( 'click', handleConferenceActions );
	document.addEventListener( 'submit', handleSearch );

	document.addEventListener( 'change', ( event ) => {
		const select = event.target.closest( '#blog-tags-select' );
		if ( select ) {
			const container = select
				.closest( '.latest-blogs' )
				?.querySelector( '.ambrygen-ajax-pagination' );
			if ( container ) {
				const tagId = parseInt( select.value || '0', 10 );
				const selectedOption = select.options[ select.selectedIndex ];
				const tagUrl = selectedOption.getAttribute( 'data-url' );
				const blockWrapper = select.closest( '.latest-blogs' );
				const isTagArchive =
					blockWrapper &&
					blockWrapper.getAttribute( 'data-is-tag-archive' ) ===
						'true';

				if ( isTagArchive && tagUrl ) {
					window.history.pushState( { path: tagUrl }, '', tagUrl );
				}

				updateConferenceResults( container, { tag: tagId, paged: 1 } );
			}
		}
	} );

	window.addEventListener( 'popstate', () => {
		// If we're on a page with the blog block, reload to sync with URL change
		if ( document.querySelector( '.latest-blogs' ) ) {
			window.location.reload();
		}
	} );

	document
		.querySelectorAll( '.ambrygen-ajax-pagination' )
		.forEach( ( container ) => {
			const totalPages = parseInt(
				container.getAttribute( 'data-ambrygen-total-pages' ),
				10
			);
			if ( ! isNaN( totalPages ) ) {
				hydrateInitialPagination( container );
			}
		} );

	initEventTabs();
} )();

/**
 * Sync heights for blog listing bodies based on category height
 */
function syncBlogListingHeights() {
	const blogCards = document.querySelectorAll(
		'[data-sync-height="category"]'
	);

	if ( blogCards.length === 0 ) {
		return;
	}

	// Reset heights first to get natural heights
	blogCards.forEach( ( card ) => {
		card.style.minHeight = '';
	} );

	// Get max height from all category elements
	let maxHeight = 0;
	document
		.querySelectorAll( '.blog-listing__category' )
		.forEach( ( category ) => {
			const height = category.offsetHeight;
			if ( height > maxHeight ) {
				maxHeight = height;
			}
		} );

	// Apply max height to all blog-listing__body elements if category height exists
	if ( maxHeight > 0 ) {
		blogCards.forEach( ( card ) => {
			card.style.minHeight = maxHeight + 'px';
		} );
	}
}

/**
 * Theme UI initialization
 */
document.addEventListener( 'DOMContentLoaded', () => {
	initTooltips();
	syncBlogListingHeights();

	// Re-sync heights on window resize
	let resizeTimeout;
	window.addEventListener( 'resize', () => {
		clearTimeout( resizeTimeout );
		resizeTimeout = setTimeout( () => {
			syncBlogListingHeights();
		}, 250 );
	} );

	function syncTestCatalogItem( item, isOpen ) {
		if ( ! item ) {
			return;
		}

		const toggle = item.querySelector( '.test-catlouge__item-toggle' );
		const content = item.querySelector( '.test-catlouge__item-content' );

		if ( ! toggle || ! content ) {
			return;
		}

		item.classList.toggle( 'is-open', isOpen );
		toggle.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );

		if ( isOpen ) {
			content.style.maxHeight = 'none';
			const fullHeight = content.scrollHeight;
			content.style.maxHeight = `${ fullHeight }px`;
			return;
		}

		content.style.maxHeight = '0px';
	}

	function refreshOpenTestCatalogItems( scope = document ) {
		scope
			.querySelectorAll( '.test-catlouge__item.is-open' )
			.forEach( ( item ) => {
				syncTestCatalogItem( item, true );
			} );
	}

	document.querySelectorAll( '.test-catlouge__item' ).forEach( ( item ) => {
		syncTestCatalogItem( item, item.classList.contains( 'is-open' ) );
	} );

	if ( typeof ResizeObserver !== 'undefined' ) {
		const observedTestCatalogContents = new WeakSet();
		const testCatalogResizeObserver = new ResizeObserver( ( entries ) => {
			entries.forEach( ( entry ) => {
				const item = entry.target.closest(
					'.test-catlouge__item.is-open'
				);
				if ( item ) {
					syncTestCatalogItem( item, true );
				}
			} );
		} );

		document
			.querySelectorAll( '.test-catlouge__item-content' )
			.forEach( ( content ) => {
				if ( observedTestCatalogContents.has( content ) ) {
					return;
				}

				observedTestCatalogContents.add( content );
				testCatalogResizeObserver.observe( content );
			} );
	}

	function syncSpeakerCard( card, isOpen ) {
		const bio = card.querySelector( '.speaker-card__bio' );
		if ( ! bio ) {
			return;
		}

		card.classList.toggle( 'open', isOpen );
		card.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );
		bio.setAttribute( 'aria-hidden', isOpen ? 'false' : 'true' );
		bio.style.overflow = 'hidden';

		if ( isOpen ) {
			// Reset first so height can be measured properly
			bio.style.maxHeight = 'none';
			bio.style.opacity = '1';
			bio.style.paddingTop = '10px';
			bio.style.borderTopWidth = '1px';

			// Force reflow
			void bio.offsetHeight;

			const fullHeight = bio.scrollHeight;

			// Start collapsed
			bio.style.maxHeight = '0px';

			requestAnimationFrame( () => {
				bio.style.maxHeight = `${ fullHeight }px`;
			} );
		} else {
			// Set current height before collapsing
			bio.style.maxHeight = `${ bio.scrollHeight }px`;

			requestAnimationFrame( () => {
				bio.style.maxHeight = '0px';
				bio.style.opacity = '0';
				bio.style.paddingTop = '0px';
				bio.style.borderTopWidth = '0px';
			} );
		}
	}

	document.querySelectorAll( '.speaker-card' ).forEach( ( card ) => {
		syncSpeakerCard( card, card.classList.contains( 'open' ) );
	} );

	/**
	 * Speaker cards toggle
	 * Clicking a speaker card opens or closes that card independently.
	 */
	document.addEventListener( 'click', ( event ) => {
		const seeGenesTrigger = event.target.closest(
			'.reference-table__see-genes'
		);
		if ( seeGenesTrigger ) {
			const productId = seeGenesTrigger.dataset.productId;
			if ( ! productId ) {
				return;
			}

			const matchingToggle = document.querySelector(
				`.test-catlouge__item-toggle[data-product-id="${ productId }"]`
			);
			const item = matchingToggle?.closest( '.test-catlouge__item' );

			if ( ! matchingToggle || ! item ) {
				return;
			}

			event.preventDefault();

			if ( ! item.classList.contains( 'is-open' ) ) {
				syncTestCatalogItem( item, true );
			}

			item.scrollIntoView( {
				behavior: 'smooth',
				block: 'start',
			} );
			return;
		}

		const testCatalogToggle = event.target.closest(
			'.test-catlouge__item-toggle'
		);
		if ( testCatalogToggle ) {
			const item = testCatalogToggle.closest( '.test-catlouge__item' );
			if ( ! item ) {
				return;
			}

			event.preventDefault();
			syncTestCatalogItem( item, ! item.classList.contains( 'is-open' ) );
			return;
		}

		const action = event.target.closest( '.speaker-card__actions' );
		if ( ! action ) {
			return;
		}

		const card = action.closest( '.speaker-card' );
		if ( ! card ) {
			return;
		}

		const speakersWrap = card.closest( '.speaker-session__speakers' );
		if ( ! speakersWrap ) {
			return;
		}

		const isOpen = card.classList.contains( 'open' );
		syncSpeakerCard( card, ! isOpen );
	} );

	window.addEventListener( 'resize', () => {
		refreshOpenTestCatalogItems();

		document
			.querySelectorAll( '.speaker-card.open .speaker-card__bio' )
			.forEach( ( bio ) => {
				bio.style.maxHeight = `${ bio.scrollHeight }px`;
			} );
	} );

	function removeMeetExpertEditors( scope ) {
		if (
			! (
				window.wp &&
				wp.editor &&
				typeof wp.editor.remove === 'function'
			)
		) {
			return;
		}

		scope
			.querySelectorAll( 'textarea.ambrygen-meet-expert-bio' )
			.forEach( ( textarea ) => {
				const editorId = textarea.getAttribute( 'id' );
				if ( editorId ) {
					wp.editor.remove( editorId );
				}
			} );
	}

	function initMeetExpertEditors( scope ) {
		if (
			! (
				window.wp &&
				wp.editor &&
				typeof wp.editor.initialize === 'function' &&
				scope
			)
		) {
			return;
		}

		scope
			.querySelectorAll( 'textarea.ambrygen-meet-expert-bio' )
			.forEach( ( textarea ) => {
				const editorId = textarea.getAttribute( 'id' );

				if (
					! editorId ||
					textarea.dataset.editorReady === '1' ||
					( window.tinymce &&
						typeof window.tinymce.get === 'function' &&
						window.tinymce.get( editorId ) )
				) {
					textarea.dataset.editorReady = '1';
					return;
				}

				wp.editor.initialize( editorId, {
					tinymce: {
						wpautop: true,
						toolbar1:
							'bold,italic,bullist,numlist,link,unlink,undo,redo',
					},
					quicktags: true,
					mediaButtons: false,
				} );

				textarea.dataset.editorReady = '1';
			} );
	}

	document.addEventListener( 'click', ( event ) => {
		const addSessionBtn = event.target.closest(
			'.ambrygen-meet-expert-add-session'
		);
		if ( addSessionBtn ) {
			event.preventDefault();
			const repeater = addSessionBtn.closest(
				'.ambrygen-meet-expert-repeater'
			);
			const rows = repeater?.querySelector(
				'.ambrygen-meet-expert-rows'
			);
			const template = repeater?.querySelector(
				'.ambrygen-meet-expert-template'
			);
			if ( ! rows || ! template ) {
				return;
			}

			const index = `${ Date.now() }${ Math.floor(
				Math.random() * 1000
			) }`;
			const html = ( template.innerHTML || '' ).replace(
				/__INDEX__/g,
				index
			);
			appendSanitizedHtml( rows, html );
			initMeetExpertEditors( rows.lastElementChild );
			return;
		}

		const addMemberBtn = event.target.closest(
			'.ambrygen-meet-expert-add-member'
		);
		if ( addMemberBtn ) {
			event.preventDefault();
			const sessionRow = addMemberBtn.closest(
				'.ambrygen-meet-expert-session-row'
			);
			const repeater = addMemberBtn.closest(
				'.ambrygen-meet-expert-repeater'
			);
			const members = sessionRow?.querySelector(
				'.ambrygen-meet-expert-member-rows'
			);
			const template = repeater?.querySelector(
				'.ambrygen-meet-expert-member-template'
			);
			if ( ! sessionRow || ! members || ! template ) {
				return;
			}

			const sessionIndex = Array.from(
				sessionRow.parentElement?.children || []
			).indexOf( sessionRow );
			const memberIndex = `${ Date.now() }${ Math.floor(
				Math.random() * 1000
			) }`;
			const html = ( template.innerHTML || '' )
				.replace( /__SESSION_INDEX__/g, String( sessionIndex ) )
				.replace( /__MEMBER_INDEX__/g, memberIndex );
			appendSanitizedHtml( members, html );
			initMeetExpertEditors( members.lastElementChild );
			return;
		}

		const removeSessionBtn = event.target.closest(
			'.ambrygen-meet-expert-remove-session'
		);
		if ( removeSessionBtn ) {
			event.preventDefault();
			const sessionRow = removeSessionBtn.closest(
				'.ambrygen-meet-expert-session-row'
			);
			if ( ! sessionRow ) {
				return;
			}

			removeMeetExpertEditors( sessionRow );
			sessionRow.remove();
			return;
		}

		const removeMemberBtn = event.target.closest(
			'.ambrygen-meet-expert-remove-member'
		);
		if ( removeMemberBtn ) {
			event.preventDefault();
			const memberRow = removeMemberBtn.closest(
				'.ambrygen-meet-expert-member-row'
			);
			if ( ! memberRow ) {
				return;
			}

			removeMeetExpertEditors( memberRow );
			memberRow.remove();
		}
	} );

	/**
	 * Tab Dropdowns logic (Delegated for year/pagination filters)
	 */
	document.addEventListener( 'click', ( event ) => {
		const toggle = event.target.closest( '.tab-dropdown .dropdown-toggle' );
		const parent = toggle ? toggle.closest( '.tab-dropdown' ) : null;

		// 1. Close other dropdowns if clicking elsewhere or opening a new one
		document
			.querySelectorAll( '.tab-dropdown.open' )
			.forEach( ( dropdown ) => {
				if ( dropdown !== parent ) {
					dropdown.classList.remove( 'open' );
					const btn = dropdown.querySelector( '.dropdown-toggle' );
					if ( btn ) {
						btn.setAttribute( 'aria-expanded', 'false' );
					}
				}
			} );

		// 2. Toggle current if toggle was clicked
		if ( toggle && parent ) {
			event.preventDefault();
			event.stopPropagation();

			const isExpanded =
				toggle.getAttribute( 'aria-expanded' ) === 'true';
			const newState = ! isExpanded;

			toggle.setAttribute( 'aria-expanded', newState ? 'true' : 'false' );
			parent.classList.toggle( 'open', newState );

			if ( newState ) {
				// No staggered animation for dropdown items.
			}
		}
	} );

	/**
	 * Archive filters mobile toggle
	 * Shared by poster/publication/presentation filter template parts.
	 */
	document.addEventListener( 'click', ( event ) => {
		const toggle = event.target.closest( '.cs-wp-filters__toggle' );
		if ( ! toggle ) {
			return;
		}

		const filterContainer = toggle.closest( '.cs-wp-filters' );
		if ( ! filterContainer ) {
			return;
		}

		event.preventDefault();

		filterContainer.classList.toggle( 'is-open' );
		toggle.setAttribute(
			'aria-expanded',
			filterContainer.classList.contains( 'is-open' ) ? 'true' : 'false'
		);
	} );

	/**
	 * Core archive pagination buttons
	 * Used only where PHP converts query-pagination links into buttons.
	 */
	document.addEventListener( 'click', ( event ) => {
		const button = event.target.closest( 'button[data-pagination-url]' );
		if ( ! button || button.disabled ) {
			return;
		}

		const url = button.getAttribute( 'data-pagination-url' );
		if ( ! url ) {
			return;
		}

		window.location.href = url;
	} );

	/**
	 * Conferences In-Progress Slider
	 */
	const cipSwiperEl = document.querySelector( '.cip-swiper' );

	if ( cipSwiperEl && typeof Swiper !== 'undefined' ) {
		const wrapperEl = cipSwiperEl.querySelector(
			'.wp-block-post-template'
		);
		const slideEls = cipSwiperEl.querySelectorAll( '.wp-block-post' );
		const slideCount = slideEls.length;

		// Ensure core Swiper classes exist on Query block markup.
		if ( wrapperEl ) {
			wrapperEl.classList.add( 'swiper-wrapper' );
		}
		slideEls.forEach( ( slideEl ) => {
			slideEl.classList.add( 'swiper-slide' );
		} );

		new Swiper( cipSwiperEl, {
			slidesPerView: 1,
			loop: slideCount > 1,
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			speed: 600,
			navigation: {
				prevEl: '.cip-arrow--prev',
				nextEl: '.cip-arrow--next',
			},
		} );
	}

	/**
	 * Featured Blogs Slider
	 */
	const blogFeaturedSwiperEl = document.querySelector(
		'.blog-featured-swiper'
	);
	if ( blogFeaturedSwiperEl && typeof Swiper !== 'undefined' ) {
		const slideEls =
			blogFeaturedSwiperEl.querySelectorAll( '.swiper-slide' );
		const slideCount = slideEls.length;

		new Swiper( blogFeaturedSwiperEl, {
			slidesPerView: 1,
			loop: slideCount > 1,
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			speed: 600,
			navigation: {
				prevEl: '.blog-featured__nav .custom-prev',
				nextEl: '.blog-featured__nav .custom-next',
			},
		} );
	}

	/**
	 * Author Slider (Webinar Pages)
	 */
	const authorSliderElements = document.querySelectorAll( '.author-slider' );
	if ( authorSliderElements.length > 0 && typeof Swiper !== 'undefined' ) {
		authorSliderElements.forEach( ( authorSliderEl ) => {
			if ( authorSliderEl.classList.contains( 'swiper-initialized' ) ) {
				return;
			}

			const cardElements = authorSliderEl.querySelectorAll(
				'.author-slider__card'
			);
			const nextEl = authorSliderEl.querySelector(
				'.author-slider__nav-next'
			);
			const prevEl = authorSliderEl.querySelector(
				'.author-slider__nav-prev'
			);
			const slideCount =
				authorSliderEl.querySelectorAll( '.swiper-slide' ).length;
			const hasMultipleSlides = slideCount > 1;

			// Keep all cards the same height within this slider.
			const setAuthorSliderCardHeight = () => {
				if ( cardElements.length === 0 ) {
					return;
				}

				let maxHeight = 0;

				cardElements.forEach( ( card ) => {
					card.style.height = 'auto';
					const height = card.offsetHeight;
					if ( height > maxHeight ) {
						maxHeight = height;
					}
				} );

				if ( maxHeight > 0 ) {
					cardElements.forEach( ( card ) => {
						card.style.height = maxHeight + 'px';
					} );
				}
			};

			new Swiper( authorSliderEl, {
				slidesPerView: 1,
				loop: hasMultipleSlides,
				loopAdditionalSlides: hasMultipleSlides ? slideCount : 0,
				loopPreventsSliding: false,
				autoHeight: false,
				effect: 'fade',
				fadeEffect: {
					crossFade: true,
				},
				speed: 600,
				breakpoints: {
					767: {
						autoHeight: false,
					},
				},
				on: {
					init: setAuthorSliderCardHeight,
					slideChange: setAuthorSliderCardHeight,
				},
			} );

			if ( hasMultipleSlides && prevEl ) {
				prevEl.addEventListener( 'click', ( event ) => {
					event.preventDefault();
					event.stopPropagation();
					authorSliderEl.swiper?.slidePrev();
				} );
			}

			if ( hasMultipleSlides && nextEl ) {
				nextEl.addEventListener( 'click', ( event ) => {
					event.preventDefault();
					event.stopPropagation();
					authorSliderEl.swiper?.slideNext();
				} );
			}

			window.addEventListener( 'resize', setAuthorSliderCardHeight );
		} );
	}

	/**
	 * Tabs Table Content
	 */
	function initTabsTableContent() {
		const blocks = document.querySelectorAll( '.tabs-table-content' );
		if ( ! blocks.length ) {
			return;
		}

		blocks.forEach( ( block ) => {
			const items = block.querySelectorAll( '.tabs-table-content__item' );

			items.forEach( ( item ) => {
				const header = item.querySelector(
					'.tabs-table-content__header'
				);
				if ( ! header ) {
					return;
				}

				header.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					const isDesktop =
						window.matchMedia( '(min-width: 992px)' ).matches;

					if ( isDesktop ) {
						// Desktop Tabs Behavior
						if ( ! item.classList.contains( 'is-active' ) ) {
							items.forEach( ( other ) =>
								other.classList.remove( 'is-active' )
							);
							item.classList.add( 'is-active' );
						}
					} else if ( item.classList.contains( 'is-active' ) ) {
						// Mobile Accordion Behavior
						item.classList.remove( 'is-active' );
					} else {
						items.forEach( ( other ) =>
							other.classList.remove( 'is-active' )
						);
						item.classList.add( 'is-active' );
					}
				} );
			} );
		} );
	}
	initTabsTableContent();
} );

/**
 * Admin Meta Box Helper Scripts
 *
 * Handles dynamic field toggling and Select2 initialization
 * within the WordPress post editor.
 * @param {Object} $ jQuery instance.
 */
( function ( $ ) {
	'use strict';

	if ( ! $ ) {
		return;
	}

	$( document ).ready( function () {
		const $videoTypeSelect = $( 'select[name="video_type"]' );

		const toggleVideoFields = function () {
			const val = $videoTypeSelect.val();
			const $mp4Field = $( '.field-video_url' );
			const $embedField = $( '.field-iframe_url' );
			const $posterField = $( '.field-poster_image_id' );

			if ( ! val ) {
				$mp4Field.hide();
				$embedField.hide();
				$posterField.hide();
			} else if ( val === 'mp4' ) {
				$mp4Field.show();
				$embedField.hide();
				$posterField.show();
			} else if ( val === 'embed' ) {
				$mp4Field.hide();
				$embedField.show();
				$posterField.show();
			}
		};

		if ( $videoTypeSelect.length ) {
			$videoTypeSelect.on( 'change', toggleVideoFields );
			toggleVideoFields();
		}

		if ( $.fn.select2 ) {
			$( '.ambrygen-select2' ).each( function () {
				const $select = $( this );

				if ( ! $select.hasClass( 'select2-hidden-accessible' ) ) {
					$select.select2( {
						width: '100%',
						placeholder: 'Search...',
						allowClear: true,
					} );
				}
			} );
		}
	} );
} )( window.jQuery );

document.addEventListener( 'DOMContentLoaded', () => {
	const searchPageRoot = document.querySelector( '[data-search-page-root]' );

	const updateSearchPageFromAjax = async ( url, options = {} ) => {
		if ( ! searchPageRoot || ! window.ambrygenAjax ) {
			return;
		}

		const { shouldScroll = true, updateHistory = true } = options;
		const parsedUrl = new URL( url, window.location.origin );
		const searchTerm = parsedUrl.searchParams.get( 's' ) || '';
		const searchType = parsedUrl.searchParams.get( 'search_type' ) || 'all';
		const resultsColumn = searchPageRoot.querySelector(
			'[data-search-results-column]'
		);
		const paginationWrap = searchPageRoot.querySelector(
			'[data-search-pagination-wrap]'
		);

		if ( ! resultsColumn || ! paginationWrap ) {
			return;
		}

		const paged = parseInt(
			parsedUrl.searchParams.get( 'paged' ) || '1',
			10
		);

		resultsColumn.classList.add( 'is-loading' );
		paginationWrap.classList.add( 'is-loading' );

		const formData = new FormData();
		formData.append( 'action', 'ambrygen_search_page_results' );
		formData.append( 'nonce', window.ambrygenAjax.nonce );
		formData.append( 's', searchTerm );
		formData.append( 'search_type', searchType );
		formData.append( 'paged', String( Number.isNaN( paged ) ? 1 : paged ) );

		try {
			const response = await fetch( window.ambrygenAjax.ajaxUrl, {
				method: 'POST',
				credentials: 'same-origin',
				body: formData,
			} );
			const result = await response.json();

			if ( ! result?.success || ! result?.data ) {
				return;
			}

			replaceElementWithSanitizedHtml(
				resultsColumn,
				result.data.resultsHtml
			);
			replaceWithSanitizedHtml(
				paginationWrap,
				result.data.paginationHtml || ''
			);
			if ( updateHistory ) {
				window.history.pushState( {}, '', result.data.url || url );
			}
			if ( shouldScroll ) {
				window.scrollTo( {
					top: searchPageRoot.offsetTop - 40,
					behavior: 'smooth',
				} );
			}
		} catch ( error ) {
			window.location.href = url;
		} finally {
			const refreshedColumn = searchPageRoot.querySelector(
				'[data-search-results-column]'
			);
			const refreshedPaginationWrap = searchPageRoot.querySelector(
				'[data-search-pagination-wrap]'
			);
			refreshedColumn?.classList.remove( 'is-loading' );
			refreshedPaginationWrap?.classList.remove( 'is-loading' );
			searchPageRoot.classList.remove( 'is-bootstrapping' );
		}
	};

	searchPageRoot?.addEventListener( 'click', ( event ) => {
		const filterLink = event.target.closest(
			'.search-modal__filters .tab-button'
		);

		if ( filterLink ) {
			event.preventDefault();
			updateSearchPageFromAjax( filterLink.href );
		}
	} );

	document.addEventListener( 'change', ( event ) => {
		const select = event.target.closest( '.search-page__filter-select' );
		if ( ! select || ! select.value ) {
			return;
		}

		const currentSearchPageRoot = select.closest( '[data-search-page-root]' );
		if ( ! currentSearchPageRoot ) {
			return;
		}

		event.preventDefault();

		if ( ! window.ambrygenAjax ) {
			window.location.href = select.value;
			return;
		}

		updateSearchPageFromAjax( select.value );
	} );

	if ( searchPageRoot ) {
		const currentUrl = new URL( window.location.href );
		const currentSearch = currentUrl.searchParams.get( 's' );

		if ( currentSearch ) {
			searchPageRoot.classList.add( 'is-bootstrapping' );
			updateSearchPageFromAjax( window.location.href, {
				shouldScroll: false,
				updateHistory: false,
			} );
		}
	}
} );

document.addEventListener( 'click', ( event ) => {
	const paginationButton = event.target.closest(
		'[data-search-page-root] .search-page__pagination button[data-url]'
	);
	if ( ! paginationButton || paginationButton.disabled ) {
		return;
	}

	const searchPageRoot = paginationButton.closest(
		'[data-search-page-root]'
	);
	if ( ! searchPageRoot || ! window.ambrygenAjax ) {
		return;
	}

	event.preventDefault();

	const parsedUrl = new URL(
		paginationButton.dataset.url,
		window.location.origin
	);
	const searchTerm = parsedUrl.searchParams.get( 's' ) || '';
	const searchType = parsedUrl.searchParams.get( 'search_type' ) || 'all';
	const resultsColumn = searchPageRoot.querySelector(
		'[data-search-results-column]'
	);
	const paginationWrap = searchPageRoot.querySelector(
		'[data-search-pagination-wrap]'
	);

	if ( ! resultsColumn || ! paginationWrap ) {
		window.location.href = paginationButton.dataset.url;
		return;
	}

	const paged = parseInt( parsedUrl.searchParams.get( 'paged' ) || '1', 10 );

	resultsColumn.classList.add( 'is-loading' );
	paginationWrap.classList.add( 'is-loading' );

	const formData = new FormData();
	formData.append( 'action', 'ambrygen_search_page_results' );
	formData.append( 'nonce', window.ambrygenAjax.nonce );
	formData.append( 's', searchTerm );
	formData.append( 'search_type', searchType );
	formData.append( 'paged', String( Number.isNaN( paged ) ? 1 : paged ) );

	fetch( window.ambrygenAjax.ajaxUrl, {
		method: 'POST',
		credentials: 'same-origin',
		body: formData,
	} )
		.then( ( response ) => response.json() )
		.then( ( result ) => {
			if ( ! result?.success || ! result?.data ) {
				window.location.href = paginationButton.dataset.url;
				return;
			}

			replaceElementWithSanitizedHtml(
				resultsColumn,
				result.data.resultsHtml
			);
			replaceWithSanitizedHtml(
				paginationWrap,
				result.data.paginationHtml || ''
			);
			window.history.pushState(
				{},
				'',
				result.data.url || paginationButton.dataset.url
			);
			window.scrollTo( {
				top: searchPageRoot.offsetTop - 40,
				behavior: 'smooth',
			} );
		} )
		.catch( () => {
			window.location.href = paginationButton.dataset.url;
		} )
		.finally( () => {
			const refreshedColumn = searchPageRoot.querySelector(
				'[data-search-results-column]'
			);
			const refreshedPaginationWrap = searchPageRoot.querySelector(
				'[data-search-pagination-wrap]'
			);
			refreshedColumn?.classList.remove( 'is-loading' );
			refreshedPaginationWrap?.classList.remove( 'is-loading' );
			searchPageRoot.classList.remove( 'is-bootstrapping' );
		} );
} );
