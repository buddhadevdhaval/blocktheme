(function () {
	const initVideoGridModal = () => {
		const addAutoplay = (src) => {
			if (!src || src.includes('autoplay=1')) {
				return src;
			}

			return `${src}${src.includes('?') ? '&' : '?'}autoplay=1`;
		};

		const createSafeDescriptionFragment = (sourceEl) => {
			const allowedTags = new Set([
				'A',
				'B',
				'BR',
				'EM',
				'I',
				'LI',
				'OL',
				'P',
				'SPAN',
				'STRONG',
				'UL',
			]);

			const sanitizeHref = (href) => {
				if (!href) {
					return null;
				}

				try {
					const url = new URL(href, window.location.origin);
					if (
						['http:', 'https:', 'mailto:', 'tel:'].includes(
							url.protocol
						)
					) {
						return url.href;
					}
				} catch (error) {
					return null;
				}

				return null;
			};

			const sanitizeNode = (node) => {
				if (node.nodeType === Node.TEXT_NODE) {
					return document.createTextNode(node.textContent || '');
				}

				if (node.nodeType !== Node.ELEMENT_NODE) {
					return document.createDocumentFragment();
				}

				if (!allowedTags.has(node.tagName)) {
					const fragment = document.createDocumentFragment();
					Array.from(node.childNodes).forEach((childNode) => {
						fragment.appendChild(sanitizeNode(childNode));
					});
					return fragment;
				}

				const safeElement = document.createElement(
					node.tagName.toLowerCase()
				);

				if (node.tagName === 'A') {
					const safeHref = sanitizeHref(
						node.getAttribute('href')
					);

					if (!safeHref) {
						const fragment = document.createDocumentFragment();
						Array.from(node.childNodes).forEach((childNode) => {
							fragment.appendChild(sanitizeNode(childNode));
						});
						return fragment;
					}

					safeElement.setAttribute('href', safeHref);

					if (node.getAttribute('target') === '_blank') {
						safeElement.setAttribute('target', '_blank');
						safeElement.setAttribute(
							'rel',
							'noopener noreferrer'
						);
					}
				}

				Array.from(node.childNodes).forEach((childNode) => {
					safeElement.appendChild(sanitizeNode(childNode));
				});

				return safeElement;
			};

			const fragment = document.createDocumentFragment();

			Array.from(sourceEl.childNodes).forEach((childNode) => {
				fragment.appendChild(sanitizeNode(childNode));
			});

			return fragment;
		};

		document
			.querySelectorAll('.wp-block-ambrygen-gallery.image-grid-block.video-grid')
			.forEach((blockEl) => {
				if (blockEl.dataset.videoGridBound === '1') {
					return;
				}

				const videoModal = blockEl.querySelector('[data-video-modal]');
				const videoContainer = blockEl.querySelector(
					'[data-video-modal-container]'
				);
				const videoTitleEl = blockEl.querySelector(
					'[data-video-modal-title]'
				);
				const videoDescriptionEl = blockEl.querySelector(
					'[data-video-modal-description]'
				);
				const closeButton =
					videoModal?.querySelector('.modal-popup__close');
				const overlay =
					videoModal?.querySelector('.modal-popup__overlay');
				let activeTrigger = null;

				if (
					!videoModal ||
					!videoContainer ||
					!videoTitleEl ||
					!videoDescriptionEl
				) {
					return;
				}

				blockEl.dataset.videoGridBound = '1';

				const closeVideoModal = () => {
					videoModal.classList.remove('is-active');
					videoModal.setAttribute('aria-hidden', 'true');
					videoContainer.replaceChildren();
					videoTitleEl.textContent = '';
					videoDescriptionEl.replaceChildren();

					if (activeTrigger) {
						activeTrigger.setAttribute('aria-expanded', 'false');
						activeTrigger.focus();
						activeTrigger = null;
					}
				};

				const openVideoModal = (element) => {
					const item = element.closest('.videos__cards-item');
					if (!item || !blockEl.contains(item)) {
						return;
					}

					const mediaContainer = item.querySelector('.media_video');
					const videoSrc = mediaContainer?.dataset?.videoSrc || item.querySelector('.features-media__iframe')?.getAttribute('src');
					const videoType = mediaContainer?.dataset?.videoType || 'embed';

					const titleEl = item.querySelector('.videos__cards-item-title');
					const videoTitle = titleEl ? titleEl.textContent : 'Video';
					const descEl = item.querySelector('.videos__cards-item-description');

					if (!videoSrc) {
						return;
					}

					activeTrigger = element;
					videoTitleEl.textContent = videoTitle;

					if (descEl) {
						videoDescriptionEl.replaceChildren(
							createSafeDescriptionFragment(descEl)
						);
					} else {
						videoDescriptionEl.replaceChildren();
					}

					if (videoType === 'mp4') {
						const previewVideo = item.querySelector('video');
						const videoEl = document.createElement('video');
						videoEl.src = videoSrc;
						videoEl.controls = true;
						videoEl.autoplay = true;
						videoEl.playsInline = true;
						videoEl.className = 'modal-video-player';
						videoEl.style.width = '100%';
						videoEl.style.display = 'block';
						videoEl.setAttribute('aria-label', videoTitle);
						videoEl.setAttribute('preload', 'metadata');
						videoEl.setAttribute('controlsList', 'nodownload'); // Optional: Prevent downloads

						if (previewVideo?.poster) {
							videoEl.poster = previewVideo.poster;
						}

						videoContainer.replaceChildren(videoEl);
					} else {
						const iframeEl = document.createElement('iframe');
						iframeEl.src = addAutoplay(videoSrc);
						iframeEl.title = videoTitle;
						iframeEl.className = 'features-media__iframe';
						iframeEl.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
						iframeEl.allowFullscreen = true;
						videoContainer.replaceChildren(iframeEl);
					}

					element.setAttribute('aria-expanded', 'true');
					videoModal.setAttribute('aria-hidden', 'false');
					videoModal.classList.add('is-active');
					closeButton?.focus();

					const modalVideo = videoContainer.querySelector('video');
					if (modalVideo) {
						modalVideo.play().catch(() => {});
					}
				};

				if (overlay) {
					overlay.addEventListener('click', closeVideoModal);
				}

				if (closeButton) {
					closeButton.addEventListener('click', closeVideoModal);
				}

				const triggers = blockEl.querySelectorAll('.open_video_popup');
				triggers.forEach((trigger) => {
					trigger.style.cursor = 'pointer';
					trigger.setAttribute('role', 'button');
					trigger.setAttribute('tabindex', '0');
					trigger.setAttribute('aria-haspopup', 'dialog');
					trigger.setAttribute('aria-expanded', 'false');

					if (videoModal.id) {
						trigger.setAttribute('aria-controls', videoModal.id);
					}

					const titleEl = trigger
						.closest('.videos__cards-item')
						?.querySelector('.videos__cards-item-title');
					const triggerLabel = titleEl?.textContent?.trim();

					if (triggerLabel && !trigger.hasAttribute('aria-label')) {
						trigger.setAttribute(
							'aria-label',
							`Play video: ${triggerLabel}`
						);
					}

					// Prevent nested media from capturing clicks over the popup trigger area.
					const mediaEl = trigger.querySelectorAll('iframe, video, .play-icon-video');
					mediaEl.forEach((el) => {
						el.style.pointerEvents = 'none';
					});

					trigger.addEventListener('click', function (e) {
						if (e.target.closest('a')) {
							return;
						}
						e.preventDefault();
						openVideoModal(this);
					});

					trigger.addEventListener('keydown', function (e) {
						if (e.key !== 'Enter' && e.key !== ' ') {
							return;
						}

						e.preventDefault();
						openVideoModal(this);
					});
				});

				document.addEventListener('keydown', (event) => {
					if (event.key === 'Escape' && videoModal.classList.contains('is-active')) {
						closeVideoModal();
					}
				});
			});
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initVideoGridModal);
	} else {
		initVideoGridModal();
	}

})();
