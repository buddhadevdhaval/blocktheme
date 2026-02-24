/**
 * Front-end JS for Careers Highlight Block
 * Handles play / pause for video & iframe
 */

document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll( '.careers-highlight' );

	blocks.forEach( ( block ) => {
		const playIcon = block.querySelector(
			'.careers-highlight__play-icon-video'
		);
		const pauseIcon = block.querySelector(
			'.careers-highlight__pause-icon'
		);

		if ( ! playIcon || ! pauseIcon ) {
			return;
		}

		// MP4 video
		const video = block.querySelector( 'video.videos' );

		// Iframe (YouTube / Vimeo)
		const iframe = block.querySelector( '.video-embed iframe' );

		const setPlaying = ( isPlaying ) => {
			block.classList.toggle( 'is-playing', isPlaying );
		};

		/* =====================
		 * MP4 VIDEO
		 * ===================== */
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

			return;
		}

		/* =====================
		 * IFRAME VIDEO
		 * ===================== */
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
				// Iframes can't be truly paused without API
				// Reload iframe without autoplay
				const cleanSrc = iframe
					.getAttribute( 'src' )
					.replace( /(\?|&)autoplay=1/, '' );

				iframe.setAttribute( 'src', cleanSrc );
				setPlaying( false );
			} );
		}
	} );
} );

import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.css';

import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

document.addEventListener( 'DOMContentLoaded', () => {
	const media = document.querySelector( '.careers-highlight__media' );
	const scroll = document.querySelector( '.custom-scroll-jobs' );

	if ( ! media || ! scroll ) {
		return;
	}

	const resize = () => {
		const height = `${ media.offsetHeight }px`;
		scroll.style.maxHeight = height;

		// Recalculate SimpleBar after height change
		if ( window.SimpleBar && window.SimpleBar.getSimpleBarInstance ) {
			const instance = window.SimpleBar.getSimpleBarInstance( scroll );
			if ( instance ) {
				instance.recalculate();
			}
		}
	};

	// Initial call
	resize();
	window.addEventListener( 'resize', resize );
} );
