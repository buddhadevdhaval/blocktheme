/**
 * Global GSAP Scroll Animations
 * Usage in render.php:
 *   <div class="my-block__item js-gsap-fade">...</div>
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

document.addEventListener( 'DOMContentLoaded', () => {
	const fadeItems = document.querySelectorAll( '.js-gsap-fade' );

	if ( ! fadeItems.length ) {
		return;
	}

	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	if ( prefersReducedMotion ) {
		gsap.set( fadeItems, { opacity: 1, y: 0, clearProps: 'all' } );
		return;
	}

	gsap.set( fadeItems, { y: 8, opacity: 0 } );

	ScrollTrigger.batch( fadeItems, {
		interval: 0.1,
		batchMax: 6,
		onEnter: ( batch ) => {
			gsap.to( batch, {
				opacity: 1,
				y: 0,
				duration: 0.35,
				stagger: 0.05,
				ease: 'power1.out',
				overwrite: true,
				clearProps: 'all',
			} );
		},
		start: 'top 95%',
	} );
} );
