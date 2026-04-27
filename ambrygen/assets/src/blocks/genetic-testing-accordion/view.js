/**
 * Genetic Testing Accordion View Script – Smooth Transitions
 */

document.addEventListener( 'DOMContentLoaded', () => {
	const accordionWraps = document.querySelectorAll( '.genetic-testing-table-wrap' );

	accordionWraps.forEach( ( wrap ) => {
		const toggles = wrap.querySelectorAll( '.js-accordion-toggle' );

		toggles.forEach( ( toggle ) => {
			const targetId = toggle.getAttribute( 'data-amb-target' );
			const content = targetId ? wrap.querySelector( targetId ) : null;
			const contentRow = toggle.nextElementSibling;

			if (
				! content ||
				! contentRow ||
				! contentRow.classList.contains( 'js-accordion-row' )
			) {
				return;
			}

			let animation = null;
			let isAnimating = false;

			const toggleAccordion = ( event ) => {
				event.preventDefault();
				event.stopPropagation();

				if ( isAnimating ) return;

				const isOpen = toggle.getAttribute( 'data-amb-open' ) === 'true';

				if ( isOpen ) {
					shrink();
				} else {
					expand();
				}
			};

			const shrink = () => {
				isAnimating = true;
				const startHeight = `${ content.offsetHeight }px`;
				const endHeight = '0px';

				if ( animation ) animation.cancel();

				content.style.overflow = 'hidden';
				animation = content.animate(
					{
						height: [ startHeight, endHeight ],
						opacity: [ 1, 0 ],
					},
					{
						duration: 400,
						easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
					}
				);

				animation.onfinish = () => {
					toggle.setAttribute( 'data-amb-open', 'false' );
					toggle.setAttribute( 'aria-expanded', 'false' );
					contentRow.hidden = true;
					content.classList.remove( 'in' );
					content.style.height = '';
					content.style.opacity = '';
					content.style.overflow = '';
					isAnimating = false;
					animation = null;
				};
			};

			const expand = () => {
				isAnimating = true;
				contentRow.hidden = false;
				content.classList.add( 'in' );
				
				const targetHeight = `${ content.scrollHeight }px`;
				
				if ( animation ) animation.cancel();

				content.style.overflow = 'hidden';
				animation = content.animate(
					{
						height: [ '0px', targetHeight ],
						opacity: [ 0, 1 ],
					},
					{
						duration: 400,
						easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
					}
				);

				animation.onfinish = () => {
					toggle.setAttribute( 'data-amb-open', 'true' );
					toggle.setAttribute( 'aria-expanded', 'true' );
					content.style.height = '';
					content.style.opacity = '';
					content.style.overflow = '';
					isAnimating = false;
					animation = null;
				};
			};

			// Initialize default state
			const initialOpen = toggle.getAttribute( 'data-amb-open' ) === 'true';
			toggle.setAttribute( 'aria-expanded', initialOpen ? 'true' : 'false' );
			contentRow.hidden = ! initialOpen;
			if ( initialOpen ) {
				content.classList.add( 'in' );
			}

			toggle.addEventListener( 'click', toggleAccordion );
		} );
	} );
} );
