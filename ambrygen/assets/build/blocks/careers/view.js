/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/src/images/close-icon.svg"
/*!******************************************!*\
  !*** ./assets/src/images/close-icon.svg ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgCloseIcon),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _path, _path2;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

var SvgCloseIcon = function SvgCloseIcon(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: 36,
    height: 36,
    fill: "none"
  }, props), _path || (_path = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    fill: "#270841",
    fillRule: "evenodd",
    d: "M28.06 7.94a1.5 1.5 0 0 1 0 2.12l-18 18a1.5 1.5 0 0 1-2.12-2.12l18-18a1.5 1.5 0 0 1 2.12 0",
    clipRule: "evenodd"
  })), _path2 || (_path2 = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    fill: "#270841",
    fillRule: "evenodd",
    d: "M7.94 7.94a1.5 1.5 0 0 1 2.12 0l18 18a1.5 1.5 0 0 1-2.12 2.12l-18-18a1.5 1.5 0 0 1 0-2.12",
    clipRule: "evenodd"
  })));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjguMDYwNyA3LjkzOTM0QzI4LjY0NjQgOC41MjUxMyAyOC42NDY0IDkuNDc0ODcgMjguMDYwNyAxMC4wNjA3TDEwLjA2MDcgMjguMDYwN0M5LjQ3NDg3IDI4LjY0NjQgOC41MjUxMyAyOC42NDY0IDcuOTM5MzQgMjguMDYwN0M3LjM1MzU1IDI3LjQ3NDkgNy4zNTM1NSAyNi41MjUxIDcuOTM5MzQgMjUuOTM5M0wyNS45MzkzIDcuOTM5MzRDMjYuNTI1MSA3LjM1MzU1IDI3LjQ3NDkgNy4zNTM1NSAyOC4wNjA3IDcuOTM5MzRaIiBmaWxsPSIjMjcwODQxIi8+DQo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuOTM5MzQgNy45MzkzNEM4LjUyNTEzIDcuMzUzNTUgOS40NzQ4NyA3LjM1MzU1IDEwLjA2MDcgNy45MzkzNEwyOC4wNjA3IDI1LjkzOTNDMjguNjQ2NCAyNi41MjUxIDI4LjY0NjQgMjcuNDc0OSAyOC4wNjA3IDI4LjA2MDdDMjcuNDc0OSAyOC42NDY0IDI2LjUyNTEgMjguNjQ2NCAyNS45MzkzIDI4LjA2MDdMNy45MzkzNCAxMC4wNjA3QzcuMzUzNTUgOS40NzQ4NyA3LjM1MzU1IDguNTI1MTMgNy45MzkzNCA3LjkzOTM0WiIgZmlsbD0iIzI3MDg0MSIvPg0KPC9zdmc+DQo=");

/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

module.exports = window["React"];

/***/ }

/******/ 	});
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
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************************!*\
  !*** ./assets/src/blocks/careers/view.js ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _images_close_icon_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../images/close-icon.svg */ "./assets/src/images/close-icon.svg");


/**
 * Front-end JS for Careers Highlight Block
 * Opens the existing video in a popup.
 */
