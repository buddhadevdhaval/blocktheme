document.addEventListener( 'DOMContentLoaded', () => {
	// Select all features-media blocks
	const blocks = document.querySelectorAll( '.features-media' );

	blocks.forEach( ( block ) => {
		const playIcon = block.querySelector(
			'.play-icon-video .play-icon img'
		);
		const pauseIcon = block.querySelector(
			'.play-icon-video .pause-icon img'
		);

		if ( ! playIcon || ! pauseIcon ) {
			return;
		}

		// MP4 Video
		const video = block.querySelector( 'video.videos' );

		// Iframe (YouTube / Vimeo)
		const iframe = block.querySelector(
			'.features-media__video-wrapper--iframe iframe'
		);

		const setPlaying = ( isPlaying ) => {
			block.classList.toggle( 'is-playing', isPlaying );
		};

		/* ===================== MP4 VIDEO ===================== */
		if ( video ) {
			playIcon.addEventListener( 'click', () => {
				video.play();
				setPlaying( true );
			} );

			pauseIcon.addEventListener( 'click', () => {
				video.pause();
				setPlaying( false );
			} );

			// Sync UI if video ends
			video.addEventListener( 'ended', () => {
				setPlaying( false );
			} );

			return; // Skip iframe logic if MP4 exists
		}

		/* ===================== IFRAME VIDEO ===================== */
		if ( iframe ) {
			playIcon.addEventListener( 'click', () => {
				const src = iframe.getAttribute( 'src' );

				if ( ! src.includes( 'autoplay=1' ) ) {
					const joiner = src.includes( '?' ) ? '&' : '?';
					iframe.setAttribute(
						'src',
						`${ src }${ joiner }autoplay=1`
					);
				}

				setPlaying( true );
			} );

			pauseIcon.addEventListener( 'click', () => {
				const src = iframe.getAttribute( 'src' );
				// Remove autoplay query
				const cleanSrc = src.replace( /(\?|&)autoplay=1/, '' );
				iframe.setAttribute( 'src', cleanSrc );

				setPlaying( false );
			} );
		}
	} );
} );
