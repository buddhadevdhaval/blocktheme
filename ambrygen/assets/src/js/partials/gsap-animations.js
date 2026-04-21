/**
 * Global GSAP Scroll Animations
 *
 * Targets any element with the class `js-gsap-fade` across the site.
 * No per-block JS needed — just add the class to any HTML element in render.php.
 *
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

	gsap.set( fadeItems, { y: 15, opacity: 0 } );

	ScrollTrigger.batch( fadeItems, {
		interval: 0.15,
		batchMax: 4,
		onEnter: ( batch ) => {
			gsap.to( batch, {
				opacity: 1,
				y: 0,
				duration: 0.6,
				stagger: 0.15,
				ease: 'power2.out',
				overwrite: true,
				clearProps: 'all',
			} );
		},
		start: 'top 85%',
	} );
} );
