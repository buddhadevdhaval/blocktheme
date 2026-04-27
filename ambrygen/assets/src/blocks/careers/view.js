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

	const createModal = () => {
		const modal = document.createElement( 'div' );
		modal.className = 'modal-popup modal-popup--video';
		modal.innerHTML = `
			<div class="modal-popup__overlay"></div>
			<div class="modal-popup__panel" role="dialog" aria-modal="true" aria-label="Video dialog">
				<button type="button" class="modal-popup__close" aria-label="Close modal">
					<img decoding="async" src="${ closeIcon }" alt="Close" />
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

	blocks.forEach( ( block ) => {
		const toggleWrap = block.querySelector( '.play-icon-video' );
		const playIcon = toggleWrap?.querySelector( '.play-icon' );
		const pauseIcon = toggleWrap?.querySelector( '.pause-icon' );

		if ( ! toggleWrap || ! playIcon || ! pauseIcon ) {
			return;
		}

		pauseIcon.style.display = 'none';

		const video = block.querySelector( 'video.videos' );
		const iframe = block.querySelector( '.video-embed iframe' );

		if ( ! video && ! iframe ) {
			return;
		}

		let modal = null;

		const closeModal = () => {
			if ( ! modal ) {
				return;
			}

			modal.classList.remove( 'is-active' );
			modal
				.querySelector( '.modal-content__video-wrapper' )
				?.replaceChildren();
		};

		const openModal = () => {
			if ( ! modal ) {
				modal = createModal();
				block.appendChild( modal );
				modal
					.querySelector( '.modal-popup__overlay' )
					?.addEventListener( 'click', closeModal );
				modal
					.querySelector( '.modal-popup__close' )
					?.addEventListener( 'click', closeModal );
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
			modal.classList.add( 'is-active' );

			if ( video ) {
				modalMedia.play().catch( () => {} );
			}
		};

		toggleWrap.addEventListener( 'click', ( event ) => {
			event.preventDefault();
			openModal();
		} );

		toggleWrap.addEventListener( 'keydown', ( event ) => {
			if ( event.key !== 'Enter' && event.key !== ' ' ) {
				return;
			}

			event.preventDefault();
			openModal();
		} );

		document.addEventListener( 'keydown', ( event ) => {
			if (
				event.key === 'Escape' &&
				modal?.classList.contains( 'is-active' )
			) {
				closeModal();
			}
		} );
	} );
} );
