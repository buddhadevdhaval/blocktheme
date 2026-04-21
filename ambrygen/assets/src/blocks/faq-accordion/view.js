document.addEventListener( 'DOMContentLoaded', () => {
	const accordions = document.querySelectorAll( '.faq__item' );

	accordions.forEach( ( accordion ) => {
		const summary = accordion.querySelector( 'summary' );
		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;

		if ( ! summary ) {
			return;
		}

		let animation = null;
		let isClosing = false;
		let isExpanding = false;

		summary.setAttribute(
			'aria-expanded',
			accordion.open ? 'true' : 'false'
		);

		const onAnimationFinish = ( open ) => {
			accordion.open = open;
			animation = null;
			isClosing = false;
			isExpanding = false;
			accordion.style.height = '';
			accordion.style.overflow = '';
			summary.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
		};

		const shrink = () => {
			isClosing = true;
			const startHeight = `${ accordion.offsetHeight }px`;
			const endHeight = `${ summary.offsetHeight }px`;

			if ( animation ) {
				animation.cancel();
			}

			accordion.style.overflow = 'hidden';
			animation = accordion.animate(
				{
					height: [ startHeight, endHeight ],
				},
				{
					duration: 350,
					easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
				}
			);

			animation.onfinish = () => onAnimationFinish( false );
			animation.oncancel = () => {
				isClosing = false;
			};
		};

		const expand = () => {
			isExpanding = true;
			const startHeight = `${ accordion.offsetHeight }px`;

			accordion.open = true;
			summary.setAttribute( 'aria-expanded', 'true' );

			requestAnimationFrame( () => {
				const endHeight = `${ accordion.scrollHeight }px`;

				if ( animation ) {
					animation.cancel();
				}

				accordion.style.overflow = 'hidden';
				animation = accordion.animate(
					{
						height: [ startHeight, endHeight ],
					},
					{
						duration: 350,
						easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
					}
				);

				animation.onfinish = () => onAnimationFinish( true );
				animation.oncancel = () => {
					isExpanding = false;
				};
			} );
		};

		summary.addEventListener( 'click', ( e ) => {
			e.preventDefault();

			if ( prefersReducedMotion ) {
				accordion.open = ! accordion.open;
				summary.setAttribute(
					'aria-expanded',
					accordion.open ? 'true' : 'false'
				);
				return;
			}

			if ( isClosing || ! accordion.open ) {
				expand();
			} else if ( isExpanding || accordion.open ) {
				shrink();
			}
		} );
	} );
} );
