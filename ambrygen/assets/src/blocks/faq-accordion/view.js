document.addEventListener( 'DOMContentLoaded', () => {
	const accordions = document.querySelectorAll( '.faq__item' );

	accordions.forEach( ( accordion ) => {
		const summary = accordion.querySelector( 'summary' );
		const content = accordion.querySelector( '.faq__answer' );

		if ( ! summary || ! content ) {
			return;
		}

		let isAnimating = false;

		summary.addEventListener( 'click', ( e ) => {
			e.preventDefault();

			if ( isAnimating ) {
				return;
			}

			isAnimating = true;
			accordion.style.overflow = 'hidden';

			if ( accordion.open ) {
				// We are closing
				summary.setAttribute( 'aria-expanded', 'false' );

				const startHeight = `${ accordion.offsetHeight }px`;
				const endHeight = `${ summary.offsetHeight }px`;

				const animation = accordion.animate(
					{
						height: [ startHeight, endHeight ],
					},
					{
						duration: 700,
						easing: 'ease-in-out',
					}
				);

				animation.onfinish = () => {
					accordion.open = false;
					accordion.style.height = '';
					accordion.style.overflow = '';
					isAnimating = false;
				};
				animation.oncancel = () => {
					isAnimating = false;
				};
			} else {
				// We are opening
				summary.setAttribute( 'aria-expanded', 'true' );
				accordion.open = true;

				const startHeight = `${ summary.offsetHeight }px`;
				const endHeight = `${
					summary.offsetHeight + content.offsetHeight
				}px`;

				const animation = accordion.animate(
					{
						height: [ startHeight, endHeight ],
					},
					{
						duration: 700,
						easing: 'ease-in-out',
					}
				);

				animation.onfinish = () => {
					accordion.style.height = '';
					accordion.style.overflow = '';
					isAnimating = false;
				};
				animation.oncancel = () => {
					isAnimating = false;
				};
			}
		} );
	} );
} );
