import closeIcon from '../../images/close-icon.svg';

document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll( '.features-media' );

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
					<img decoding="async" src="${ closeIcon }" alt="" />
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
		videoWrapper.style.backgroundColor = 'transparent';
		videoWrapper.style.borderRadius = '16px';
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
		if ( block.dataset.themeVideoBound === '1' ) {
			return;
		}

		const videoTrigger = block.querySelector(
			'.features-media__video.media_video'
		);
		const toggleWrap = block.querySelector( '.play-icon-video' );
		const playIconWrap = toggleWrap?.querySelector( '.play-icon' );
		const pauseIconWrap = toggleWrap?.querySelector( '.pause-icon' );

		if (
			! videoTrigger ||
			! toggleWrap ||
			! playIconWrap ||
			! pauseIconWrap
		) {
			return;
		}

		block.dataset.themeVideoBound = '1';

		pauseIconWrap.style.display = 'none';

		const video = block.querySelector( 'video.videos' );
		const iframe = block.querySelector(
			'.features-media__video-wrapper--iframe iframe'
		);

		if ( ! video && ! iframe ) {
			return;
		}

		videoTrigger.style.cursor = 'pointer';
		videoTrigger.setAttribute( 'role', 'button' );
		videoTrigger.setAttribute( 'tabindex', '0' );
		videoTrigger.setAttribute( 'aria-haspopup', 'dialog' );
		videoTrigger.setAttribute( 'aria-expanded', 'false' );

		const mediaElements = videoTrigger.querySelectorAll(
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
			document.body.classList.remove( 'no-overflow' );
			videoTrigger.setAttribute( 'aria-expanded', 'false' );
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
				modalMedia.className = 'features-media__iframe';
			}

			setVideoSize( videoWrapper );
			setMediaSize( modalMedia );
			videoWrapper.replaceChildren( modalMedia );
			videoTrigger.setAttribute( 'aria-expanded', 'true' );
			modal.classList.add( 'is-active' );
			document.body.classList.add( 'no-overflow' );

			if ( video ) {
				modalMedia.play().catch( () => {} );
			}
		};

		const handleActivate = ( event ) => {
			event.preventDefault();
			openModal();
		};

		videoTrigger.addEventListener( 'click', handleActivate );
		videoTrigger.addEventListener( 'keydown', ( event ) => {
			if ( event.key !== 'Enter' && event.key !== ' ' ) {
				return;
			}

			handleActivate( event );
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
