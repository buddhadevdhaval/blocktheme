/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js?ver=" + "326ec875561c4adcb1af" + "";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "ambrygen:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (globalThis.importScripts) scriptUrl = globalThis.location + "";
/******/ 		var document = globalThis.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"our-team/view": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkambrygen"] = globalThis["webpackChunkambrygen"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!********************************************!*\
  !*** ./assets/src/blocks/our-team/view.js ***!
  \********************************************/
/**
 * Our Team Block - Frontend JavaScript
 * Handles offcanvas panels and team member sliders
 */

// Constants
const CONSTANTS = {
  AUTOPLAY_DELAY: 3000,
  SLIDE_SPACING: 20,
  SLIDE_SPACING_DESKTOP: 32
};
const FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])', 'audio[controls]', 'video[controls]', 'summary'].join(', ');

/**
 * Get focusable elements within a container
 * 
 * @param {HTMLElement} container - Container element
 * @return {Array<HTMLElement>} Array of focusable elements
 */
function getFocusableElements(container) {
  const elements = container.querySelectorAll(FOCUSABLE_ELEMENTS);
  return Array.from(elements).filter(el => {
    return el.offsetWidth > 0 && el.offsetHeight > 0 && !el.hasAttribute('disabled') && !el.hasAttribute('aria-hidden') && el.getAttribute('tabindex') !== '-1';
  });
}

/**
 * Replace element content with proper browser support
 * 
 * @param {HTMLElement} element - Target element
 * @param {Node} newContent - New content to insert
 */
function replaceContent(element, newContent) {
  if (element.replaceChildren) {
    element.replaceChildren(newContent);
  } else {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    if (newContent) {
      element.appendChild(newContent);
    }
  }
}

/**
 * Validate image URL
 * 
 * @param {string} url - URL to validate
 * @return {boolean} Whether URL is valid
 */
