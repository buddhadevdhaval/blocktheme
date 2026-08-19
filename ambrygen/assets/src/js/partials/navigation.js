// document.addEventListener('DOMContentLoaded', () => {
// 	if (window.innerWidth < 1023) return;
//
// 	document.querySelectorAll('.nav__item--mega-menu').forEach(megaMenu => {
// 		const catItems = megaMenu.querySelectorAll('.submenu-inner-link');
// 		const submenus = megaMenu.querySelectorAll('.category-submenu-lists');
//
// 		if (!catItems.length || !submenus.length) return;
//
// 		catItems[0]?.classList.add('hover-active');
// 		submenus[0]?.classList.add('submenu-active');
//
// 		catItems.forEach((item, index) => {
// 			item.addEventListener('mouseenter', () => {
// 				catItems.forEach(i => i.classList.remove('hover-active'));
// 				submenus.forEach(s => s.classList.remove('submenu-active'));
//
// 				item.classList.add('hover-active');
// 				submenus[index]?.classList.add('submenu-active');
// 			});
// 		});
// 	});
// });
document.addEventListener( 'DOMContentLoaded', () => {
	const topBarCookiePrefix = 'ambrygen_top_bar_dismissed_';

	const setCookie = ( name, value, days = 1 ) => {
		const expires = new Date();
		expires.setTime( expires.getTime() + days * 24 * 60 * 60 * 1000 );
		document.cookie = `${ name }=${ value }; expires=${ expires.toUTCString() }; path=/`;
	};

	const getCookie = ( name ) => {
		const cookieName = `${ name }=`;
		const cookies = document.cookie.split( ';' );

		for ( let index = 0; index < cookies.length; index++ ) {
			const cookie = cookies[ index ].trim();

			if ( cookie.startsWith( cookieName ) ) {
				return cookie.substring( cookieName.length );
			}
		}

		return null;
	};

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

	if ( menuBtn && navOverlay ) {
		menuBtn.addEventListener( 'click', () => {
			const isOpen = navOverlay.classList.contains( 'open' );

			if ( isOpen ) {
				navOverlay.classList.remove( 'open' );
				body.classList.remove( 'no-overflow' );
				document
					.querySelectorAll( '.nav__list .active' )
					.forEach( ( el ) => {
						el.classList.remove( 'active' );
					} );
			} else {
				navOverlay.classList.add( 'open' );
				body.classList.add( 'no-overflow' );
			}
		} );

		navOverlay.addEventListener( 'click', ( e ) => {
			if ( e.target.closest( '.nav__menu-btn-close' ) ) {
				navOverlay.classList.remove( 'open' );
				body.classList.remove( 'no-overflow' );

				document
					.querySelectorAll( '.nav__list .active' )
					.forEach( ( el ) => {
						el.classList.remove( 'active' );
					} );
			}
		} );
	}

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
					navItem.classList.add( 'active' );
				} );
			} );
	}

	/* =====================================================
	 * MODULE 5: Mobile Drawer Close - Reset Active States
	 * ===================================================== */
	if ( ! isDesktop ) {
		document.addEventListener( 'click', ( e ) => {
			const closeDrawerBtn = e.target.closest(
				'.main-drawer-close-button'
			);
			if ( ! closeDrawerBtn ) {
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
	const topBars = topBar?.querySelectorAll( '.top-bar' ) || [];
	const topBarCloseButtons =
		topBar?.querySelectorAll( '.top-bar__close' ) || [];

	topBars.forEach( ( topBarItem ) => {
		const topBarKey = topBarItem.dataset.topBarKey;

		if (
			topBarKey &&
			getCookie( `${ topBarCookiePrefix }${ topBarKey }` )
		) {
			topBarItem.style.display = 'none';
		}
	} );

	topBar?.querySelectorAll( '.top-bar__toggle' ).forEach( ( toggle ) => {
		const topBarItem = toggle.closest( '.top-bar' );
		const textContent = topBarItem?.querySelector(
			'.top-bar__text-content'
		);
		const summary = topBarItem?.querySelector( '.top-bar__summary' );
		const details = topBarItem?.querySelector( '.top-bar__details' );
		const label = toggle.querySelector( '.top-bar__toggle-label' );

		Object.assign( toggle.style, {
			background: 'transparent',
			border: '0',
			color: 'inherit',
			display: 'contents',
			cursor: 'pointer',
			marginLeft: '8px',
			padding: '0',
		} );

		if ( textContent ) {
			Object.assign( textContent.style, {
				display: 'block',
				flex: '1',
				textAlign: 'center',
			} );
		}

		toggle.addEventListener( 'click', () => {
			if (
				! topBarItem ||
				! textContent ||
				! summary ||
				! details ||
				! label
			) {
				return;
			}

			const isExpanded =
				topBarItem.classList.toggle( 'top-bar--expanded' );

			toggle.setAttribute( 'aria-expanded', String( isExpanded ) );
			details.hidden = ! isExpanded;
			label.innerHTML = isExpanded ? 'Read Less' : 'Read More';

			if ( isExpanded ) {
				textContent.appendChild( toggle );
			} else {
				summary.insertAdjacentElement( 'afterend', toggle );
			}

			Object.assign( textContent.style, {
				display: isExpanded ? 'flex' : 'block',
				flexDirection: isExpanded ? 'column' : '',
				gap: isExpanded ? '8px' : '',
				textAlign: 'center',
			} );

			Object.assign( toggle.style, {
				marginLeft: isExpanded ? '0' : '8px',
			} );

			updateOverlayHeightMobile();
		} );
	} );

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

		if ( window.innerWidth < 1023 ) {
			navOverlay.style.top = `-${ topBarHeight }px`;
			body.style.paddingTop = `${ totalHeight }px`;
		} else {
			navOverlay.style.removeProperty( 'height' );
			body.style.removeProperty( 'padding-top' );
		}
	};

	updateOverlayHeightMobile();

	topBarCloseButtons.forEach( ( closeButton ) => {
		closeButton.addEventListener( 'click', () => {
			const topBarItem = closeButton.closest( '.top-bar' );
			const topBarKey = topBarItem?.dataset.topBarKey;

			if ( topBarItem ) {
				topBarItem.style.display = 'none';
			}

			if ( topBarKey ) {
				setCookie( `${ topBarCookiePrefix }${ topBarKey }`, '1', 1 );
			}

			if (
				topBar &&
				! topBar.querySelector(
					'.top-bar:not([style*="display: none"])'
				)
			) {
				topBar.style.display = 'none';
			}

			updateOverlayHeightMobile();
		} );
	} );

	window.addEventListener( 'resize', () => {
		updateOverlayHeightMobile();
	} );

	if ( ! isDesktop ) {
		/* =====================================================
		 * MODULE 7: Mega Menu Item Click - Add Active Class
		 * ===================================================== */
		document
			.querySelectorAll( '.nav__item--mega-menu__col' )
			.forEach( ( link ) => {
				link.addEventListener( 'click', ( e ) => {
					e.preventDefault();

					const parentItem = link.closest(
						'.nav__item--mega-menu__item'
					);
					if ( ! parentItem ) {
						return;
					}

					parentItem.parentElement
						.querySelectorAll(
							'.nav__item--mega-menu__item.active'
						)
						.forEach( ( item ) =>
							item.classList.remove( 'active' )
						);

					parentItem.classList.add( 'active' );
				} );
			} );

		/* =====================================================
		 * MODULE 8: Mega Menu Submenu Close - Remove Active Class
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

					parentItem.classList.remove( 'active' );
				} );
			} );
	}

	/* =====================================================
	 * MODULE 8.5: User Icon Modal Toggle
	 * ===================================================== */
	const userModal = document.getElementById( 'modal-popup' );
	const userIconBtns = document.querySelectorAll( '.user-icon-click' );

	if ( userIconBtns.length > 0 && userModal ) {
		const modalOverlay = userModal.querySelector( '.modal-popup__overlay' );
		const modalCloseBtn = userModal.querySelector( '.modal-popup__close' );
		let activeUserIconBtn = null;

		const openModal = () => {
			userModal.classList.add( 'is-active' );
			userModal.setAttribute( 'aria-hidden', 'false' );
			activeUserIconBtn?.setAttribute( 'aria-expanded', 'true' );
			body.classList.add( 'no-overflow' );

			setTimeout( () => {
				modalCloseBtn?.focus();
			}, 100 );
		};

		const closeModal = () => {
			userModal.classList.remove( 'is-active' );
			userModal.setAttribute( 'aria-hidden', 'true' );
			activeUserIconBtn?.setAttribute( 'aria-expanded', 'false' );
			body.classList.remove( 'no-overflow' );
		};

		userIconBtns.forEach( ( btn ) => {
			btn.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				e.stopPropagation();
				activeUserIconBtn = btn;

				if ( userModal.classList.contains( 'is-active' ) ) {
					closeModal();
				} else {
					openModal();
				}
			} );
		} );

		modalOverlay?.addEventListener( 'click', closeModal );
		modalCloseBtn?.addEventListener( 'click', closeModal );

		document.addEventListener( 'keydown', ( e ) => {
			if (
				e.key === 'Escape' &&
				userModal.classList.contains( 'is-active' )
			) {
				closeModal();
				activeUserIconBtn?.focus();
			}
		} );

		userModal.addEventListener( 'keydown', ( e ) => {
			if ( e.key !== 'Tab' ) {
				return;
			}

			const focusableElements = userModal.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);

			if ( ! focusableElements.length ) {
				return;
			}

			const firstFocusable = focusableElements[ 0 ];
			const lastFocusable =
				focusableElements[ focusableElements.length - 1 ];
			const activeElement = userModal.ownerDocument.activeElement;

			if ( e.shiftKey ) {
				if ( activeElement === firstFocusable ) {
					e.preventDefault();
					lastFocusable.focus();
				}
			} else if ( activeElement === lastFocusable ) {
				e.preventDefault();
				firstFocusable.focus();
			}
		} );
	}

	/* =====================================================
	 * MODULE 9: Shrink Header on Scroll (Sticky)
	 * ===================================================== */
	const headersection = document.querySelector( '.header-section' );
	const shrinkClass = 'shrink';
	const scrollThreshold = 50;

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

	if ( headerSearch && searchToggle && headerSearchForm ) {
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
	}
} );
