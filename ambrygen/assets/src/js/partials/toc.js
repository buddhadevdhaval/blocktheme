document.addEventListener( 'DOMContentLoaded', function () {
	if ( ! document.body.classList.contains( 'single-post' ) ) {
		return;
	}

	let blogHTML = '';
	const addedHeadings = [];

	document
		.querySelectorAll(
			'.combo-color-row h2, .combo-color-row h3, .combo-color-row h4, .combo-color-row h5'
		)
		.forEach( function ( heading ) {
			const baseId = heading.textContent
				.toLowerCase()
				.replace( /[^a-zA-Z0-9 ]/g, '' )
				.replace( /\s+/g, '-' )
				.trim();

			if (
				heading.closest( 'a' )?.querySelector( 'img' ) ||
				heading.querySelector( 'img' ) ||
				heading.previousElementSibling?.tagName === 'IMG' ||
				heading.closest( '.sidebar-items' )
			) {
				return; // Skip this heading
			}
			if ( ! baseId ) {
				return;
			}

			let id = baseId;
			let counter = 1;
			while ( addedHeadings.includes( id ) ) {
				id = `${ baseId }-${ counter++ }`;
			}

			const wrapper = document.createElement( 'div' );
			wrapper.classList.add( 'jump-link-post' );
			wrapper.id = id;

			heading.replaceWith( wrapper );
			wrapper.appendChild( heading );

			const itemHTML = `<li class="sidebar-items"><a href="#${ id }">${ heading.textContent }</a></li>`;
			blogHTML += itemHTML;
			addedHeadings.push( id );
		} );

	// Populate both sidebar and mobile TOC
	const sidebarMenus = document.querySelectorAll( '.sidebar-menu' );
	const mobileTOC = document.querySelector( '.tab-dropdown .dropdown-menu' );
	const mobileWrapper = document.querySelector( '.tab-dropdown' );
	const desktopWrapper = document.querySelector( '.tab-content-view' );

	if ( blogHTML === '' ) {
		document
			.querySelectorAll(
				'.sidebar-title, .sidebar-menu, .blog-detail-table-of-content'
			)
			.forEach( ( el ) => ( el.style.display = 'none' ) );
	} else {
		sidebarMenus.forEach( ( menu ) => ( menu.innerHTML += blogHTML ) );
		if ( mobileTOC ) {
			mobileTOC.innerHTML = blogHTML;
		}
	}

	// Show/hide based on screen size
	function toggleTOCDisplay() {
		const isMobile = window.innerWidth < 991;

		if ( mobileWrapper ) {
			mobileWrapper.style.display = isMobile ? 'block' : 'none';
		}
		if ( desktopWrapper ) {
			desktopWrapper.style.display = isMobile ? 'none' : 'block';
		}
	}

	// Initial check
	toggleTOCDisplay();

	// Update on resize
	window.addEventListener( 'resize', toggleTOCDisplay );

	// Highlight current section on scroll
	let prevContentId = null;

	window.addEventListener( 'scroll', function () {
		document
			.querySelectorAll( '.jump-link-post' )
			.forEach( function ( section ) {
				if ( isInViewport( section ) ) {
					const currentId = section.id;
					if ( currentId !== prevContentId ) {
						updateTOC( currentId );
						prevContentId = currentId;
					}
				}
			} );
	} );

	function updateTOC( id ) {
		document
			.querySelectorAll( '.sidebar-menu li, .dropdown-menu li' )
			.forEach( ( li ) => li.classList.remove( 'active' ) );
		document
			.querySelectorAll(
				`.sidebar-menu a[href="#${ id }"], .dropdown-menu a[href="#${ id }"]`
			)
			.forEach( ( link ) => {
				link.closest( 'li' )?.classList.add( 'active' );
			} );
	}

	function isInViewport( el ) {
		const rect = el.getBoundingClientRect();
		return rect.top >= 0 && rect.top < window.innerHeight * 0.4;
	}

	// Mobile dropdown toggle
	const toggleBtn = document.querySelector(
		'.tab-dropdown .dropdown-toggle'
	);
	const dropdownMenu = document.querySelector(
		'.tab-dropdown .dropdown-menu'
	);
	const dropdownWrapper = document.querySelector( '.tab-dropdown' );

	if ( toggleBtn && dropdownMenu ) {
		toggleBtn.addEventListener( 'click', () => {
			const isOpen = dropdownMenu.classList.toggle( 'show' );
			toggleBtn.setAttribute(
				'aria-expanded',
				isOpen ? 'false' : 'true'
			);
		} );
		dropdownMenu.querySelectorAll( 'a' ).forEach( ( link ) => {
			link.addEventListener( 'click', () => {
				const linkText = link.textContent.trim();

				// Update button label
				toggleBtn.textContent = linkText;

				// Close dropdown
				dropdownMenu.classList.remove( 'show' );
				toggleBtn.setAttribute( 'aria-expanded', 'false' );
				dropdownWrapper.classList.remove( 'open' );
			} );
		} );
	}
} );
