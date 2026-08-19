( function () {
	const initButtonPopups = () => {
		const modalId = 'ambry-global-video-modal';
		let activeTrigger = null;

		const sanitizeRichText = ( html ) => {
			if ( ! html ) {
				return document.createDocumentFragment();
			}

			const parser = new window.DOMParser();
			const doc = parser.parseFromString(
				`<div>${ html }</div>`,
				'text/html'
			);
			const root = doc.body.firstElementChild;
			const allowedTags = new Set( [
				'A',
				'B',
				'BR',
				'DIV',
				'EM',
				'I',
				'LI',
				'OL',
				'P',
				'SMALL',
				'SPAN',
				'STRONG',
				'SUP',
				'UL',
			] );
			const allowedAttrs = new Set( [
				'href',
				'target',
				'rel',
				'class',
			] );

			const walk = ( node ) => {
				if ( node.nodeType !== Node.ELEMENT_NODE ) {
					[ ...node.childNodes ].forEach( walk );
					return;
				}

				const el = node;

				if ( ! allowedTags.has( el.tagName ) ) {
					const parent = el.parentNode;
					if ( parent ) {
						while ( el.firstChild ) {
							parent.insertBefore( el.firstChild, el );
						}
						parent.removeChild( el );
					}
					return;
				}

				[ ...el.attributes ].forEach( ( attr ) => {
					const name = attr.name.toLowerCase();
					if ( ! allowedAttrs.has( name ) ) {
						el.removeAttribute( attr.name );
					}
				} );

				if ( el.tagName === 'A' ) {
					const href = el.getAttribute( 'href' ) || '';
					const isSafe = /^(https?:|mailto:|tel:|#|\/)/i.test( href );
					if ( ! isSafe ) {
						el.removeAttribute( 'href' );
					}
				}

				[ ...el.childNodes ].forEach( walk );
			};

			if ( root ) {
				[ ...root.childNodes ].forEach( walk );
			}

			const fragment = document.createDocumentFragment();
			while ( root?.firstChild ) {
				fragment.appendChild( root.firstChild );
			}

			return fragment;
		};

		const setSanitizedContent = ( element, html, fallback = '' ) => {
			if ( ! element ) {
				return;
			}

			if ( html ) {
				element.replaceChildren( sanitizeRichText( html ) );
				return;
			}

			element.textContent = fallback;
		};

		const createModal = () => {
			const modal = document.createElement( 'div' );
			modal.className = 'modal-popup modal-popup--video user-modal';
			modal.id = modalId;
			modal.setAttribute( 'data-video-modal', '' );
			modal.style.display = 'none';
			modal.setAttribute( 'aria-hidden', 'true' );
			modal.setAttribute( 'role', 'dialog' );
			modal.setAttribute( 'aria-modal', 'true' );
			modal.setAttribute( 'aria-labelledby', 'ambry-modal-title' );

			const overlay = document.createElement( 'div' );
			overlay.className = 'modal-popup__overlay';

			const panel = document.createElement( 'div' );
			panel.className = 'modal-popup__panel user-modal__panel';

			const header = document.createElement( 'div' );
			header.className = 'modal-popup__header';

			const closeBtn = document.createElement( 'button' );
			closeBtn.type = 'button';
			closeBtn.className = 'modal-popup__close';
			closeBtn.setAttribute( 'aria-label', 'Close modal' );

			const closeImg = document.createElement( 'img' );
			closeImg.setAttribute( 'decoding', 'async' );
			closeImg.src =
				'/wp-content/themes/ambrygen/assets/src/images/close-icon.svg';
			closeImg.alt = 'Close';
			closeBtn.appendChild( closeImg );

			const content = document.createElement( 'div' );
			content.className = 'modal-content';

			const videoWrap = document.createElement( 'div' );
			videoWrap.className = 'modal-content__video-wrapper is-empty';
			videoWrap.setAttribute( 'data-video-modal-container', '' );

			const spacer24 = document.createElement( 'div' );
			spacer24.className = 'is-style-gl-s24';

			const title = document.createElement( 'div' );
			title.className = 'modal-popup__title heading-5 mb-0';
			title.id = 'ambry-modal-title';
			title.setAttribute( 'data-video-modal-title', '' );

			const spacer16 = document.createElement( 'div' );
			spacer16.className = 'is-style-gl-s16';

			const description = document.createElement( 'div' );
			description.className = 'modal-content__description';
			description.setAttribute( 'data-video-modal-description', '' );

			header.appendChild( closeBtn );
			panel.appendChild( header );
			content.append( videoWrap, spacer24, title, spacer16, description );
			panel.appendChild( content );
			modal.append( overlay, panel );

			return modal;
		};

		const prepareTrigger = ( trigger ) => {
			trigger.setAttribute( 'aria-haspopup', 'dialog' );
			trigger.setAttribute( 'aria-expanded', 'false' );
			trigger.setAttribute( 'aria-controls', modalId );
		};

		const setActiveTrigger = ( trigger ) => {
			if ( activeTrigger && activeTrigger !== trigger ) {
				activeTrigger.setAttribute( 'aria-expanded', 'false' );
			}

			activeTrigger = trigger;
			activeTrigger.setAttribute( 'aria-expanded', 'true' );
		};

		const clearActiveTrigger = () => {
			if ( ! activeTrigger ) {
				return;
			}

			activeTrigger.setAttribute( 'aria-expanded', 'false' );
			activeTrigger.focus();
			activeTrigger = null;
		};

		// Video Popup Logic
		const initVideoButtons = () => {
			const videoButtons =
				document.querySelectorAll( '.has-video-arrow' );
			videoButtons.forEach( ( btnWrapper ) => {
				if ( btnWrapper.dataset.videoBound === '1' ) {
					return;
				}
				btnWrapper.dataset.videoBound = '1';

				const link = btnWrapper.querySelector( 'a' ) || btnWrapper;
				prepareTrigger( link );
				link.addEventListener( 'click', ( e ) => {
					const videoSrc = btnWrapper.dataset.videoSrc;
					if ( ! videoSrc ) {
						return;
					}

					e.preventDefault();
					e.stopPropagation();

					const videoType = btnWrapper.dataset.videoType || 'embed';
					const videoTitle = btnWrapper.dataset.videoTitle || '';
					const videoContent = btnWrapper.dataset.videoContent || '';

					openVideoModal( {
						src: videoSrc,
						type: videoType,
						title: videoTitle,
						content: videoContent,
						trigger: link,
					} );
				} );
			} );
		};

		// Form Popup Logic
		const initFormButtons = () => {
			const formButtons = document.querySelectorAll( '.has-form-arrow' );
			formButtons.forEach( ( btnWrapper ) => {
				if ( btnWrapper.dataset.formBound === '1' ) {
					return;
				}
				btnWrapper.dataset.formBound = '1';

				const link = btnWrapper.querySelector( 'a' ) || btnWrapper;
				prepareTrigger( link );
				link.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					e.stopPropagation();

					openFormModal( {
						title: btnWrapper.dataset.formTitle || 'Coming soon',
						content: btnWrapper.dataset.formContent || '',
						trigger: link,
					} );
				} );
			} );
		};

		function getModal() {
			let modal = document.getElementById( modalId );
			if ( ! modal ) {
				modal = createModal();
				document.body.appendChild( modal );

				const closeBtn = modal.querySelector( '.modal-popup__close' );
				const overlay = modal.querySelector( '.modal-popup__overlay' );

				const closeModal = () => {
					modal.classList.remove( 'is-active' );
					modal.setAttribute( 'aria-hidden', 'true' );
					setTimeout( () => {
						modal.style.display = 'none';
						const container = modal.querySelector(
							'[data-video-modal-container]'
						);
						if ( container ) {
							container.innerHTML = '';
							container.classList.add( 'is-empty' );
						}
					}, 300 );
					clearActiveTrigger();
				};

				closeBtn.addEventListener( 'click', closeModal );
				overlay.addEventListener( 'click', closeModal );
				document.addEventListener( 'keydown', ( e ) => {
					if (
						e.key === 'Escape' &&
						modal.classList.contains( 'is-active' )
					) {
						closeModal();
					}
				} );
			}
			return modal;
		}

		function openVideoModal( data ) {
			const modal = getModal();
			const container = modal.querySelector(
				'[data-video-modal-container]'
			);
			const titleEl = modal.querySelector( '[data-video-modal-title]' );
			const descEl = modal.querySelector(
				'[data-video-modal-description]'
			);

			if ( titleEl ) {
				titleEl.textContent = data.title;
			}
			setSanitizedContent( descEl, data.content );

			if ( container ) {
				container.innerHTML = '';
				container.classList.remove( 'is-empty' );
				if ( data.type === 'mp4' ) {
					const video = document.createElement( 'video' );
					video.src = data.src;
					video.controls = true;
					video.autoplay = true;
					video.className = 'videos';
					video.style.width = '100%';
					container.appendChild( video );
				} else {
					const iframe = document.createElement( 'iframe' );
					const joiner = data.src.includes( '?' ) ? '&' : '?';
					iframe.src = `${ data.src }${ joiner }autoplay=1`;
					iframe.className = 'features-media__iframe';
					iframe.allow =
						'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
					iframe.allowFullscreen = true;
					container.appendChild( iframe );
				}
			}

			modal.style.display = 'flex';
			modal.setAttribute( 'aria-hidden', 'false' );
			setActiveTrigger( data.trigger );
			setTimeout( () => {
				modal.classList.add( 'is-active' );
			}, 10 );
		}

		function openFormModal( data ) {
			const modal = getModal();
			const container = modal.querySelector(
				'[data-video-modal-container]'
			);
			const titleEl = modal.querySelector( '[data-video-modal-title]' );
			const descEl = modal.querySelector(
				'[data-video-modal-description]'
			);

			if ( titleEl ) {
				titleEl.textContent = data.title;
			}
			setSanitizedContent( descEl, data.content, 'Coming soon' );

			if ( container ) {
				container.innerHTML = '';
				container.classList.add( 'is-empty' );
			}

			modal.style.display = 'flex';
			modal.setAttribute( 'aria-hidden', 'false' );
			setActiveTrigger( data.trigger );
			setTimeout( () => {
				modal.classList.add( 'is-active' );
			}, 10 );
		}

		initVideoButtons();
		initFormButtons();

		// Handle dynamically added buttons (e.g. via AJAX)
		const observer = new MutationObserver( () => {
			initVideoButtons();
			initFormButtons();
		} );

		observer.observe( document.body, {
			childList: true,
			subtree: true,
		} );
	};

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initButtonPopups );
	} else {
		initButtonPopups();
	}
} )();
