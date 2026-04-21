document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll( '.risk-checklist' );

	blocks.forEach( ( block ) => {
		const checkboxes = block.querySelectorAll( '.js-risk-checkbox' );
		const noRiskResult = block.querySelector(
			'.risk-checklist__result--no-risk'
		);
		const atRiskResult = block.querySelector(
			'.risk-checklist__result--at-risk'
		);

		if ( ! checkboxes.length || ! noRiskResult || ! atRiskResult ) {
			return;
		}

		const updateResults = () => {
			const hasSelectedRisk = Array.from( checkboxes ).some(
				( checkbox ) => checkbox.checked
			);

			noRiskResult.classList.toggle(
				'risk-checklist__result--hidden',
				hasSelectedRisk
			);
			atRiskResult.classList.toggle(
				'risk-checklist__result--hidden',
				! hasSelectedRisk
			);
		};

		checkboxes.forEach( ( checkbox ) => {
			checkbox.addEventListener( 'change', updateResults );
		} );

		updateResults();
	} );
} );