function isValidImageUrl(url) {
  if (!url) {
    return false;
  }
  try {
    const urlObj = new URL(url, window.location.origin);
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
function initOffcanvas(block) {
  const cards = block.querySelectorAll('.our-team__card, .our-leadership__card');
  const offcanvas = block.querySelector('.offcanvas-sidebar');
  if (!offcanvas || !cards.length) {
    return;
  }
  const panel = offcanvas.querySelector('.offcanvas-sidebar__panel');
  const closeBtn = offcanvas.querySelector('.offcanvas-sidebar__close');
  const nameEl = offcanvas.querySelector('.our-team-offcanvas__name');
  const roleEl = offcanvas.querySelector('.our-team-offcanvas__role');
  const imageEl = offcanvas.querySelector('.our-team-offcanvas__image');
  const bioEl = offcanvas.querySelector('.our-team-offcanvas__bio');
  if (!panel || !closeBtn || !nameEl || !roleEl || !imageEl || !bioEl) {
    return;
  }
  const overlay = offcanvas.querySelector('.offcanvas-sidebar__overlay');
  const offcanvasId = offcanvas.id || '';
  let lastFocusedElement = null;
  let escapeHandler = null;
  let focusTimeout = null;

  /**
   * Open offcanvas panel with team member details
   * 
   * @param {HTMLElement} card - Clicked team card
   */
  function openOffcanvas(card) {
    lastFocusedElement = card;
    const name = card.getAttribute('data-team-name') || '';
    const designation = card.getAttribute('data-team-designation') || '';
    const imageSrc = card.getAttribute('data-team-image') || '';
    const bioTemplate = card.querySelector('.our-team__bio-template');
    nameEl.textContent = name;
    if (designation && designation.trim() !== '') {
      roleEl.textContent = designation;
      roleEl.removeAttribute('hidden');
      roleEl.setAttribute('aria-hidden', 'false');
    } else {
      roleEl.textContent = '';
      roleEl.setAttribute('hidden', '');
      roleEl.setAttribute('aria-hidden', 'true');
    }
    if (isValidImageUrl(imageSrc)) {
      imageEl.src = imageSrc;
      imageEl.alt = name || '';
    } else {
      imageEl.src = '';
      imageEl.alt = '';
    }
    if (bioTemplate) {
      replaceContent(bioEl, bioTemplate.content.cloneNode(true));
    } else {
      bioEl.textContent = '';
    }

    // Prevent layout shift from scrollbar
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    offcanvas.classList.add('is-active');
    offcanvas.setAttribute('aria-hidden', 'false');
    cards.forEach(item => item.setAttribute('aria-expanded', 'false'));
    card.setAttribute('aria-expanded', 'true');
    document.body.classList.add('offcanvas-sidebar-open');

    // Add escape key handler
    if (!escapeHandler) {
      escapeHandler = event => {
        if (event.key === 'Escape') {
          closeOffcanvas();
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }

    // Focus close button
    if (focusTimeout) {
      cancelAnimationFrame(focusTimeout);
    }
    focusTimeout = requestAnimationFrame(() => {
      closeBtn.focus();
      focusTimeout = null;
    });
  }

  /**
   * Close offcanvas panel
   */
  function closeOffcanvas() {
    offcanvas.classList.remove('is-active');
    offcanvas.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('offcanvas-sidebar-open');
    document.body.style.paddingRight = '';

    // Remove escape key handler
    if (escapeHandler) {
      document.removeEventListener('keydown', escapeHandler);
      escapeHandler = null;
    }

    // Clear any pending focus timeout
    if (focusTimeout) {
      cancelAnimationFrame(focusTimeout);
      focusTimeout = null;
    }

    // Return focus
    if (lastFocusedElement) {
      lastFocusedElement.setAttribute('aria-expanded', 'false');
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  /**
   * Handle focus trap within offcanvas panel
   * 
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleFocusTrap(event) {
    if (event.key !== 'Tab') {
      return;
    }
    const focusableElements = getFocusableElements(panel);
    if (!focusableElements.length) {
      event.preventDefault();
      return;
    }
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else if (document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }

  // Initialize cards
  cards.forEach(card => {
    // Ensure ARIA attributes
    if (!card.hasAttribute('role')) {
      card.setAttribute('role', 'button');
    }
    if (!card.hasAttribute('tabindex')) {
      card.setAttribute('tabindex', '0');
    }
    if (!card.hasAttribute('aria-haspopup')) {
      card.setAttribute('aria-haspopup', 'dialog');
    }
    card.setAttribute('aria-expanded', 'false');
    if (offcanvasId) {
      card.setAttribute('aria-controls', offcanvasId);
    }
    const cardName = card.getAttribute('data-team-name');
    if (cardName && !card.hasAttribute('aria-label')) {
      card.setAttribute('aria-label', `View details for ${cardName}`);
    }
    card.addEventListener('click', () => {
      openOffcanvas(card);
    });
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openOffcanvas(card);
      }
    });
  });

  // Close button handler
  closeBtn.addEventListener('click', closeOffcanvas);

  // Overlay click handler
  overlay?.addEventListener('click', closeOffcanvas);

  // Focus trap
  panel.addEventListener('keydown', handleFocusTrap);
}

/**
 * Initialize Swiper sliders
 * 
 * @param {NodeList} sliders - Slider elements
 * @return {Promise<void>}
 */
async function initSliders(sliders) {
  try {
    const {
      default: Swiper
    } = await __webpack_require__.e(/*! import() */ "vendors-node_modules_swiper_swiper-bundle_mjs").then(__webpack_require__.bind(__webpack_require__, /*! swiper/bundle */ "./node_modules/swiper/swiper-bundle.mjs"));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sliders.forEach(sliderElement => {
      let config = {};
      const configAttr = sliderElement.getAttribute('data-swiper-config');
      if (configAttr) {
        try {
          config = JSON.parse(configAttr);
        } catch {
          config = {};
        }
      }
      const slideCount = sliderElement.querySelectorAll('.swiper-slide').length;
      const hasMultipleSlides = slideCount > 1;
      const showNavigation = config.navigation_show !== false;
      const nextEl = showNavigation ? sliderElement.querySelector('.custom-next') : null;
      const prevEl = showNavigation ? sliderElement.querySelector('.custom-prev') : null;
      const paginationEl = sliderElement.querySelector('.swiper-pagination');
      const buttonsEl = sliderElement.querySelector('.swiper-buttons');
      if (!hasMultipleSlides) {
        buttonsEl?.setAttribute('hidden', '');
        paginationEl?.setAttribute('hidden', '');
      }
      const autoplayConfig = config.autoplay && hasMultipleSlides && !prefersReducedMotion ? {
        delay: CONSTANTS.AUTOPLAY_DELAY,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      } : false;
      new Swiper(sliderElement, {
        slidesPerView: 1.4,
        spaceBetween: CONSTANTS.SLIDE_SPACING,
        loop: hasMultipleSlides,
        speed: prefersReducedMotion ? 0 : 300,
        keyboard: {
          enabled: true,
          onlyInViewport: true
        },
        a11y: {
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          firstSlideMessage: 'This is the first slide',
          lastSlideMessage: 'This is the last slide',
          paginationBulletMessage: 'Go to slide {{index}}'
        },
        navigation: hasMultipleSlides && showNavigation && nextEl && prevEl ? {
          nextEl,
          prevEl
        } : false,
        pagination: hasMultipleSlides && paginationEl ? {
          el: paginationEl,
          clickable: true
        } : false,
        autoplay: autoplayConfig,
        breakpoints: {
          640: {
            slidesPerView: 1.5
          },
          768: {
            slidesPerView: 1.5
          },
          1024: {
            slidesPerView: 3.5
          },
          1200: {
            slidesPerView: 4.4,
            spaceBetween: CONSTANTS.SLIDE_SPACING_DESKTOP
          }
        },
        on: {
          init() {
            sliderElement.classList.add('is-initialized');
          }
        }
      });
    });
  } catch {
    return;
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize sliders
  const sliders = document.querySelectorAll('.our-leadership-slider');
  if (sliders.length) {
    initSliders(sliders);
  }

  // Initialize offcanvas panels
  const teamBlocks = document.querySelectorAll('.our-team, .our-leadership');
  teamBlocks.forEach(initOffcanvas);
});
/******/ })()
;
//# sourceMappingURL=view.js.map