document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.careers-highlight');
  const addAutoplay = src => {
    if (!src || src.includes('autoplay=1')) {
      return src;
    }
    return `${src}${src.includes('?') ? '&' : '?'}autoplay=1`;
  };
  const createModal = id => {
    const modal = document.createElement('div');
    modal.className = 'modal-popup modal-popup--video';
    modal.hidden = true;
    if (id) {
      modal.id = id;
    }
    modal.innerHTML = `
			<div class="modal-popup__overlay"></div>
			<div class="modal-popup__panel" role="dialog" aria-modal="true" aria-label="Video dialog">
				<button type="button" class="modal-popup__close" aria-label="Close modal">
					<img decoding="async" src="${_images_close_icon_svg__WEBPACK_IMPORTED_MODULE_0__["default"]}" alt="" aria-hidden="true" />
				</button>
				<div class="modal-content">
					<div class="modal-content__video-wrapper"></div>
				</div>
			</div>
		`;
    return modal;
  };
  const setVideoSize = videoWrapper => {
    videoWrapper.style.aspectRatio = '16 / 9';
    videoWrapper.style.backgroundColor = '#1a1a1a';
    videoWrapper.style.borderRadius = '12px';
    videoWrapper.style.overflow = 'hidden';
    videoWrapper.style.position = 'relative';
    videoWrapper.style.width = '100%';
  };
  const setMediaSize = media => {
    media.style.border = '0';
    media.style.height = '100%';
    media.style.left = '0';
    media.style.margin = '0';
    media.style.position = 'absolute';
    media.style.top = '0';
    media.style.width = '100%';
  };
  const trapFocus = (event, panel) => {
    if (event.key !== 'Tab') {
      return;
    }
    const focusable = Array.from(panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])')).filter(element => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true');
    if (!focusable.length) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  blocks.forEach(block => {
    const toggleWrap = block.querySelector('.play-icon-video');
    const playIcon = toggleWrap?.querySelector('.play-icon');
    const pauseIcon = toggleWrap?.querySelector('.pause-icon');
    if (!toggleWrap || !playIcon || !pauseIcon) {
      return;
    }
    pauseIcon.style.display = 'none';
    const video = block.querySelector('video.videos');
    const iframe = block.querySelector('.video-embed iframe');
    if (!video && !iframe) {
      return;
    }
    let modal = null;
    const closeModal = () => {
      if (!modal) {
        return;
      }
      modal.classList.remove('is-active');
      modal.hidden = true;
      toggleWrap.setAttribute('aria-expanded', 'false');
      modal.querySelector('.modal-content__video-wrapper')?.replaceChildren();
      toggleWrap.focus();
    };
    const openModal = () => {
      if (!modal) {
        modal = createModal(toggleWrap.getAttribute('aria-controls'));
        block.appendChild(modal);
        modal.querySelector('.modal-popup__overlay')?.addEventListener('click', closeModal);
        modal.querySelector('.modal-popup__close')?.addEventListener('click', closeModal);
        modal.querySelector('.modal-popup__panel')?.addEventListener('keydown', event => {
          if (event.key === 'Escape') {
            closeModal();
            return;
          }
          trapFocus(event, event.currentTarget);
        });
      }
      const videoWrapper = modal.querySelector('.modal-content__video-wrapper');
      if (!videoWrapper) {
        return;
      }
      let modalMedia;
      if (video) {
        const source = video.querySelector('source');
        const src = video.currentSrc || source?.src || video.src;
        if (!src) {
          return;
        }
        modalMedia = document.createElement('video');
        modalMedia.className = 'videos';
        modalMedia.controls = true;
        modalMedia.autoplay = true;
        modalMedia.playsInline = true;
        modalMedia.src = src;
        if (video.poster) {
          modalMedia.poster = video.poster;
        }
      } else {
        const src = iframe.getAttribute('src');
        if (!src) {
          return;
        }
        modalMedia = document.createElement('iframe');
        modalMedia.src = addAutoplay(src);
        modalMedia.title = iframe.title || 'Video';
        modalMedia.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        modalMedia.allowFullscreen = true;
      }
      setVideoSize(videoWrapper);
      setMediaSize(modalMedia);
      videoWrapper.replaceChildren(modalMedia);
      modal.hidden = false;
      modal.classList.add('is-active');
      toggleWrap.setAttribute('aria-expanded', 'true');
      modal.querySelector('.modal-popup__close')?.focus();
      if (video) {
        modalMedia.play().catch(() => {});
      }
    };
    toggleWrap.addEventListener('click', event => {
      event.preventDefault();
      openModal();
    });
    if ('BUTTON' !== toggleWrap.tagName) {
      toggleWrap.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }
        event.preventDefault();
        openModal();
      });
    }
  });
});
})();

/******/ })()
;
//# sourceMappingURL=view.js.map