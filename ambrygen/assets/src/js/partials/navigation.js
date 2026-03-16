// document.addEventListener('DOMContentLoaded', () => {
// 	if (window.innerWidth < 1023) return;

// 	document.querySelectorAll('.nav__item--mega-menu').forEach(megaMenu => {
// 		const catItems = megaMenu.querySelectorAll('.submenu-inner-link');
// 		const submenus = megaMenu.querySelectorAll('.category-submenu-lists');

// 		if (!catItems.length || !submenus.length) return;

// 		catItems[0]?.classList.add('hover-active');
// 		submenus[0]?.classList.add('submenu-active');

// 		catItems.forEach((item, index) => {
// 			item.addEventListener('mouseenter', () => {
// 				catItems.forEach(i => i.classList.remove('hover-active'));
// 				submenus.forEach(s => s.classList.remove('submenu-active'));

// 				item.classList.add('hover-active');
// 				submenus[index]?.classList.add('submenu-active');
// 			});
// 		});
// 	});
// });
function setPowerActiveNav() {
	const currentPath = window.location.pathname.replace( /\/$/, '' ) || '/';
	const navItems = document.querySelectorAll( '.nav__list > li' );

	navItems.forEach( ( item ) => {
		const links = item.querySelectorAll( 'a' );
		let isMatch = false;

		// FIX: You must loop through the links to remove a class from each one
		links.forEach( ( link ) => {
			link.classList.remove( 'active-item' );

			const hrefAttr = link.getAttribute( 'href' );

			// Skip hashes, empty, or javascript links
			if (
				! hrefAttr ||
				hrefAttr === '#' ||
				hrefAttr.startsWith( 'javascript:' )
			) {
				return;
			}

			// Use link.pathname for reliable comparison
			const linkPath = link.pathname.replace( /\/$/, '' ) || '/';

			if ( linkPath.toLowerCase() === currentPath.toLowerCase() ) {
				isMatch = true;
				link.classList.add( 'active-item' );
			}
		} );

		// 'item' is the <li> from the outer loop
		if ( item ) {
			if ( isMatch ) {
				item.classList.add( 'current-menu-item' );
			} else {
				item.classList.remove( 'current-menu-item' );
			}
		}
	} );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', setPowerActiveNav );
} else {
	setPowerActiveNav();
}

