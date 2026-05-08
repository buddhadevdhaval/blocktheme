/**
 * Our Team Block - Frontend JavaScript
 * Handles offcanvas panels and team member sliders
 */

import Swiper from 'swiper/bundle';

// Constants
const CONSTANTS = {
    AUTOPLAY_DELAY: 3000,
    SLIDE_SPACING: 20,
    SLIDE_SPACING_DESKTOP: 32,
};


const FOCUSABLE_ELEMENTS = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    'summary',
].join( ', ' );

/**
 * Get focusable elements within a container
 * 
 * @param {HTMLElement} container - Container element
 * @return {Array<HTMLElement>} Array of focusable elements
 */
function getFocusableElements( container ) {
    const elements = container.querySelectorAll( FOCUSABLE_ELEMENTS );
    return Array.from( elements ).filter( ( el ) => {
        return (
            el.offsetWidth > 0 &&
            el.offsetHeight > 0 &&
            ! el.hasAttribute( 'disabled' ) &&
            ! el.hasAttribute( 'aria-hidden' ) &&
            el.getAttribute( 'tabindex' ) !== '-1'
        );
    } );
}

/**
 * Replace element content with proper browser support
 * 
 * @param {HTMLElement} element - Target element
 * @param {Node} newContent - New content to insert
 */
function replaceContent( element, newContent ) {
    if ( element.replaceChildren ) {
        element.replaceChildren( newContent );
    } else {
        while ( element.firstChild ) {
            element.removeChild( element.firstChild );
        }
        if ( newContent ) {
            element.appendChild( newContent );
        }
    }
}

/**
 * Validate image URL
 * 
 * @param {string} url - URL to validate
 * @return {boolean} Whether URL is valid
 */
