( function () {
	const initThreeColumnVideo = () => {
		const cards = document.querySelectorAll(
			'.wp-block-ambrygen-three-column-image-grid-item'
		);

		cards.forEach( ( card ) => {
			if ( card.dataset.videoBound === '1' ) {
				return;
			}

			const videoButton = card.querySelector( '.has-video-arrow' );
			const videoModal = card.querySelector( '[data-video-modal]' );
			const videoContainer = card.querySelector( '[data-video-modal-container]' );
			const videoTitleEl = card.querySelector( '[data-video-modal-title]' );
			const closeButton = videoModal?.querySelector( '.modal-popup__close' );
			const overlay = videoModal?.querySelector( '.modal-popup__overlay' );

			if ( ! videoButton || ! videoModal || ! videoContainer || ! videoTitleEl ) {
				return;
			}

			card.dataset.videoBound = '1';

			const closeVideoModal = () => {
				videoModal.classList.remove( 'is-active' );
				videoContainer.replaceChildren();
				videoTitleEl.textContent = '';
				const videoDescriptionEl = card.querySelector( '[data-video-modal-description]' );
				if ( videoDescriptionEl ) {
					videoDescriptionEl.replaceChildren();
				}
			};

			const createSafeDescriptionFragment = ( sourceEl ) => {
				const allowedTags = new Set( [ 'A', 'B', 'BR', 'EM', 'I', 'LI', 'OL', 'P', 'SPAN', 'STRONG', 'UL' ] );
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
					const safeElement = document.createElement( node.tagName.toLowerCase() );
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

			const openVideoModal = () => {
				const videoType = videoButton.dataset.videoType;
				const videoSrc = videoButton.dataset.videoSrc;
				const videoTitle = videoButton.dataset.videoTitle || 'Video';

				if ( ! videoSrc ) {
					return;
				}

				videoTitleEl.textContent = videoTitle;
				
				const descSource = card.querySelector( '.videos__cards-item-description' );
				const videoDescriptionEl = card.querySelector( '[data-video-modal-description]' );
				if ( descSource && videoDescriptionEl ) {
					videoDescriptionEl.replaceChildren( createSafeDescriptionFragment( descSource ) );
				}

				if ( videoType === 'mp4' ) {
					const videoEl = document.createElement( 'video' );
					videoEl.src = videoSrc;
					videoEl.className = 'videos';
					videoEl.controls = true;
					videoEl.autoplay = true;
					videoEl.playsInline = true;
					videoContainer.replaceChildren( videoEl );
				} else {
					const iframeEl = document.createElement( 'iframe' );
					const joiner = videoSrc.includes( '?' ) ? '&' : '?';
					iframeEl.src = `${ videoSrc }${ joiner }autoplay=1`;
					iframeEl.title = videoTitle;
					iframeEl.className = 'features-media__iframe';
					iframeEl.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
					iframeEl.allowFullscreen = true;
					videoContainer.replaceChildren( iframeEl );
				}

				videoModal.classList.add( 'is-active' );
			};

			videoButton.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				openVideoModal();
			} );

			if ( overlay ) {
				overlay.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					closeVideoModal();
				});
			}

			if ( closeButton ) {
				closeButton.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					closeVideoModal();
				});
			}

			document.addEventListener( 'keydown', ( event ) => {
				if ( event.key === 'Escape' && videoModal.classList.contains( 'is-active' ) ) {
					closeVideoModal();
				}
			} );
		} );
	};

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initThreeColumnVideo );
	} else {
		initThreeColumnVideo();
	}

	window.addEventListener( 'load', initThreeColumnVideo );
} )();