document.addEventListener( 'DOMContentLoaded', () => {
	/* =====================================================
	 * MODULE 0: Desktop guard
	 * ===================================================== */
	const isDesktop = window.innerWidth >= 1023;

	/* =====================================================
	 * MODULE 1: Parent Nav Item Active State (Desktop)
	 * ===================================================== */
	if ( isDesktop ) {
		document
			.querySelectorAll( '.nav__item--menu-has-children' )
			.forEach( ( navItem ) => {
				const navLink = navItem.querySelector( '.nav__link' );
				const megaMenu = navItem.querySelector(
					'.nav__item--mega-menu'
				);

				if ( ! megaMenu || ! navLink ) {
					return;
				}

				// Activate parent nav item on hover
				navItem.addEventListener( 'mouseenter', () => {
					navItem.classList.add( 'active' );
				} );

				// Deactivate parent nav item when leaving
				navItem.addEventListener( 'mouseleave', () => {
					navItem.classList.remove( 'active' );
				} );

				/* =====================================================
				 * MODULE 2: Mega Menu Submenu Hover Switching (Desktop)
				 * ===================================================== */
				const catItems = megaMenu.querySelectorAll(
					'.submenu-inner-link'
				);
				const submenus = megaMenu.querySelectorAll(
					'.category-submenu-lists'
				);

				if ( ! catItems.length || ! submenus.length ) {
					return;
				}

				// Default active state (first item)
				catItems[ 0 ].classList.add( 'hover-active' );
				submenus[ 0 ].classList.add( 'submenu-active' );

				catItems.forEach( ( item, index ) => {
					item.addEventListener( 'mouseenter', () => {
						// Reset active states
						catItems.forEach( ( i ) =>
							i.classList.remove( 'hover-active' )
						);
						submenus.forEach( ( s ) =>
							s.classList.remove( 'submenu-active' )
						);

						// Activate current submenu
						item.classList.add( 'hover-active' );
						submenus[ index ]?.classList.add( 'submenu-active' );

						// Ensure parent stays active
						navItem.classList.add( 'active' );
					} );
				} );
			} );
	}

	/* =====================================================
	 * MODULE 3: Mobile / Menu Button Toggle
	 * ===================================================== */
	const menuBtn = document.querySelector( '.nav__menu-btn' );
	const navOverlay = document.querySelector( '.nav__overlay' );
	const body = document.body;

	if ( ! menuBtn || ! navOverlay ) {
		return;
	}

	menuBtn.addEventListener( 'click', () => {
		const isOpen = navOverlay.classList.contains( 'open' );

		if ( isOpen ) {
			// Close menu
			navOverlay.classList.remove( 'open' );
			body.classList.remove( 'no-overflow' );
		} else {
			// Open menu
			navOverlay.classList.add( 'open' );
			body.classList.add( 'no-overflow' );
		}
	} );

	/* =====================================================
	 * MODULE 4: Mobile Parent Menu Activate (Click Only)
	 * ===================================================== */
	if ( ! isDesktop ) {
		document
			.querySelectorAll(
				'.nav__item.nav__item--has-children.nav__item--menu-has-children'
			)
			.forEach( ( navItem ) => {
				const trigger =
					navItem.querySelector( '.nav__link' ) ||
					navItem.querySelector( '.nav__item--angle' );

				if ( ! trigger ) {
					return;
				}

				trigger.addEventListener( 'click', ( e ) => {
					e.preventDefault();

					// Only ADD active (no toggle, no remove)
					navItem.classList.add( 'active' );
				} );
			} );
	}

	/* =====================================================
	 * MODULE 5: Mobile Drawer Close – Reset Active States
	 * ===================================================== */
	if ( ! isDesktop ) {
		document.addEventListener( 'click', ( e ) => {
			const closeBtn = e.target.closest( '.main-drawer-close-button' );
			if ( ! closeBtn ) {
				return;
			}

			document
				.querySelectorAll(
					'.nav__item--has-children.nav__item--menu-has-children.active'
				)
				.forEach( ( navItem ) => {
					navItem.classList.remove( 'active' );
				} );
		} );
	}

	/* =====================================================
	 * MODULE 6: Responsive Nav Overlay Height (Top Bar Aware)
	 * ===================================================== */

	const topBar = document.getElementById( 'top-bar-ajax' );
	const header = document.querySelector( '.header' );
	const closeBtn = topBar?.querySelector( '.top-bar__close' );

	// if ( ! topBar || ! closeBtn ) {
	// 	return;
	// }

	/**
	 * Mobile-only overlay height calculation
	 */
	const updateOverlayHeightMobile = () => {
		if ( ! navOverlay ) {
			return;
		}
		const topBarHeight =
			topBar && getComputedStyle( topBar ).display !== 'none'
				? topBar.offsetHeight
				: 0;

		const headerHeight = header ? header.offsetHeight : 0;
		const totalHeight = topBarHeight + headerHeight;

		// Mobile only
		if ( window.innerWidth < 1023 ) {
			navOverlay.style.height = `calc(100vh - ${ totalHeight }px)`;
			body.style.paddingTop = `${ totalHeight }px`;
		} else {
			// Reset on desktop
			navOverlay.style.removeProperty( 'height' );
			body.style.removeProperty( 'padding-top' );
		}
	};

	/* =====================================================
	 * Initial mobile calculation
	 * ===================================================== */
	updateOverlayHeightMobile();

	/* =====================================================
	 * Top Bar Close (Desktop + Mobile)
	 * ===================================================== */
	closeBtn.addEventListener( 'click', () => {
		topBar.style.display = 'none';

		// Recalculate ONLY on mobile
		updateOverlayHeightMobile();
	} );

	/* =====================================================
	 * Recalculate on Resize (Mobile Only)
	 * ===================================================== */
	window.addEventListener( 'resize', () => {
		updateOverlayHeightMobile();
	} );

	if ( ! isDesktop ) {
		/* =====================================================
		 * MODULE 7: Mega Menu Item Click – Add Active Class
		 * ===================================================== */
		document
			.querySelectorAll( '.nav__item--mega-menu__links' )
			.forEach( ( link ) => {
				link.addEventListener( 'click', ( e ) => {
					e.preventDefault(); // Optional, if you don't want the link to navigate

					const parentItem = link.closest(
						'.nav__item--mega-menu__item'
					);
					if ( ! parentItem ) {
						return;
					}

					// Remove active from other mega menu items
					parentItem.parentElement
						.querySelectorAll(
							'.nav__item--mega-menu__item.active'
						)
						.forEach( ( item ) =>
							item.classList.remove( 'active' )
						);

					// Add active to the clicked item's parent
					parentItem.classList.add( 'active' );
				} );
			} );

		/* =====================================================
		 * MODULE 8: Mega Menu Submenu Close – Remove Active Class
		 * ===================================================== */
		document
			.querySelectorAll( '.submenu__close-button' )
			.forEach( ( btn ) => {
				btn.addEventListener( 'click', ( e ) => {
					e.preventDefault();

					const parentItem = btn.closest(
						'.nav__item--mega-menu__item'
					);
					if ( ! parentItem ) {
						return;
					}

					// Remove active class
					parentItem.classList.remove( 'active' );
				} );
			} );
	}

	/* =====================================================
	 * MODULE 9: Shrink Header on Scroll (Sticky)
	 * ===================================================== */
	const headersection = document.querySelector( '.header-section' ); // Adjust selector if needed
	const shrinkClass = 'shrink';
	const scrollThreshold = 50; // px scrolled before shrinking

	if ( headersection ) {
		window.addEventListener( 'scroll', () => {
			if ( window.scrollY > scrollThreshold ) {
				headersection.classList.add( shrinkClass );
			} else {
				headersection.classList.remove( shrinkClass );
			}
		} );
	}

	/* =====================================================
	 * MODULE 10: Header Search Form Toggle (Using .search-toggle)
	 * ===================================================== */
	const headerSearch = document.querySelector( '.header__search' );
	const searchToggle = headerSearch?.querySelector( '.search-toggle' );
	const headerSearchForm = document.getElementById( 'header-search-form' );

	if ( ! headerSearch || ! searchToggle || ! headerSearchForm ) {
		return;
	}

	searchToggle.addEventListener( 'click', ( e ) => {
		e.preventDefault();
		e.stopPropagation();

		headerSearch.classList.toggle( 'open' );

		if ( headerSearch.classList.contains( 'open' ) ) {
			headerSearchForm.querySelector( 'input[name="s"]' )?.focus();
		}
	} );

	document.addEventListener( 'click', ( e ) => {
		if ( ! headerSearch.contains( e.target ) ) {
			headerSearch.classList.remove( 'open' );
		}
	} );

	headerSearchForm.addEventListener( 'click', ( e ) => {
		e.stopPropagation();
	} );
} );