function isValidImageUrl( url ) {
    if ( ! url ) {
        return false;
    }
    try {
        const urlObj = new URL( url, window.location.origin );
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Initialize offcanvas panels for team member blocks
 * 
 * @param {HTMLElement} block - Team block container
 */
function initOffcanvas( block ) {
    if ( block.dataset.ourTeamOffcanvasInitialized === 'true' ) {
        return;
    }

    const cardSelector = '.our-team__card, .our-leadership__card';
    const cards = block.querySelectorAll( cardSelector );
    const offcanvas = block.querySelector( '.offcanvas-sidebar' );

    if ( ! offcanvas || ! cards.length ) {
        return;
    }

    block.dataset.ourTeamOffcanvasInitialized = 'true';

    const panel = offcanvas.querySelector( '.offcanvas-sidebar__panel' );
    const closeBtn = offcanvas.querySelector( '.offcanvas-sidebar__close' );
    const nameEl = offcanvas.querySelector( '.our-team-offcanvas__name' );
    const roleEl = offcanvas.querySelector( '.our-team-offcanvas__role' );
    const imageEl = offcanvas.querySelector( '.our-team-offcanvas__image' );
    const bioEl = offcanvas.querySelector( '.our-team-offcanvas__bio' );

    if ( ! panel || ! closeBtn || ! nameEl || ! roleEl || ! imageEl || ! bioEl ) {
        return;
    }

    const overlay = offcanvas.querySelector( '.offcanvas-sidebar__overlay' );
    const offcanvasId = offcanvas.id || '';
    let lastFocusedElement = null;
    let escapeHandler = null;
    let focusTimeout = null;
    let activeCard = null;

    /**
     * Open offcanvas panel with team member details
     * 
     * @param {HTMLElement} card - Clicked team card
     */
    function openOffcanvas( card ) {
        lastFocusedElement = card;
        activeCard = card;

        const name = card.getAttribute( 'data-team-name' ) || '';
        const designation = card.getAttribute( 'data-team-designation' ) || '';
        const imageSrc = card.getAttribute( 'data-team-image' ) || '';
        const bioTemplate = card.querySelector( '.our-team__bio-template' );

        nameEl.textContent = name;
        if ( designation && designation.trim() !== '' ) {
            roleEl.textContent = designation;
            roleEl.removeAttribute( 'hidden' );
            roleEl.setAttribute( 'aria-hidden', 'false' );
        } else {
            roleEl.textContent = '';
            roleEl.setAttribute( 'hidden', '' );
            roleEl.setAttribute( 'aria-hidden', 'true' );
        }

        if ( isValidImageUrl( imageSrc ) ) {
            imageEl.src = imageSrc;
            imageEl.alt = name || '';
        } else {
            imageEl.src = '';
            imageEl.alt = '';
        }

        if ( bioTemplate ) {
            replaceContent( bioEl, bioTemplate.content.cloneNode( true ) );
        } else {
            bioEl.textContent = '';
        }

        // Prevent layout shift from scrollbar
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if ( scrollbarWidth > 0 ) {
            document.body.style.paddingRight = `${ scrollbarWidth }px`;
        }

        offcanvas.classList.add( 'is-active' );
        offcanvas.setAttribute( 'aria-hidden', 'false' );
        cards.forEach( ( item ) =>
            item.setAttribute( 'aria-expanded', 'false' )
        );
        card.setAttribute( 'aria-expanded', 'true' );
        document.body.classList.add( 'offcanvas-sidebar-open' );

        // Add escape key handler
        if ( ! escapeHandler ) {
            escapeHandler = ( event ) => {
                if ( event.key === 'Escape' ) {
                    closeOffcanvas();
                }
            };
            document.addEventListener( 'keydown', escapeHandler );
        }

        // Focus close button
        if ( focusTimeout ) {
            cancelAnimationFrame( focusTimeout );
        }
        focusTimeout = requestAnimationFrame( () => {
            closeBtn.focus();
            focusTimeout = null;
        } );
    }

    /**
     * Close offcanvas panel
     */
    function closeOffcanvas() {
        offcanvas.classList.remove( 'is-active' );
        offcanvas.setAttribute( 'aria-hidden', 'true' );
        document.body.classList.remove( 'offcanvas-sidebar-open' );
        document.body.style.paddingRight = '';

        // Remove escape key handler
        if ( escapeHandler ) {
            document.removeEventListener( 'keydown', escapeHandler );
            escapeHandler = null;
        }

        // Clear any pending focus timeout
        if ( focusTimeout ) {
            cancelAnimationFrame( focusTimeout );
            focusTimeout = null;
        }

        // Return focus
        if ( lastFocusedElement ) {
            lastFocusedElement.setAttribute( 'aria-expanded', 'false' );
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }

        activeCard = null;
    }

    /**
     * Handle focus trap within offcanvas panel
     * 
     * @param {KeyboardEvent} event - Keyboard event
     */
    function handleFocusTrap( event ) {
        if ( event.key !== 'Tab' ) {
            return;
        }

        const focusableElements = getFocusableElements( panel );

        if ( ! focusableElements.length ) {
            event.preventDefault();
            return;
        }

        const firstFocusable = focusableElements[ 0 ];
        const lastFocusable = focusableElements[ focusableElements.length - 1 ];

        if ( event.shiftKey ) {
            if ( document.activeElement === firstFocusable ) {
                event.preventDefault();
                lastFocusable.focus();
            }
        } else if ( document.activeElement === lastFocusable ) {
            event.preventDefault();
            firstFocusable.focus();
        }
    }

    function prepareCard( card ) {
        // Ensure ARIA attributes
        if ( ! card.hasAttribute( 'role' ) ) {
            card.setAttribute( 'role', 'button' );
        }
        if ( ! card.hasAttribute( 'tabindex' ) ) {
            card.setAttribute( 'tabindex', '0' );
        }
        if ( ! card.hasAttribute( 'aria-haspopup' ) ) {
            card.setAttribute( 'aria-haspopup', 'dialog' );
        }
        card.setAttribute( 'aria-expanded', 'false' );
        if ( offcanvasId ) {
            card.setAttribute( 'aria-controls', offcanvasId );
        }

        const cardName = card.getAttribute( 'data-team-name' );
        if ( cardName && ! card.hasAttribute( 'aria-label' ) ) {
            card.setAttribute( 'aria-label', `View details for ${ cardName }` );
        }

        if ( card.dataset.ourTeamCardInitialized === 'true' ) {
            return;
        }

        card.dataset.ourTeamCardInitialized = 'true';

        card.addEventListener( 'click', ( event ) => {
            event.preventDefault();
            event.stopPropagation();
            openOffcanvas( card );
        } );

        card.addEventListener( 'keydown', ( event ) => {
            if ( event.key !== 'Enter' && event.key !== ' ' ) {
                return;
            }

            event.preventDefault();
            openOffcanvas( card );
        } );
    }

    // Initialize original cards so Swiper clones inherit the same attributes.
    cards.forEach( prepareCard );

    block.addEventListener( 'click', ( event ) => {
        const card = event.target.closest( cardSelector );

        if (
            ! card ||
            ! block.contains( card ) ||
            card === activeCard ||
            card.dataset.ourTeamCardInitialized === 'true'
        ) {
            return;
        }

        event.preventDefault();
        openOffcanvas( card );
    } );

    block.addEventListener( 'keydown', ( event ) => {
        if ( event.key !== 'Enter' && event.key !== ' ' ) {
            return;
        }

        const card = event.target.closest( cardSelector );

        if ( ! card || ! block.contains( card ) ) {
            return;
        }

        event.preventDefault();
        openOffcanvas( card );
    } );

    // Close button handler
    closeBtn.addEventListener( 'click', closeOffcanvas );

    // Overlay click handler
    overlay?.addEventListener( 'click', closeOffcanvas );

    // Focus trap
    panel.addEventListener( 'keydown', handleFocusTrap );
}

/**
 * Initialize Swiper sliders
 * 
 * @param {NodeList} sliders - Slider elements
 * @return {void}
 */
function initSliders( sliders ) {
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    sliders.forEach( ( sliderElement ) => {
            if ( sliderElement.classList.contains( 'swiper-initialized' ) ) {
                return;
            }

            let config = {};
            const configAttr = sliderElement.getAttribute( 'data-swiper-config' );

            if ( configAttr ) {
                try {
                    config = JSON.parse( configAttr );
                } catch {
                    config = {};
                }
            }

            const slideCount =
                sliderElement.querySelectorAll( '.swiper-slide' ).length;

            if ( ! slideCount ) {
                return;
            }

            const hasMultipleSlides = slideCount > 1;
            const showNavigation = config.navigation_show !== false;
            const nextEl = showNavigation ? 
                sliderElement.querySelector( '.custom-next' ) : null;
            const prevEl = showNavigation ? 
                sliderElement.querySelector( '.custom-prev' ) : null;
            const paginationEl = sliderElement.querySelector( '.swiper-pagination' );
            const buttonsEl = sliderElement.querySelector( '.swiper-buttons' );

            if ( ! hasMultipleSlides ) {
                buttonsEl?.setAttribute( 'hidden', '' );
                paginationEl?.setAttribute( 'hidden', '' );
            }

            const autoplayConfig = config.autoplay && hasMultipleSlides && ! prefersReducedMotion
                ? {
                    delay: CONSTANTS.AUTOPLAY_DELAY,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }
                : false;

            new Swiper( sliderElement, {
                slidesPerView: 1.4,
                spaceBetween: CONSTANTS.SLIDE_SPACING,
                loop: hasMultipleSlides,
                loopAdditionalSlides: hasMultipleSlides ? slideCount : 0,
                watchOverflow: true,
                speed: prefersReducedMotion ? 0 : 300,
                keyboard: {
                    enabled: true,
                    onlyInViewport: true,
                },
                a11y: {
                    prevSlideMessage: 'Previous slide',
                    nextSlideMessage: 'Next slide',
                    firstSlideMessage: 'This is the first slide',
                    lastSlideMessage: 'This is the last slide',
                    paginationBulletMessage: 'Go to slide {{index}}',
                },
                navigation: hasMultipleSlides && showNavigation && nextEl && prevEl
                    ? { nextEl, prevEl }
                    : false,
                pagination: hasMultipleSlides && paginationEl
                    ? {
                        el: paginationEl,
                        clickable: true,
                    }
                    : false,
                autoplay: autoplayConfig,
                breakpoints: {
                    640: { slidesPerView: 1.5 },
                    768: { slidesPerView: 1.5 },
                    1024: { slidesPerView: 3.5 },
                    1200: {
                        slidesPerView: 4.4,
                        spaceBetween: CONSTANTS.SLIDE_SPACING_DESKTOP,
                    },
                },
                on: {
                    init() {
                        sliderElement.classList.add( 'is-initialized' );
                    },
                },
            } );
    } );
}

function initOurTeamBlocks() {
    // Initialize sliders
    const sliders = document.querySelectorAll( '.our-leadership-slider' );
    if ( sliders.length ) {
        initSliders( sliders );
    }

    // Initialize offcanvas panels
    const teamBlocks = document.querySelectorAll( '.our-team, .our-leadership' );
    teamBlocks.forEach( initOffcanvas );
}

if ( document.readyState === 'loading' ) {
    document.addEventListener( 'DOMContentLoaded', initOurTeamBlocks );
} else {
    initOurTeamBlocks();
}
