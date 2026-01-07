// Wait until the DOM is fully loaded before executing the script
document.addEventListener( 'DOMContentLoaded', function() {
	// Function to equalize heights of elements within a specific section
	// Parameters:
	// - sectionSelector: The section (or container) selector (default is 'section')
	// - elementSelector: The selector for the elements whose heights we want to equalize
	function equalizeSectionHeights( sectionSelector = 'section', elementSelector ) {
		// Select all sections based on the given sectionSelector
		const sections = document.querySelectorAll( sectionSelector );

		// Loop through each section
		sections.forEach( function( section ) {
			// Select all elements inside the current section based on elementSelector
			const elements = section.querySelectorAll( elementSelector );
			let maxHeight = 0;

			// Reset heights to 'auto' for all elements before recalculating max height
			elements.forEach( function( element ) {
				element.style.height = 'auto';
			} );

			// Calculate the maximum height of all elements in the section
			elements.forEach( function( element ) {
				const elementHeight = element.offsetHeight;
				if ( elementHeight > maxHeight ) {
					maxHeight = elementHeight; // Update max height if current element's height is greater
				}
			} );

			// Apply the max height to all elements in the current section
			elements.forEach( function( element ) {
				element.style.height = maxHeight + 'px';
			} );
		} );
	}

	// Function to equalize heights for all sections (title, content, button, etc.)
	function equalizeAllSections() {
		// Wait 1.5 seconds before executing to ensure elements have been loaded/rendered
		setTimeout( () => {
			// Only equalize heights on larger screens (e.g., desktop or tablet)
			if ( window.innerWidth > 767 ) {
				// equalizeSectionHeights( 'section', '.selector' ); // Example: Title section
			}
		}, 1500 );
	}

	// Debounce function to limit how often a function is called (useful for resizing events)
	// It ensures that the function is not called too frequently
	function debounce( func, delay ) {
		let timeout;
		return function() {
			clearTimeout( timeout );
			timeout = setTimeout( func, delay );
		};
	}

	// Equalize heights on page load
	equalizeAllSections();

	// Recalculate heights on window resize, with debouncing to avoid excessive calls
	window.addEventListener( 'resize', debounce( equalizeAllSections, 1500 ) );
} );
