// Offcanvas Menu
document.addEventListener("DOMContentLoaded", () => {
	const openMenuButton = document.getElementById("openMenu");
	const closeMenuButton = document.getElementById("closeMenu");
	const offCanvasMenu = document.getElementById("offCanvasMenu");
	const overlay = document.getElementById("overlay");

	if (openMenuButton && offCanvasMenu && overlay) {
		openMenuButton.addEventListener("click", () => {
			offCanvasMenu.classList.add("open");
			overlay.classList.add("show");
			document.documentElement.classList.add("popup-overflow-hidden");
		});
	}

	if (closeMenuButton && offCanvasMenu && overlay) {
		closeMenuButton.addEventListener("click", () => {
			offCanvasMenu.classList.remove("open");
			overlay.classList.remove("show");
			document.documentElement.classList.remove("popup-overflow-hidden");
		});
	}

	if (overlay && offCanvasMenu) {
		overlay.addEventListener("click", () => {
			offCanvasMenu.classList.remove("open");
			overlay.classList.remove("show");
			document.documentElement.classList.remove("popup-overflow-hidden");
		});
	}
});

// Tab DropDown
document.addEventListener("DOMContentLoaded", () => {
	const dropdowns = document.querySelectorAll(".tab-dropdown");
	document.addEventListener("click", (event) => {
		let clickedDropdown = null;
		dropdowns.forEach((dropdown) => {
			const toggle = dropdown.querySelector(".dropdown-toggle");
			if (!dropdown.contains(event.target)) {
				toggle.setAttribute("aria-expanded", false);
				dropdown.classList.remove("open");
			} else if (event.target === toggle) {
				clickedDropdown = dropdown;
			}
		});
		if (clickedDropdown) {
			const toggle = clickedDropdown.querySelector(".dropdown-toggle");
			const menu = clickedDropdown.querySelector(".dropdown-menu");
			const isExpanded = toggle.getAttribute("aria-expanded") === "true";
			toggle.setAttribute("aria-expanded", !isExpanded);
			clickedDropdown.classList.toggle("open", !isExpanded);
			if (!isExpanded) {
				menu.querySelectorAll("li").forEach((item, index) => {
					item.style.animationDelay = `${index * 0.1}s`;
				});
			}
		}
	});
});

// Sticky Social Start
document.addEventListener("DOMContentLoaded", () => {
	if (document.body.classList.contains("single-post")) {
		const stickySocial = document.querySelector(".sticky-social");

		// Function to update sticky-social top position
		const updateStickySocial = () => {
			if (stickySocial) {
				stickySocial.style.position = "sticky";
				stickySocial.style.top = "25px"; // Fixed top position
			}
		};

		// Initial update on DOMContentLoaded
		updateStickySocial();

		// Apply style to body tag
		document.body.style.overflowX = "unset";
		document.body.style.setProperty("overflow-x", "unset", "important");
	}
});

document.addEventListener("DOMContentLoaded", function () {
	
	// Copy to Clipboard for social share links start
	document.addEventListener('click', e => {
		const btn = e.target.closest('.copy-link');
		if (!btn) return; // Exit if click not on .copy-link

		// Ensure it's actually an <a> tag with href="javascript:void(0);"
		if (btn.tagName !== 'A' || btn.getAttribute('href') !== 'javascript:void(0);') return;

		const text = btn.dataset.url;
		if (!text) return;

		const showTip = msg => {
			const existingTip = btn.querySelector('.copy-tooltip');
			if (existingTip) existingTip.remove();

			const tip = document.createElement('span');
			tip.className = 'copy-tooltip';
			tip.textContent = msg;
			btn.appendChild(tip);
			setTimeout(() => tip.remove(), 1500);
		};

		const copy = str => {
			if (navigator.clipboard?.writeText) {
				navigator.clipboard.writeText(str)
					.then(() => showTip('Link copied!'))
					.catch(() => showTip('Failed to copy'));
			} else {
				// Fallback for older browsers
				const t = document.createElement('textarea');
				t.value = str;
				document.body.appendChild(t);
				t.select();
				document.execCommand('copy');
				t.remove();
				showTip('Link copied!');
			}
		};
		copy(text);
		// Copy to Clipboard for social share links end
	});	
});
