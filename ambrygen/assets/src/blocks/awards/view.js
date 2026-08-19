const sharedResizeState =
	window.__ambryAwardsMarqueeResizeState ||
	( () => {
		const state = {
			callbacks: new Set(),
			timeoutId: null,
		};

		state.handleResize = () => {
			if ( state.timeoutId ) {
				clearTimeout( state.timeoutId );
			}

			state.timeoutId = window.setTimeout( () => {
				state.timeoutId = null;
				state.callbacks.forEach( ( callback ) => callback() );
			}, 100 );
		};

		window.addEventListener( 'resize', state.handleResize );
		window.__ambryAwardsMarqueeResizeState = state;

		return state;
	} )();

document.addEventListener( 'DOMContentLoaded', () => {
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	document.querySelectorAll( '.marquee-slide' ).forEach( ( container ) => {
		if ( container.dataset.marqueeInit ) {
			return;
		}

		container.dataset.marqueeInit = '1';

		const slider = container.querySelector( '.marquee-slide__slider' );
		const sliderItems = Array.from(
			container.querySelectorAll( '.marquee-slide__item' )
		);

		if ( ! slider || ! sliderItems.length ) {
			return;
		}

		const getGap = () => ( window.innerWidth <= 767 ? 16 : 20 );
		const autoSpeed = -3.5;
		const lerp = ( v0, v1, t ) => v0 * ( 1 - t ) + v1 * t;
		const wrap = ( min, max, value ) => {
			const range = max - min;

			return ( ( ( ( value - min ) % range ) + range ) % range ) + min;
		};

		let itemWidth = sliderItems[ 0 ].clientWidth;
		let gap = getGap();
		let wrapWidth = sliderItems.length * ( itemWidth + gap );
		let targetScroll = 0;
		let currentScroll = 0;
		let rafId = null;
		let isVisible = false;

		const dispose = ( scroll ) => {
			sliderItems.forEach( ( item, index ) => {
				const position = index * ( itemWidth + gap ) + scroll;
				const wrapped = wrap(
					-( itemWidth + gap ),
					wrapWidth - ( itemWidth + gap ),
					position
				);

				item.style.transform = `translate3d(${ wrapped }px, 0, 0)`;
			} );
		};

		const updateMeasurements = () => {
			itemWidth = sliderItems[ 0 ].clientWidth;
			gap = getGap();
			wrapWidth = sliderItems.length * ( itemWidth + gap );
		};

		const observer = new IntersectionObserver(
			( entries ) => {
				entries.forEach( ( entry ) => {
					if ( entry.intersectionRatio <= 0.45 ) {
						return;
					}

					entry.target.classList.add( 'is-visible' );
					observer.unobserve( entry.target );
				} );
			},
			{ threshold: [ 0.45 ] }
		);

		const visibilityObserver = new IntersectionObserver(
			( [ entry ] ) => {
				isVisible = entry.isIntersecting;

				if ( isVisible && ! rafId ) {
					render();
				}
			},
			{ threshold: 0 }
		);

		const render = () => {
			if ( ! isVisible ) {
				rafId = null;
				return;
			}

			rafId = requestAnimationFrame( render );

			if ( ! prefersReducedMotion ) {
				targetScroll += autoSpeed;
			}

			currentScroll = lerp( currentScroll, targetScroll, 0.06 );
			dispose( currentScroll );
		};

		dispose( 0 );
		sharedResizeState.callbacks.add( updateMeasurements );
		sliderItems.forEach( ( item ) => observer.observe( item ) );
		visibilityObserver.observe( container );

		if ( prefersReducedMotion || sliderItems.length < 2 ) {
		}
	} );
} );
