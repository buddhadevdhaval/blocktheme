/**
 * Front-end JS for Careers Highlight Block
 * Handles play / pause for video & iframe
 */ document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll( '.careers-highlight' );

	blocks.forEach( ( block ) => {
		const toggleWrap = block.querySelector( '.play-icon-video' );
		const playIcon = toggleWrap?.querySelector( '.play-icon' );
		const pauseIcon = toggleWrap?.querySelector( '.pause-icon' );

		const video = block.querySelector( 'video.videos' );
		const iframe = block.querySelector( '.video-embed iframe' );

		if ( ! toggleWrap || ! playIcon || ! pauseIcon ) {
			return;
		}

		// Initial state
		pauseIcon.style.display = 'none';

		const setPlayingState = ( isPlaying ) => {
			block.classList.toggle( 'is-playing', isPlaying );
			playIcon.style.display = isPlaying ? 'none' : '';
			pauseIcon.style.display = isPlaying ? '' : 'none';
		};

		/* =====================
		 * MP4 VIDEO
		 * ===================== */
		if ( video ) {
			toggleWrap.addEventListener( 'click', ( event ) => {
				event.preventDefault();
				if ( video.paused ) {
					video.play();
					setPlayingState( true );
				} else {
					video.pause();
					setPlayingState( false );
				}
			} );

			video.addEventListener( 'ended', () => {
				setPlayingState( false );
			} );

			return;
		}

		/* =====================
		 * IFRAME (YouTube/Vimeo basic)
		 * ===================== */
		if ( iframe ) {
			toggleWrap.addEventListener( 'click', ( event ) => {
				event.preventDefault();
				const src = iframe.getAttribute( 'src' );

				if ( block.classList.contains( 'is-playing' ) ) {
					// Remove autoplay (fake pause)
					const cleanSrc = src.replace( /(\?|&)autoplay=1/, '' );
					iframe.setAttribute( 'src', cleanSrc );
					setPlayingState( false );
				} else {
					const joiner = src.includes( '?' ) ? '&' : '?';
					iframe.setAttribute(
						'src',
						`${ src }${ joiner }autoplay=1`
					);
					setPlayingState( true );
				}
			} );
		}
	} );
} );

// import SimpleBar from 'simplebar';
// import 'simplebar/dist/simplebar.css';

// import ResizeObserver from 'resize-observer-polyfill';
// window.ResizeObserver = ResizeObserver;

// document.addEventListener('DOMContentLoaded', () => {
// 	const careersRows = document.querySelectorAll('.careers-highlight__row');

// 	careersRows.forEach((row) => {

// 		const media = row.querySelector('.careers-highlight__media');
// 		const scroll = row.querySelector('.custom-scroll-jobs');

// 		if (!media || !scroll) {
// 			return;
// 		}

// 		// Explicitly initialize SimpleBar
// 		const simpleBarInstance = new SimpleBar(scroll, {
// 			autoHide: false, // Ensure the scrollbar is always accessible / visible if needed
// 		});

// 		// Use the loaded ResizeObserver to track container changes effectively
// 		if (window.ResizeObserver) {
// 			const ro = new window.ResizeObserver(() => {
// 				simpleBarInstance.recalculate();
// 			});
// 			ro.observe(row);
// 		}
// 	});
// });
