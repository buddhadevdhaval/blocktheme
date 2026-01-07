document.addEventListener("DOMContentLoaded", function () {
	const mainSection = document.querySelector(".main-section");
	const herofullSection = document.querySelector(".hero-section");
	const headerSection = document.querySelector(".header-section");
	const navOverlayElement = document.querySelector(".nav-overlay");
	const headerInnerElement = document.querySelector(".header-inner");
	const topBarHeightElement = document.querySelector(".top-bar");
	const topBarCross = document.querySelector(".top-bar-cross");

	const headerWrapper = document.querySelector(".header-section > .header-wrapper");
	const menuUlist = document.querySelector(".header-nav > ul");
	const desktopHide = document.querySelector(".desktop-hide");

	let lastScrollTop = 0;

	const adminBarHeight =
		document.getElementById("wpadminbar")?.offsetHeight || 0;
	let headerInitialSectionHeight =
		adminBarHeight + (headerSection?.offsetHeight || 0);

	// Set padding top based on header height
	function setInitialPadding() {
		if (herofullSection) {
			herofullSection.style.paddingTop =
				headerInitialSectionHeight + "px";
		} else if (mainSection) {
			mainSection.style.paddingTop = headerInitialSectionHeight + "px";
		}
	}

	function setNavOverlayHeight() {
		const headerHeight = headerInnerElement?.offsetHeight || 0;
		const topBarHeight = topBarHeightElement?.offsetHeight || 0;

		if (window.innerWidth <= 1269) {
			navOverlayElement.style.height = `calc(100vh - (${headerHeight + topBarHeight}px))`;
		} else {
			navOverlayElement.style.height = ""; // reset on larger screens
		}
	}

	// Run on load
	setNavOverlayHeight();

	// Run on resize
	window.addEventListener('resize', setNavOverlayHeight);


	// Adjust header on scroll
	function adjustHeader() {
		if (!headerSection) {
			return;
		}

		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const headerHeight = headerSection.offsetHeight;

		if (scrollTop > 0) {
			headerSection.classList.add("shrink");
			document.body.classList.add("shrink");
		} else {
			headerSection.classList.remove("shrink");
			document.body.classList.remove("shrink");
		}

		if (scrollTop >= headerHeight / 2) {
			headerSection.classList.add("site-header-sticky");
			headerSection.style.top = `-${headerHeight}px`;
		} else {
			headerSection.classList.remove(
				"site-header-sticky",
				"site-header-show",
			);
			headerSection.style.top = "";
		}

		if (headerSection.classList.contains("site-header-sticky")) {
			if (scrollTop < lastScrollTop) {
				// Scrolling up
				headerSection.classList.add("site-header-show");
				headerSection.style.top = `${adminBarHeight}px`;
			} else {
				// Scrolling down
				headerSection.classList.remove("site-header-show");
			}
		}

		lastScrollTop = Math.max(0, scrollTop);
		setInitialPadding(); // update height when header resizes
	}

	// Resize event
	function handleResize() {
		headerInitialSectionHeight =
			adminBarHeight + (headerSection?.offsetHeight || 0);
		setInitialPadding();
		setHoverEvent();
	}

	// Hide top bar
	function hideTopBar() {
		const topBar = document.querySelector(".top-bar");
		if (!topBar || !headerSection) {
			return;
		}

		topBar.classList.add("hide-top-bar");

		// Update header height after top bar is hidden
		headerInitialSectionHeight =
			headerSection.offsetHeight - topBar.offsetHeight;

		// Adjust spacing
		if (herofullSection) {
			herofullSection.style.paddingTop =
				headerInitialSectionHeight + "px";
		} else if (mainSection) {
			mainSection.style.paddingTop = headerInitialSectionHeight + "px";
		}

		headerSection.style.top = "0";
		setInitialPadding(); // update height after top bar hides
	}

	function setHoverEvent() {
		let desktopHideValue = "none";
		if (desktopHide) {
			desktopHideValue = window.getComputedStyle(desktopHide).display;
		}
		if (!headerWrapper || !menuUlist || desktopHideValue !== "none") {
			return;
		}
		menuUlist.addEventListener("mouseover", (event) => {
			const menuItem = event.target.closest(".menu-item");
			if (menuItem && menuUlist.contains(menuItem)) {
				const hasMegaDropdown =
					menuItem.querySelector(".mega-dropdown");
				if (hasMegaDropdown) {
					headerWrapper.classList.add("header-active");
				}
			}
		});

		menuUlist.addEventListener("mouseout", (event) => {
			const menuItem = event.target.closest(".menu-item");
			if (menuItem && menuUlist.contains(menuItem)) {
				const related = event.relatedTarget;
				// Remove class only if mouse actually leaves the item + dropdown
				if (!menuItem.contains(related)) {
					const hasMegaDropdown =
						menuItem.querySelector(".mega-dropdown");
					if (hasMegaDropdown) {
						headerWrapper.classList.remove("header-active");
					}
				}
			}
		});
	}

	// Bind top bar close button
	if (topBarCross) {
		topBarCross.addEventListener("click", hideTopBar);
	}

	// Initial setup
	setInitialPadding();
	adjustHeader();
	setHoverEvent();

	// Event listeners
	window.addEventListener("scroll", adjustHeader);
	window.addEventListener("resize", handleResize);

	// Toggle menu button functionality
	const menuBtn = document.querySelector(".menu-btn");
	const navOverlay = document.querySelector(".nav-overlay");
	if (menuBtn && navOverlay) {
		menuBtn.addEventListener("click", () => {
			menuBtn.classList.toggle("active");
			navOverlay.classList.toggle("open");
			document.documentElement.classList.toggle("no-overflow");
			document.body.classList.toggle("no-overflow");

			// Reset active states for menu items and hide sub-menus
			const menuItems = document.querySelectorAll(".header-nav ul li.active")
			menuItems.forEach((item) => {
				item.classList.remove("active");
			});
		});
	}

	function setupToggle(selector, parentClass, onToggle) {
		const buttons = document.querySelectorAll(selector);

		buttons.forEach((button) => {
			button.addEventListener("click", (event) => {
				event.stopPropagation();
				const item = button.closest(parentClass);
				if (!item) {
					return;
				}
				const siblings = Array.from(item.parentNode.children).filter(
					(el) =>
						el !== item &&
						el.classList.contains(parentClass.replace(".", "")),
				);
				siblings.forEach((sibling) => {
					sibling.classList.remove("active");

					// Also close their dropdowns, if any
					const siblingDropdown = sibling.querySelector(".mega-dropdown, .sub-menu");
					if (siblingDropdown) {
						siblingDropdown.removeAttribute('style');
					}
				});
				const isActive = item.classList.toggle("active");
				if (onToggle) {
					onToggle(item, isActive);
				}
				const mDropdown = item.querySelector(".mega-dropdown", ".sub-menu");
				if (mDropdown) {
					if (isActive) {
						mDropdown.style.maxHeight = mDropdown.scrollHeight + "px";
					} else {
						mDropdown.removeAttribute('style');
					}
				}
			});
		});
	}

	// Reset function for list-menu-items
	const resetListMenu = (setFirstActive = false) => {
		const items = document.querySelectorAll(".list-menu-items");

		items.forEach((item) => {
			item.classList.remove("active");
			const mDropdown = item.querySelector(".mega-dropdown");
			if (mDropdown) {
				mDropdown.removeAttribute("style"); // Reset the dropdown height
			}
		});
		if (setFirstActive && buttons.length > 0) {
			items[0]?.classList.add("active");
		}
	};

	// Reset function for all menus
	const resetAllMenus = () => {
		document.querySelectorAll(".menu-item-has-children")
			.forEach((item) => {
				item.classList.remove("active");
				const mDropdown = item.querySelector(".mega-dropdown");
				if (mDropdown) {
					mDropdown.removeAttribute("style");
				}
			});
		resetListMenu();
	};

	// Initialize toggles
	setupToggle(
		".menu-item-has-children > .menu-expand",
		".menu-item-has-children",
		(item, isActive) => {
			if (isActive) {
				resetListMenu();
			}
		},
	);

	// Add listener to .menu-btn to reset all menus
	document.querySelector(".menu-btn")?.addEventListener("click", resetAllMenus);

	// Mouse hover events for mega dropdowns (desktop only)
	const menuItems = document.querySelectorAll(".menu-item.menu-item-has-children");
	if (menuItems) {
		menuItems.forEach((menuItem) => {
			const listAngle = menuItem.querySelector(".list-angle");
			const megaDropdown = menuItem.querySelector(".mega-dropdown");

			if (!listAngle || !megaDropdown) {
				return;
			}

			// Functions to show/hide dropdown
			function showDropdown() {
				listAngle.setAttribute("aria-expanded", "true");
				megaDropdown.style.display = "block";
			}

			function hideDropdown() {
				listAngle.setAttribute("aria-expanded", "false");
				megaDropdown.style.display = "none";
				if (menuItem.classList.contains("active")) {
					menuItem.classList.remove("active");
				}
			}
			if (window.innerWidth >= 1199) {
				// Mouse hover events
				menuItem.addEventListener("mouseenter", showDropdown);
				menuItem.addEventListener("mouseleave", hideDropdown);
				// Scroll event to hide dropdown
				window.addEventListener("scroll", () => {
					hideDropdown();
				});
			}
		});
	}

	// Function to set a cookie
	function setCookie(name, value, days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Set expiration to dynamic days
		document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
	}

	// Function to get a cookie
	function getCookie(name) {
		const nameEQ = `${name}=`;
		const cookies = document.cookie.split(";");
		for (let cookie of cookies) {
			cookie = cookie.trim();
			if (cookie.indexOf(nameEQ) === 0) {
				return cookie.substring(nameEQ.length);
			}
		}
		return null;
	}

	// Hide hello bar if cookie exists
	const helloBar = document.querySelector(".top-bar");
	if (helloBar) {
		const cookieDays = parseInt(
			helloBar.getAttribute("data-cookie-days"),
			10,
		); // Convert data-cookie-days to integer

		if (getCookie("helloBarClosed")) {
			helloBar.style.display = "none"; // Hide the hello bar if cookie exists
		} else {
			helloBar.style.display = "flex"; // Show the hello bar if cookie does not exist
		}
		// Add event listener to the close button
		const closeButton = helloBar.querySelector(".top-bar-cross");
		if (closeButton) {
			closeButton.addEventListener("click", (e) => {
				e.preventDefault();
				helloBar.style.display = "none"; // Hide the hello bar
				setCookie("helloBarClosed", "true", cookieDays); // Use dynamic value from the data attribute
			});
		}
	}

	// Accessibility: Add aria-label to links that open in a new tab
	document.querySelectorAll('a[target="_blank"]').forEach((link) => {
		// Check if the link already has an aria-label
		if (!link.hasAttribute("aria-label")) {
			// Add aria-label if it's not already present
			link.setAttribute("aria-label", "Opens in a new tab");
		}
	});

	// Focus and blur events for menu items with sub-menus
	document.querySelectorAll(".menu-item-has-children > a").forEach((anchor) => {
		anchor.addEventListener("focus", () => {
			const subMenu = anchor.nextElementSibling;
			if (subMenu && subMenu.classList.contains("sub-menu")) {
				subMenu.classList.add("focused");
			}
		});
		anchor.addEventListener("blur", () => {
			const subMenu = anchor.nextElementSibling;
			if (subMenu && subMenu.classList.contains("sub-menu")) {
				subMenu.classList.remove("focused");
			}
		});
	});


});
