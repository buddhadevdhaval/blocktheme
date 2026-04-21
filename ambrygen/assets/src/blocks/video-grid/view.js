( function () {
	const initVideoGridModal = () => {
		const createSafeDescriptionFragment = ( sourceEl ) => {
			const allowedTags = new Set( [
				'A',
				'B',
				'BR',
				'EM',
				'I',
				'LI',
				'OL',
				'P',
				'SPAN',
				'STRONG',
				'UL',
			] );

			const sanitizeHref = ( href ) => {
				if ( ! href ) {
					return null;
				}

				try {
					const url = new URL( href, window.location.origin );
					if (
						[ 'http:', 'https:', 'mailto:', 'tel:' ].includes(
							url.protocol
						)
					) {
						return url.href;
					}
				} catch ( error ) {
					return null;
				}

				return null;
			};

			const sanitizeNode = ( node ) => {
				if ( node.nodeType === Node.TEXT_NODE ) {
					return document.createTextNode( node.textContent || '' );
				}

				if ( node.nodeType !== Node.ELEMENT_NODE ) {
					return document.createDocumentFragment();
				}

				if ( ! allowedTags.has( node.tagName ) ) {
					const fragment = document.createDocumentFragment();
					Array.from( node.childNodes ).forEach( ( childNode ) => {
						fragment.appendChild( sanitizeNode( childNode ) );
					} );
					return fragment;
				}

				const safeElement = document.createElement(
					node.tagName.toLowerCase()
				);

				if ( node.tagName === 'A' ) {
					const safeHref = sanitizeHref(
						node.getAttribute( 'href' )
					);

					if ( ! safeHref ) {
						const fragment = document.createDocumentFragment();
						Array.from( node.childNodes ).forEach( ( childNode ) => {
							fragment.appendChild( sanitizeNode( childNode ) );
						} );
						return fragment;
					}

					safeElement.setAttribute( 'href', safeHref );

					if ( node.getAttribute( 'target' ) === '_blank' ) {
						safeElement.setAttribute( 'target', '_blank' );
						safeElement.setAttribute(
							'rel',
							'noopener noreferrer'
						);
					}
				}

				Array.from( node.childNodes ).forEach( ( childNode ) => {
					safeElement.appendChild( sanitizeNode( childNode ) );
				} );

				return safeElement;
			};

			const fragment = document.createDocumentFragment();

			Array.from( sourceEl.childNodes ).forEach( ( childNode ) => {
				fragment.appendChild( sanitizeNode( childNode ) );
			} );

			return fragment;
		};

		document
			.querySelectorAll( '.wp-block-ambrygen-gallery.image-grid-block.video-grid' )
			.forEach( ( blockEl ) => {
				if ( blockEl.dataset.videoGridBound === '1' ) {
					return;
				}

				const videoModal = blockEl.querySelector( '[data-video-modal]' );
				const videoContainer = blockEl.querySelector(
					'[data-video-modal-container]'
				);
				const videoTitleEl = blockEl.querySelector(
					'[data-video-modal-title]'
				);
				const videoDescriptionEl = blockEl.querySelector(
					'[data-video-modal-description]'
				);
				const closeButton =
					videoModal?.querySelector( '.modal-popup__close' );
				const overlay =
					videoModal?.querySelector( '.modal-popup__overlay' );

				if (
					! videoModal ||
					! videoContainer ||
					! videoTitleEl ||
					! videoDescriptionEl
				) {
					return;
				}

				blockEl.dataset.videoGridBound = '1';

				const closeVideoModal = () => {
					videoModal.classList.remove( 'is-active' );
					videoContainer.replaceChildren();
					videoTitleEl.textContent = '';
					videoDescriptionEl.replaceChildren();
				};

				const openVideoModal = ( element ) => {
					const item = element.closest( '.videos__cards-item' );
					if ( ! item || ! blockEl.contains( item ) ) {
						return;
					}

					const iframe = item.querySelector( '.features-media__iframe' );
					const videoSrc = iframe ? iframe.getAttribute( 'src' ) : null;
					const titleEl = item.querySelector(
						'.videos__cards-item-title'
					);
					const videoTitle = titleEl ? titleEl.textContent : 'Video';
					const descEl = item.querySelector(
						'.videos__cards-item-description'
					);

					if ( ! videoSrc ) {
						return;
					}

					videoTitleEl.textContent = videoTitle;

					if ( descEl ) {
						videoDescriptionEl.replaceChildren(
							createSafeDescriptionFragment( descEl )
						);
					} else {
						videoDescriptionEl.replaceChildren();
					}

					const iframeEl = document.createElement( 'iframe' );
					iframeEl.src = videoSrc;
					iframeEl.title = videoTitle;
					iframeEl.className = 'features-media__iframe';
					iframeEl.allow =
						'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
					iframeEl.allowFullscreen = true;
					videoContainer.replaceChildren( iframeEl );
					videoModal.classList.add( 'is-active' );
				};

				if ( overlay ) {
					overlay.addEventListener( 'click', closeVideoModal );
				}

				if ( closeButton ) {
					closeButton.addEventListener( 'click', closeVideoModal );
				}

				const thumbnails = blockEl.querySelectorAll(
					'.videos__cards-item-thumbnail'
				);
				thumbnails.forEach( ( thumbnail ) => {
					thumbnail.style.cursor = 'pointer';
					thumbnail.addEventListener( 'click', function ( e ) {
						e.preventDefault();
						openVideoModal( this );
					} );
				} );

				const playIcons = blockEl.querySelectorAll( '.play-icon-video' );
				playIcons.forEach( ( icon ) => {
					icon.style.cursor = 'pointer';
					icon.addEventListener( 'click', function ( e ) {
						e.preventDefault();
						openVideoModal( this );
					} );
				} );

				const mediaVideos = blockEl.querySelectorAll( '.media_video' );
				mediaVideos.forEach( ( media ) => {
					const hasThumbnail = media.querySelector(
						'.videos__cards-item-thumbnail'
					);
					if ( ! hasThumbnail ) {
						media.style.cursor = 'pointer';
						media.addEventListener( 'click', function ( e ) {
							e.preventDefault();
							openVideoModal( this );
						} );
					}
				} );

				document.addEventListener( 'keydown', ( event ) => {
					if ( event.key === 'Escape' && videoModal.classList.contains( 'is-active' ) ) {
						closeVideoModal();
					}
				} );
			} );
	};

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initVideoGridModal );
	} else {
		initVideoGridModal();
	}

	window.addEventListener( 'load', initVideoGridModal );
} )();
