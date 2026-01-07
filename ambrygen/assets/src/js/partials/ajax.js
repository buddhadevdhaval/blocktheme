document.addEventListener("DOMContentLoaded", function () {
	const wrapper = document.getElementById("ajax-post-wrapper");
	const paginationWrap = document.getElementById("ajax-pagination");
	const buttons = document.querySelectorAll(".blog-category-filter button");

	if (!wrapper || !buttons.length || typeof localVars === "undefined") return;

	let activeCategory = getUrlParam("cat") || "";
	let currentPage = getCurrentPageFromUrl();
	let isLoading = false;

	// ✅ Set active filter from URL
	buttons.forEach((btn) => {
		if (btn.dataset.term === activeCategory) {
			btn.classList.add("active");
		} else if (!activeCategory && !btn.dataset.term) {
			btn.classList.add("active");
		} else {
			btn.classList.remove("active");
		}
	});

	// ✅ Initial load if URL has filter/page
	if (currentPage > 1 || activeCategory) {
		loadPosts(false);
	}

	function loadPosts(updateUrl = true) {
		if (isLoading) return;
		isLoading = true;

		const formData = new FormData();
		formData.append("action", "ajax_filter");
		formData.append("nonce", localVars.nonce);
		formData.append("category", activeCategory); // ✅ SLUG
		formData.append("page", currentPage);

		wrapper.classList.add("loading");

		fetch(localVars.ajax_url, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					wrapper.innerHTML = data.data.html;

					if (paginationWrap) {
						paginationWrap.innerHTML = data.data.pagination;
					}

					if (updateUrl) {
						updateBrowserUrl();
					}
				}
			})
			.finally(() => {
				wrapper.classList.remove("loading");
				isLoading = false;

				window.scrollTo({
					top: wrapper.offsetTop - 120,
					behavior: "smooth",
				});
			});
	}

	// ✅ CATEGORY FILTER
	buttons.forEach((btn) => {
	btn.addEventListener("click", function () {
    		buttons.forEach((b) => b.classList.remove("active"));
    		this.classList.add("active");

    		// ✅ Force empty string for ALL
    		activeCategory =
    			this.dataset.term && this.dataset.term !== "0"
    				? this.dataset.term
    				: "";

    		currentPage = 1;
    		loadPosts(true);
    	});
    });

	// ✅ AJAX PAGINATION
	document.addEventListener("click", function (e) {
		const link = e.target.closest(".ajax-pagination a[data-page]");
		if (!link) return;

		e.preventDefault();
		currentPage = parseInt(link.dataset.page);
		loadPosts();
	});

	// ✅ BACK / FORWARD BUTTON SUPPORT
	window.addEventListener("popstate", function () {
		activeCategory = getUrlParam("cat") || "";
		currentPage = getCurrentPageFromUrl();
		loadPosts(false);
	});

	// ===============================
	// ✅ URL HELPERS
	// ===============================

	function updateBrowserUrl() {
    	let basePath = window.location.pathname.replace(/\/page\/\d+\//, "/");
    	let newUrl = window.location.origin + basePath;

    	// ✅ Only add pagination if page > 1
    	if (currentPage > 1) {
    		newUrl += "page/" + currentPage + "/";
    	}

    	// ✅ DO NOT add ?cat for: "", 0, null, undefined
    	if (
    		activeCategory !== "" &&
    		activeCategory !== "0" &&
    		activeCategory !== 0 &&
    		activeCategory !== null &&
    		activeCategory !== undefined
    	) {
    		newUrl += "?cat=" + activeCategory;
    	}

    	history.pushState({}, "", newUrl);
    }


	function getCurrentPageFromUrl() {
		const match = window.location.pathname.match(/\/page\/(\d+)\//);
		return match ? parseInt(match[1]) : 1;
	}

	function getUrlParam(name) {
		const params = new URLSearchParams(window.location.search);
		return params.get(name);
	}
});
