(function () {
	const initButtonPopups = () => {
		const modalId = 'ambry-global-video-modal';
		let activeTrigger = null;

		const prepareTrigger = (trigger) => {
			trigger.setAttribute('aria-haspopup', 'dialog');
			trigger.setAttribute('aria-expanded', 'false');
			trigger.setAttribute('aria-controls', modalId);
		};

		const setActiveTrigger = (trigger) => {
			if (activeTrigger && activeTrigger !== trigger) {
				activeTrigger.setAttribute('aria-expanded', 'false');
			}

			activeTrigger = trigger;
			activeTrigger.setAttribute('aria-expanded', 'true');
		};

		const clearActiveTrigger = () => {
			if (!activeTrigger) {
				return;
			}

			activeTrigger.setAttribute('aria-expanded', 'false');
			activeTrigger.focus();
			activeTrigger = null;
		};

		// Video Popup Logic
		const initVideoButtons = () => {
			const videoButtons = document.querySelectorAll('.has-video-arrow');
			videoButtons.forEach((btnWrapper) => {
				if (btnWrapper.dataset.videoBound === '1') {
					return;
				}
				btnWrapper.dataset.videoBound = '1';

				const link = btnWrapper.querySelector('a') || btnWrapper;
				prepareTrigger(link);
				link.addEventListener('click', (e) => {
					const videoSrc = btnWrapper.dataset.videoSrc;
					if (!videoSrc) {
						return;
					}

					e.preventDefault();
					e.stopPropagation();

					const videoType = btnWrapper.dataset.videoType || 'embed';
					const videoTitle = btnWrapper.dataset.videoTitle || '';
					const videoContent = btnWrapper.dataset.videoContent || '';

					openVideoModal({
						src: videoSrc,
						type: videoType,
						title: videoTitle,
						content: videoContent,
						trigger: link,
					});
				});
			});
		};

		// Form Popup Logic
		const initFormButtons = () => {
			const formButtons = document.querySelectorAll('.has-form-arrow');
			formButtons.forEach((btnWrapper) => {
				if (btnWrapper.dataset.formBound === '1') {
					return;
				}
				btnWrapper.dataset.formBound = '1';

				const link = btnWrapper.querySelector('a') || btnWrapper;
				prepareTrigger(link);
				link.addEventListener('click', (e) => {
					e.preventDefault();
					e.stopPropagation();

					openFormModal({
						title: btnWrapper.dataset.formTitle || 'Coming soon',
						content: btnWrapper.dataset.formContent || '',
						trigger: link,
					});
				});
			});
		};

		function getModal() {
			let modal = document.getElementById(modalId);
			if (!modal) {
				const modalHtml = `
					<style>
						#ambry-global-video-modal .modal-content__video-wrapper.is-empty,
						#ambry-global-video-modal .modal-content__video-wrapper.is-empty + .is-style-gl-s24 {
							display: none;
						}
					</style>
					<div class="modal-popup modal-popup--video user-modal" id="ambry-global-video-modal" data-video-modal style="display:none;" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="ambry-modal-title">
						<div class="modal-popup__overlay"></div>
						<div class="modal-popup__panel user-modal__panel">
							<div class="modal-popup__header">
								<button type="button" class="modal-popup__close" aria-label="Close modal">
									<img decoding="async" src="/wp-content/themes/ambrygen/assets/src/images/close-icon.svg" alt="Close" />
								</button>
							</div>
							<div class="modal-content">
								<div class="modal-content__video-wrapper is-empty" data-video-modal-container></div>
								<div class="is-style-gl-s24"></div>
								<div class="modal-popup__title heading-5 mb-0" id="ambry-modal-title" data-video-modal-title></div>
								<div class="is-style-gl-s16"></div>
								<div class="modal-content__description" data-video-modal-description></div>
							</div>
						</div>
					</div>
				`;
				document.body.insertAdjacentHTML('beforeend', modalHtml);
				modal = document.getElementById(modalId);

				const closeBtn = modal.querySelector('.modal-popup__close');
				const overlay = modal.querySelector('.modal-popup__overlay');

				const closeModal = () => {
					modal.classList.remove('is-active');
					modal.setAttribute('aria-hidden', 'true');
					setTimeout(() => {
						modal.style.display = 'none';
						const container = modal.querySelector('[data-video-modal-container]');
						if (container) {
							container.innerHTML = '';
							container.classList.add('is-empty');
						}
					}, 300);
					clearActiveTrigger();
				};

				closeBtn.addEventListener('click', closeModal);
				overlay.addEventListener('click', closeModal);
				document.addEventListener('keydown', (e) => {
					if (e.key === 'Escape' && modal.classList.contains('is-active')) {
						closeModal();
					}
				});
			}
			return modal;
		}

		function openVideoModal(data) {
			const modal = getModal();
			const container = modal.querySelector('[data-video-modal-container]');
			const titleEl = modal.querySelector('[data-video-modal-title]');
			const descEl = modal.querySelector('[data-video-modal-description]');

			if (titleEl) {
				titleEl.textContent = data.title;
			}
			if (descEl) {
				descEl.innerHTML = data.content;
			}

			if (container) {
				container.innerHTML = '';
				container.classList.remove('is-empty');
				if (data.type === 'mp4') {
					const video = document.createElement('video');
					video.src = data.src;
					video.controls = true;
					video.autoplay = true;
					video.className = 'videos';
					video.style.width = '100%';
					container.appendChild(video);
				} else {
					const iframe = document.createElement('iframe');
					const joiner = data.src.includes('?') ? '&' : '?';
					iframe.src = `${data.src}${joiner}autoplay=1`;
					iframe.className = 'features-media__iframe';
					iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
					iframe.allowFullscreen = true;
					container.appendChild(iframe);
				}
			}

			modal.style.display = 'flex';
			modal.setAttribute('aria-hidden', 'false');
			setActiveTrigger(data.trigger);
			setTimeout(() => {
				modal.classList.add('is-active');
			}, 10);
		}

		function openFormModal(data) {
			const modal = getModal();
			const container = modal.querySelector('[data-video-modal-container]');
			const titleEl = modal.querySelector('[data-video-modal-title]');
			const descEl = modal.querySelector('[data-video-modal-description]');

			if (titleEl) {
				titleEl.textContent = data.title;
			}
			if (descEl) {
				descEl.innerHTML = data.content || 'Coming soon';
			}

			if (container) {
				container.innerHTML = '';
				container.classList.add('is-empty');
			}

			modal.style.display = 'flex';
			modal.setAttribute('aria-hidden', 'false');
			setActiveTrigger(data.trigger);
			setTimeout(() => {
				modal.classList.add('is-active');
			}, 10);
		}

		initVideoButtons();
		initFormButtons();

		// Handle dynamically added buttons (e.g. via AJAX)
		const observer = new MutationObserver(() => {
			initVideoButtons();
			initFormButtons();
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initButtonPopups);
	} else {
		initButtonPopups();
	}
})();
