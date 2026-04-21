document.addEventListener( 'DOMContentLoaded', () => {
	const containers = document.querySelectorAll( '.collaborators-list' );

	containers.forEach( ( container ) => {
		const header = container.querySelector( '.collaborators-list__header' );
		const wrapper = container.querySelector(
			'.collaborators-list__content-wrapper'
		);

		if ( ! header || ! wrapper ) {
			return;
		}

		header.addEventListener( 'click', () => {
			const isOpen = container.getAttribute( 'data-amb-open' ) === 'true';
			const newOpen = ! isOpen;

			container.setAttribute(
				'data-amb-open',
				newOpen ? 'true' : 'false'
			);
			header.setAttribute( 'aria-expanded', newOpen ? 'true' : 'false' );

			if ( newOpen ) {
				wrapper.style.display = 'block';
				const height = wrapper.scrollHeight;
				wrapper.animate(
					[
						{ height: '0', opacity: 0 },
						{ height: height + 'px', opacity: 1 },
					],
					{
						duration: 300,
						easing: 'ease-out',
					}
				).onfinish = () => {
					wrapper.style.height = 'auto';
				};
			} else {
				const height = wrapper.scrollHeight;
				wrapper.animate(
					[
						{ height: height + 'px', opacity: 1 },
						{ height: '0', opacity: 0 },
					],
					{
						duration: 300,
						easing: 'ease-in',
					}
				).onfinish = () => {
					wrapper.style.display = 'none';
					wrapper.style.height = '0';
				};
			}
		} );
	} );
} );
