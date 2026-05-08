document.addEventListener( 'DOMContentLoaded', function () {
	document
		.querySelectorAll( '.secondary-sticky-tabs' )
		.forEach( function ( wrapper ) {
			const tabs = wrapper.querySelectorAll( '.tab-menu-section__tab' );
			const mobileSelect = wrapper.querySelector(
				'.tabs__mobile-nav .tabs__select'
			);
			const managedAttr = 'data-tab-menu-managed';
			const originalHiddenAttr = 'data-tab-menu-original-hidden';

			if ( ! tabs.length ) {
				return;
			}

			const tabBehavior =
				wrapper.getAttribute( 'data-tab-behavior' ) || 'scroll';
			const sectionPairs = [];
			const getTopPosition = function ( element ) {
				return element.getBoundingClientRect().top + window.pageYOffset;
			};
			const getOffset = function () {
				return parseInt(
					wrapper.getAttribute( 'data-offset' ) || '250',
					10
				);
			};
			const scrollToTarget = function ( target ) {
				const targetPosition =
					target.getBoundingClientRect().top +
					window.pageYOffset -
					getOffset();

				window.scrollTo( {
					top: targetPosition,
					behavior: 'smooth',
				} );
			};
			const resolveTargetElement = function ( targetId ) {
				if ( ! targetId ) {
					return null;
				}

				const firstMatch = document.getElementById( targetId );
				if ( ! firstMatch ) {
					return null;
				}

				if ( ! window.CSS || typeof window.CSS.escape !== 'function' ) {
					return firstMatch;
				}

				const escapedTargetId = window.CSS.escape( targetId );
				const duplicateMatches = Array.from(
					document.querySelectorAll( `#${ escapedTargetId }` )
				);

				if ( duplicateMatches.length <= 1 ) {
					return firstMatch;
				}

				const wrapperTop = getTopPosition( wrapper );
				const sortedMatches = duplicateMatches
					.map( function ( element, index ) {
						const elementTop = getTopPosition( element );
						return {
							element,
							index,
							distance: Math.abs( elementTop - wrapperTop ),
							isAfterWrapper: elementTop >= wrapperTop,
						};
					} )
					.sort( function ( left, right ) {
						if ( left.isAfterWrapper !== right.isAfterWrapper ) {
							return left.isAfterWrapper ? -1 : 1;
						}

						if ( left.distance !== right.distance ) {
							return left.distance - right.distance;
						}

						return left.index - right.index;
					} );

				return sortedMatches[ 0 ]?.element || firstMatch;
			};

			tabs.forEach( function ( tab ) {
				const targetId = tab.dataset.scrollTarget;
				const target = resolveTargetElement( targetId );

				if ( target ) {
					sectionPairs.push( { tab, target } );
				}
			} );

			if ( ! sectionPairs.length ) {
				return;
			}

			const setActiveTab = function ( activeTab ) {
				tabs.forEach( function ( tab ) {
					const isActive = tab === activeTab;
					tab.classList.toggle( 'active', isActive );
					tab.setAttribute(
						'aria-selected',
						isActive ? 'true' : 'false'
					);
				} );

				if ( mobileSelect ) {
					mobileSelect.value =
						activeTab.dataset.scrollTarget || '';
				}

				if ( tabBehavior !== 'tab-mode' ) {
					return;
				}

				const isSpacerElement = function ( element ) {
					if ( ! element ) {
						return false;
					}

					if ( element.classList.contains( 'wp-block-spacer' ) ) {
						return true;
					}

					return Array.from( element.classList ).some(
						function ( cssClass ) {
							return cssClass.indexOf( 'is-style-gl-s' ) === 0;
						}
					);
				};

				const getAdjacentSpacers = function ( element ) {
					const spacers = [];
					let sibling = element.previousElementSibling;

					while ( isSpacerElement( sibling ) ) {
						spacers.push( sibling );
						sibling = sibling.previousElementSibling;
					}

					sibling = element.nextElementSibling;
					while ( isSpacerElement( sibling ) ) {
						spacers.push( sibling );
						sibling = sibling.nextElementSibling;
					}

					return spacers;
				};

				const setManagedVisibility = function ( element, shouldShow ) {
					if ( ! element.hasAttribute( originalHiddenAttr ) ) {
						element.setAttribute(
							originalHiddenAttr,
							element.hidden ? 'true' : 'false'
						);
					}

					const wasOriginallyHidden =
						element.getAttribute( originalHiddenAttr ) === 'true';

					if ( shouldShow ) {
						if ( element.getAttribute( managedAttr ) === 'true' ) {
							element.hidden = wasOriginallyHidden;
							element.setAttribute(
								'aria-hidden',
								wasOriginallyHidden ? 'true' : 'false'
							);
							element.removeAttribute( managedAttr );
						}
						return;
					}

					element.hidden = true;
					element.setAttribute( 'aria-hidden', 'true' );
					element.setAttribute( managedAttr, 'true' );
				};

				sectionPairs.forEach( function ( pair ) {
					const isActive = pair.tab === activeTab;
					setManagedVisibility( pair.target, isActive );
					getAdjacentSpacers( pair.target ).forEach(
						function ( spacer ) {
							setManagedVisibility( spacer, isActive );
						}
					);
				} );
			};

			const defaultPair =
				sectionPairs.find( function ( pair ) {
					return pair.tab.classList.contains( 'active' );
				} ) || sectionPairs[ 0 ];

			setActiveTab( defaultPair.tab );

			tabs.forEach( function ( tab ) {
				tab.addEventListener( 'click', function () {
					const clickedPair = sectionPairs.find( function ( pair ) {
						return pair.tab === tab;
					} );

					if ( ! clickedPair ) {
						return;
					}

					setActiveTab( clickedPair.tab );
					scrollToTarget( clickedPair.target );
				} );
			} );

			if ( mobileSelect ) {
				mobileSelect.addEventListener( 'change', function () {
					const selectedTab = Array.from( tabs ).find( function ( tab ) {
						return tab.dataset.scrollTarget === mobileSelect.value;
					} );

					if ( ! selectedTab ) {
						return;
					}

					selectedTab.click();
				} );
			}

			const updateActiveTabFromScroll = function () {
				const offset = getOffset();
				const scrollPoint = window.pageYOffset + offset;
				const firstPair = sectionPairs[ 0 ];
				const wrapperBottom =
					getTopPosition( wrapper ) + wrapper.offsetHeight;
				let currentTab = null;

				if ( firstPair && scrollPoint <= wrapperBottom ) {
					setActiveTab( firstPair.tab );
					return;
				}

				if ( tabBehavior !== 'scroll' ) {
					return;
				}

				sectionPairs.forEach( function ( item ) {
					const targetTop = getTopPosition( item.target );
					const targetBottom = targetTop + item.target.offsetHeight;

					if (
						targetTop <= scrollPoint &&
						targetBottom > scrollPoint
					) {
						currentTab = item.tab;
					}
				} );

				if ( currentTab ) {
					setActiveTab( currentTab );
				}
			};

			window.addEventListener( 'scroll', updateActiveTabFromScroll );
		} );
} );
