(function () {
	const INITIAL_VISIBLE_TEST_COUNT = 12;

	function decodeHtml(value) {
		const txt = document.createElement('textarea');
		txt.innerHTML = value || '';
		return txt.value;
	}

	function escapeHtml(value) {
		return (value || '').replace(/[&<>"']/g, (char) => {
			const map = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#039;',
			};
			return map[char];
		});
	}

	function isSafeUrl(url) {
		return /^https?:\/\//i.test(url.trim());
	}

	function buildCard(post, index) {
		const title = decodeHtml(post?.title?.rendered || '');
		const url = post?.link || '#';
		const safeUrl = isSafeUrl(url) ? url : '#';
		const terms = post?._embedded?.['wp:term']?.flat?.() || [];
		const category = decodeHtml(terms?.[0]?.name || 'Category');
		const isExtra = index >= INITIAL_VISIBLE_TEST_COUNT;

		return `
			<div class="features-tabs__card${isExtra
				? ' features-tabs__card--is-extra is-view-all-hidden'
				: ''
			}" data-view-all-card="${isExtra ? '1' : '0'}" aria-hidden="${isExtra ? 'true' : 'false'
			}"${isExtra ? ' style="display:none;"' : ''}>
				<div class="features-tabs__content-head">
					<div class="features-tabs__category body2-semibold">${escapeHtml(
				category
			)}</div>
					<div class="features-tabs__card-title">
						${escapeHtml(title)}
						<div class="badge badge--blue"><i class="badge__dot"></i>Tests</div>
					</div>
				</div>
				<a class="features-tabs__view-link site-btn is-style-site-text-btn has-right-arrow" href="${escapeHtml(
				safeUrl
			)}" aria-label="View product for ${escapeHtml(
				title
			)}">View Product</a>
			</div>
		`;
	}

	function buildViewAllButton() {
		return `
			<div class="features-tabs__footer">
				<button type="button" class="site-btn is-style-site-trailing-icon has-right-arrow features-tabs__view-all" aria-expanded="false">
					View All Tests
				</button>
			</div>
		`;
	}

	function getApiBase() {
		if (window?.wpApiSettings?.root) {
			return window.wpApiSettings.root.replace(/\/$/, '');
		}
		return `${window.location.origin}/wp-json`;
	}

	async function fetchAllPosts(baseUrl) {
		const firstUrl = `${baseUrl}&page=1`;
		const firstResponse = await fetch(firstUrl);
		if (!firstResponse.ok) {
			throw new Error(`HTTP ${firstResponse.status}`);
		}
		const firstPosts = await firstResponse.json();
		const totalPages = Number(
			firstResponse.headers.get('X-WP-TotalPages') || 1
		);

		if (totalPages <= 1) {
			return firstPosts;
		}

		const restResponses = await Promise.all(
			Array.from({ length: totalPages - 1 }, (_, index) =>
				fetch(`${baseUrl}&page=${index + 2}`)
			)
		);
		const restPosts = await Promise.all(
			restResponses.map((response) => {
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}
				return response.json();
			})
		);

		return [firstPosts, ...restPosts].flat();
	}

	function initViewAll(panel) {
		if (!panel) {
			return;
		}

		const button = panel.querySelector('.features-tabs__view-all');
		if (!button || button.dataset.viewAllBound === '1') {
			return;
		}

		const footer = button.closest('.features-tabs__footer');
		if (
			!panel.querySelector(
				'[data-view-all-card="1"].is-view-all-hidden'
			)
		) {
			if (footer) {
				footer.classList.add('is-view-all-hidden');
				footer.style.display = 'none';
			} else {
				button.classList.add('is-view-all-hidden');
				button.style.display = 'none';
			}
			return;
		}

		button.dataset.viewAllBound = '1';
		button.addEventListener('click', () => {
			panel
				.querySelectorAll('[data-view-all-card="1"]')
				.forEach((card) => {
					card.classList.remove('features-tabs__card--is-extra');
					card.classList.remove('is-view-all-hidden');
					card.classList.remove('js-gsap-fade');
					card.setAttribute('aria-hidden', 'false');
					card.style.display = '';
					card.style.opacity = '';
					card.style.transform = '';
				});

			button.setAttribute('aria-expanded', 'true');
			if (footer) {
				footer.classList.add('is-view-all-hidden');
				footer.style.display = 'none';
			} else {
				button.classList.add('is-view-all-hidden');
				button.style.display = 'none';
			}

			window.requestAnimationFrame(() => {
				window.dispatchEvent(new Event('resize'));

				if (window.ScrollTrigger?.refresh) {
					window.ScrollTrigger.refresh();
				}
			});
		});
	}

	async function loadPanelPosts(panel, termSlug) {
		if (
			!panel ||
			panel.dataset.loaded === '1' ||
			panel.dataset.loaded === 'loading'
		) {
			return;
		}

		panel.dataset.loaded = 'loading';
		panel.innerHTML =
			'<div class="features-tabs__grid"><p>Loading...</p></div>';

		try {
			const apiBase = getApiBase();
			let termId = null;

			if (termSlug && termSlug !== 'all') {
				const termRes = await fetch(
					`${apiBase}/wp/v2/poster_category?slug=${encodeURIComponent(
						termSlug
					)}`
				);
				if (!termRes.ok) {
					throw new Error(`HTTP ${termRes.status}`);
				}
				const termData = await termRes.json();
				termId =
					Array.isArray(termData) && termData[0]?.id
						? Number(termData[0].id)
						: null;
			}

			let postsUrl = `${apiBase}/wp/v2/genetic-testing?per_page=100&_embed=wp:term&orderby=date&order=asc`;
			if (termId) {
				postsUrl += `&poster_category=${termId}`;
			}
			if (termSlug && termSlug !== 'all' && !termId) {
				postsUrl = `${apiBase}/wp/v2/genetic-testing?per_page=1&include=0`;
			}

			const posts = await fetchAllPosts(postsUrl);

			if (!Array.isArray(posts) || posts.length === 0) {
				panel.innerHTML =
					'<div class="features-tabs__grid--no-post"><p>No Tests found for this tab.</p></div>';
				panel.dataset.loaded = '1';
				return;
			}

			panel.innerHTML = `<div class="features-tabs__grid">${posts
				.map(buildCard)
				.join('')}</div>${posts.length > INITIAL_VISIBLE_TEST_COUNT
					? buildViewAllButton()
					: ''
				}`;
			initViewAll(panel);
			panel.dataset.loaded = '1';
		} catch (error) {
			panel.innerHTML =
				'<div class="features-tabs__grid"><p>Unable to load Tests.</p></div>';
			panel.dataset.loaded = '0';
		}
	}

	function initTabs(container) {
		if (!container) {
			return;
		}
		const tabs = Array.from(
			container.querySelectorAll('.icon_ajax_tab[data-tab-target]')
		);
		const panels = Array.from(
			container.querySelectorAll('.tabs__panel')
		);

		if (!tabs.length || !panels.length) {
			return;
		}

		panels.forEach((panel) => {
			if (
				panel.querySelector('.features-tabs__grid') ||
				panel.querySelector('.features-tabs__grid--no-post')
			) {
				panel.dataset.loaded = '1';
			}
			initViewAll(panel);
		});

		const activateTab = (target) => {
			tabs.forEach((tab) => {
				const isActive = tab.dataset.tabTarget === target;
				tab.classList.toggle('is-active', isActive);
				tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
			});

			panels.forEach((panel) => {
				panel.classList.toggle('is-active', panel.id === target);
			});

			const activePanel = panels.find((panel) => panel.id === target);
			loadPanelPosts(activePanel, activePanel?.dataset.termSlug || target);
		};

		let activeTarget = tabs.find((tab) =>
			tab.classList.contains('is-active')
		)?.dataset.tabTarget;
		if (!activeTarget && tabs[0]) {
			activeTarget = tabs[0].dataset.tabTarget;
		}
		if (activeTarget) {
			activateTab(activeTarget);
		}

		tabs.forEach((tab) => {
			tab.addEventListener('click', (event) => {
				event.preventDefault();
				activateTab(tab.dataset.tabTarget || '');
			});
		});
	}

	window.addEventListener('load', () => {
		document
			.querySelectorAll(
				'.wp-block-ambrygen-genetic-testing-grid .tabs-content'
			)
			.forEach(initTabs);
	});
})();
