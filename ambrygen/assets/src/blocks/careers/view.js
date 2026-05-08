import closeIcon from '../../images/close-icon.svg';

/**
 * Front-end JS for Careers Highlight Block
 * Opens the existing video in a popup.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll( '.careers-highlight' );

	const addAutoplay = ( src ) => {
		if ( ! src || src.includes( 'autoplay=1' ) ) {
			return src;
		}

		return `${ src }${ src.includes( '?' ) ? '&' : '?' }autoplay=1`;
	};

	const createModal = ( id ) => {
		const modal = document.createElement( 'div' );
		modal.className = 'modal-popup modal-popup--video';
		modal.hidden = true;
		if ( id ) {
			modal.id = id;
		}
		modal.innerHTML = `
			<div class="modal-popup__overlay"></div>
			<div class="modal-popup__panel" role="dialog" aria-modal="true" aria-label="Video dialog">
				<button type="button" class="modal-popup__close" aria-label="Close modal">
					<img decoding="async" src="${ closeIcon }" alt="" aria-hidden="true" />
				</button>
				<div class="modal-content">
					<div class="modal-content__video-wrapper"></div>
				</div>
			</div>
		`;

		return modal;
	};

	const setVideoSize = ( videoWrapper ) => {
		videoWrapper.style.aspectRatio = '16 / 9';
		videoWrapper.style.backgroundColor = '#1a1a1a';
		videoWrapper.style.borderRadius = '12px';
		videoWrapper.style.overflow = 'hidden';
		videoWrapper.style.position = 'relative';
		videoWrapper.style.width = '100%';
	};

	const setMediaSize = ( media ) => {
		media.style.border = '0';
		media.style.height = '100%';
		media.style.left = '0';
		media.style.margin = '0';
		media.style.position = 'absolute';
		media.style.top = '0';
		media.style.width = '100%';
	};

	const trapFocus = ( event, panel ) => {
		if ( event.key !== 'Tab' ) {
			return;
		}

		const focusable = Array.from(
			panel.querySelectorAll(
				'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])'
			)
		).filter(
			( element ) =>
				! element.hasAttribute( 'hidden' ) &&
				element.getAttribute( 'aria-hidden' ) !== 'true'
		);

		if ( ! focusable.length ) {
			return;
		}

		const first = focusable[ 0 ];
		const last = focusable[ focusable.length - 1 ];

		if ( event.shiftKey && document.activeElement === first ) {
			event.preventDefault();
			last.focus();
		} else if ( ! event.shiftKey && document.activeElement === last ) {
			event.preventDefault();
			first.focus();
		}
	};

	blocks.forEach( ( block ) => {
		if ( block.dataset.careersVideoBound === '1' ) {
			return;
		}

		const mediaTrigger = block.querySelector(
			'.careers-highlight__media.media_video'
		);
		const toggleWrap = block.querySelector( '.play-icon-video' );
		const playIcon = toggleWrap?.querySelector( '.play-icon' );
		const pauseIcon = toggleWrap?.querySelector( '.pause-icon' );

		if ( ! mediaTrigger || ! toggleWrap || ! playIcon || ! pauseIcon ) {
			return;
		}

		block.dataset.careersVideoBound = '1';

		pauseIcon.style.display = 'none';

		const video = block.querySelector( 'video.videos' );
		const iframe = block.querySelector( '.video-embed iframe' );

		if ( ! video && ! iframe ) {
			return;
		}

		mediaTrigger.style.cursor = 'pointer';
		mediaTrigger.setAttribute( 'role', 'button' );
		mediaTrigger.setAttribute( 'tabindex', '0' );
		mediaTrigger.setAttribute( 'aria-haspopup', 'dialog' );
		mediaTrigger.setAttribute( 'aria-expanded', 'false' );

		if ( toggleWrap.getAttribute( 'aria-controls' ) ) {
			mediaTrigger.setAttribute(
				'aria-controls',
				toggleWrap.getAttribute( 'aria-controls' )
			);
		}

		const mediaElements = mediaTrigger.querySelectorAll(
			'iframe, video, .play-icon-video'
		);
		mediaElements.forEach( ( element ) => {
			element.style.pointerEvents = 'none';
		} );

		let modal = null;

		const closeModal = () => {
			if ( ! modal ) {
				return;
			}

			modal.classList.remove( 'is-active' );
			modal.hidden = true;
			mediaTrigger.setAttribute( 'aria-expanded', 'false' );
			toggleWrap.setAttribute( 'aria-expanded', 'false' );
			modal
				.querySelector( '.modal-content__video-wrapper' )
				?.replaceChildren();
			mediaTrigger.focus();
		};

		const openModal = () => {
			if ( ! modal ) {
				modal = createModal( toggleWrap.getAttribute( 'aria-controls' ) );
				block.appendChild( modal );
				modal
					.querySelector( '.modal-popup__overlay' )
					?.addEventListener( 'click', closeModal );
				modal
					.querySelector( '.modal-popup__close' )
					?.addEventListener( 'click', closeModal );
				modal
					.querySelector( '.modal-popup__panel' )
					?.addEventListener( 'keydown', ( event ) => {
						if ( event.key === 'Escape' ) {
							closeModal();
							return;
						}

						trapFocus( event, event.currentTarget );
					} );
			}

			const videoWrapper = modal.querySelector(
				'.modal-content__video-wrapper'
			);

			if ( ! videoWrapper ) {
				return;
			}

			let modalMedia;

			if ( video ) {
				const source = video.querySelector( 'source' );
				const src = video.currentSrc || source?.src || video.src;

				if ( ! src ) {
					return;
				}

				modalMedia = document.createElement( 'video' );
				modalMedia.className = 'videos';
				modalMedia.controls = true;
				modalMedia.autoplay = true;
				modalMedia.playsInline = true;
				modalMedia.src = src;

				if ( video.poster ) {
					modalMedia.poster = video.poster;
				}
			} else {
				const src = iframe.getAttribute( 'src' );

				if ( ! src ) {
					return;
				}

				modalMedia = document.createElement( 'iframe' );
				modalMedia.src = addAutoplay( src );
				modalMedia.title = iframe.title || 'Video';
				modalMedia.allow =
					'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
				modalMedia.allowFullscreen = true;
			}

			setVideoSize( videoWrapper );
			setMediaSize( modalMedia );
			videoWrapper.replaceChildren( modalMedia );
			modal.hidden = false;
			modal.classList.add( 'is-active' );
			mediaTrigger.setAttribute( 'aria-expanded', 'true' );
			toggleWrap.setAttribute( 'aria-expanded', 'true' );
			modal.querySelector( '.modal-popup__close' )?.focus();

			if ( video ) {
				modalMedia.play().catch( () => {} );
			}
		};

		mediaTrigger.addEventListener( 'click', ( event ) => {
			event.preventDefault();
			openModal();
		} );

		mediaTrigger.addEventListener( 'keydown', ( event ) => {
			if ( event.key !== 'Enter' && event.key !== ' ' ) {
				return;
			}

			event.preventDefault();
			openModal();
		} );
	} );
} );
