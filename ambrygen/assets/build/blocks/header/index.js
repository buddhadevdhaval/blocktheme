/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/src/blocks/_shared/components.js"
/*!*************************************************!*\
  !*** ./assets/src/blocks/_shared/components.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BlockExamplePreview: () => (/* binding */ BlockExamplePreview),
/* harmony export */   BlockVariationsExamplePreview: () => (/* binding */ BlockVariationsExamplePreview),
/* harmony export */   CtaButtonField: () => (/* binding */ CtaButtonField),
/* harmony export */   DEFAULT_IMAGES: () => (/* binding */ DEFAULT_IMAGES),
/* harmony export */   Field: () => (/* binding */ Field),
/* harmony export */   IconPicker: () => (/* binding */ IconPicker),
/* harmony export */   ImagePlaceholder: () => (/* binding */ ImagePlaceholder),
/* harmony export */   ImageUploader: () => (/* binding */ ImageUploader),
/* harmony export */   ItemControls: () => (/* binding */ ItemControls),
/* harmony export */   ItemHeader: () => (/* binding */ ItemHeader),
/* harmony export */   PanelItem: () => (/* binding */ PanelItem),
/* harmony export */   TagSelector: () => (/* binding */ TagSelector),
/* harmony export */   Toggle: () => (/* binding */ Toggle)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/chevron-down.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/chevron-up.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/trash.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/upload.mjs");
/* harmony import */ var _utils_assets__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/assets */ "./assets/src/utils/assets.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * Shared UI Components for Block Editors
 *
 * Reusable components to reduce boilerplate in block editors.
 * Import from: '../_shared/components'
 *
 * @package
 */







/**
 * Shared global configuration
 *
 * @package
 */

const DEFAULT_IMAGES = () => ({
  placeholder: {
    id: window?.ambrygenAssets?.defaultImageId ? parseInt(window.ambrygenAssets.defaultImageId, 10) : 0,
    url: window?.ambrygenAssets?.defaultImageUrl || '',
    alt: 'Default image'
  }
});

/* ─────────────────────────────────────────────────────────────
   Item Controls
───────────────────────────────────────────────────────────── */

/**
 * Standard item control buttons.
 *
 * @param {Object}   props              - Component props.
 * @param {number}   props.index        - Current item index.
 * @param {number}   props.total        - Total number of items.
 * @param {Function} props.onMove       - Move handler.
 * @param {Function} props.onRemove     - Remove handler.
 * @param {number}   [props.minCount=1] - Minimum allowed items.
 */
function ItemControls({
  index,
  total,
  onMove,
  onRemove,
  minCount = 1
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    style: {
      display: 'flex',
      gap: '4px'
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"],
      size: "small",
      disabled: index === 0,
      onClick: () => onMove(index, -1),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Move Up', 'ambrygen-web')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
      size: "small",
      disabled: index >= total - 1,
      onClick: () => onMove(index, 1),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Move Down', 'ambrygen-web')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
      size: "small",
      isDestructive: true,
      disabled: total <= minCount,
      onClick: () => onRemove(index),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Remove', 'ambrygen-web')
    })]
  });
}

/**
 * Panel item header with title and controls.
 *
 * @param {Object}   props          - Component props.
 * @param {number}   props.index    - Current index.
 * @param {string}   props.label    - Item label.
 * @param {number}   props.total    - Total items.
 * @param {Function} props.onMove   - Move handler.
 * @param {Function} props.onRemove - Remove handler.
 * @param {number}   props.minCount - Minimum item count.
 */
function ItemHeader({
  index,
  label,
  total,
  onMove,
  onRemove,
  minCount,
  prefix = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Item', 'ambrygen-web')
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: "reorder-controls",
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      gap: '8px'
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("strong", {
      style: {
        flex: '1 1 auto',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      },
      children: [prefix, " ", index + 1, ":", ' ', label || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Untitled', 'ambrygen-web')]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      style: {
        flex: '0 0 auto'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(ItemControls, {
        index: index,
        total: total,
        onMove: onMove,
        onRemove: onRemove,
        minCount: minCount
      })
    })]
  });
}

/* ─────────────────────────────────────────────────────────────
   Image Components
───────────────────────────────────────────────────────────── */

const imgPreviewStyle = {
  maxWidth: '100%',
  height: 'auto',
  marginBottom: '8px',
  borderRadius: '4px'
};

/**
 * Image upload with preview.
 *
 * @param {Object}   props          - Component props.
 * @param {string}   props.url      - Image URL.
 * @param {Function} props.onSelect - Select handler.
 * @param {Function} props.onRemove - Remove handler.
 * @param {string}   [props.label]  - Optional label.
 */
function ImageUploader({
  url,
  onSelect,
  onRemove,
  label
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    style: {
      marginBottom: '8px'
    },
    children: [label && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
      style: {
        marginBottom: '4px',
        fontWeight: '500'
      },
      children: label
    }), url ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("img", {
        src: url,
        alt: "",
        style: imgPreviewStyle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        style: {
          display: 'flex',
          gap: '8px'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
            onSelect: onSelect,
            allowedTypes: ['image'],
            render: ({
              open
            }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
              variant: "secondary",
              size: "small",
              onClick: open,
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Replace', 'ambrygen-web')
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
          variant: "secondary",
          size: "small",
          isDestructive: true,
          onClick: onRemove,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Remove', 'ambrygen-web')
        })]
      })]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: onSelect,
        allowedTypes: ['image'],
        render: ({
          open
        }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
          variant: "secondary",
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__["default"],
          onClick: open,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Upload Image', 'ambrygen-web')
        })
      })
    })]
  });
}

/**
 * Small clickable icon picker.
 *
 * @param {Object}   props          - Component props.
 * @param {string}   props.url      - Icon URL.
 * @param {Function} props.onSelect - Select handler.
 */
function IconPicker({
  url,
  onSelect
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: media => onSelect(media.url),
      allowedTypes: ['image'],
      render: ({
        open
      }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
        type: "button",
        onClick: open,
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          width: '24px',
          height: '24px',
          background: url ? 'transparent' : '#eee',
          border: 'none',
          padding: 0
        },
        children: url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("img", {
          src: url,
          alt: "",
          style: {
            width: '100%',
            height: '100%'
          }
        })
      })
    })
  });
}

/* ─────────────────────────────────────────────────────────────
   Panel Components
───────────────────────────────────────────────────────────── */

const panelItemStyle = {
  marginBottom: '16px',
  padding: '12px',
  background: '#f0f0f0',
  borderRadius: '4px'
};

/**
 * Styled panel item container.
 *
 * @param {Object}   props          - Component props.
 * @param {boolean}  props.active   - Active state.
 * @param {Function} props.onClick  - Click handler.
 * @param {Object}   props.children - Child content.
 */
function PanelItem({
  active,
  onClick,
  children
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
    type: "button",
    style: {
      ...panelItemStyle,
      background: active ? '#e0e7ff' : '#f0f0f0',
      border: 'none',
      width: '100%',
      textAlign: 'left'
    },
    onClick: onClick,
    children: children
  });
}

/* ─────────────────────────────────────────────────────────────
   Form Fields
───────────────────────────────────────────────────────────── */

/**
 * Standard TextControl wrapper.
 *
 * @param {Object}   props               - Component props.
 * @param {string}   props.label         - Field label.
 * @param {string}   props.value         - Field value.
 * @param {Function} props.onChange      - Change handler.
 * @param {string}   [props.placeholder] - Placeholder text.
 * @param {string}   [props.help]        - Help text.
 */

function Field({
  label,
  value,
  onChange,
  placeholder,
  help,
  ...props
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
    label: label,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    help: help,
    ...props
  });
}

/**
 * ToggleControl wrapper.
 *
 * @param {Object}   props          - Component props.
 * @param {string}   props.label    - Toggle label.
 * @param {boolean}  props.checked  - Toggle state.
 * @param {Function} props.onChange - Change handler.
 */
function Toggle({
  label,
  checked,
  onChange
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToggleControl, {
    label: label,
    checked: checked,
    onChange: onChange
  });
}

/* ─────────────────────────────────────────────────────────────
   Placeholder States
───────────────────────────────────────────────────────────── */
function ImagePlaceholder({
  text = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No image set', 'ambrygen-web'),
  minHeight = '100px'
}) {
  const placeholderStyle = {
    color: '#999',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight,
    background: '#f0f0f0'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
    style: placeholderStyle,
    children: text
  });
}

/**
 * Shared single-image preview for inserter examples.
 *
 * @param {Object} props            Component props.
 * @param {string} props.imagePath  Theme-relative image path.
 * @param {string} props.className  Preview wrapper class.
 * @param {number} props.width      Preview image width.
 */
function BlockExamplePreview({
  imagePath,
  className = 'block-example-preview',
  width = 620
}) {
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("img", {
      src: (0,_utils_assets__WEBPACK_IMPORTED_MODULE_8__.getThemeAssetUrl)(imagePath),
      alt: "",
      width: width
    })
  });
}

/**
 * Shared multi-variation preview for inserter examples.
 *
 * @param {Object}  props           Component props.
 * @param {Array}   props.variants  Variation items with image and value.
 * @param {string}  props.className Preview wrapper class.
 * @param {string}  props.itemClass Preview item class.
 */
function BlockVariationsExamplePreview({
  variants = [],
  className = 'block-example-preview',
  itemClass = 'block-example-preview__item'
}) {
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
    ...blockProps,
    children: variants.map(variant => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: itemClass,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("img", {
        src: variant.imagePath ? (0,_utils_assets__WEBPACK_IMPORTED_MODULE_8__.getThemeAssetUrl)(variant.imagePath) : variant.image,
        alt: ""
      })
    }, variant.value || variant.imagePath || variant.image))
  });
}
/**
 * HTML tag selector.
 *
 * @param {Object}   props          - Component props.
 * @param {string}   [props.label]  - Label text.
 * @param {string}   props.value    - Selected tag.
 * @param {Function} props.onChange - Change handler.
 * @param {string}   [props.type]   - Tag type (heading | text | all).
 */
function TagSelector({
  label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('HTML Tag', 'ambrygen-web'),
  value = 'h2',
  onChange,
  type = 'all'
}) {
  let options = [];
  const headingTags = [{
    label: 'H1',
    value: 'h1'
  }, {
    label: 'H2',
    value: 'h2'
  }, {
    label: 'H3',
    value: 'h3'
  }, {
    label: 'H4',
    value: 'h4'
  }, {
    label: 'H5',
    value: 'h5'
  }, {
    label: 'H6',
    value: 'h6'
  }];
  const textTags = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Paragraph', 'ambrygen-web'),
    value: 'p'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Div', 'ambrygen-web'),
    value: 'div'
  }];
  if (type === 'heading') {
    options = headingTags;
  } else if (type === 'text') {
    options = textTags;
  } else {
    options = [...headingTags, ...textTags];
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
    label: label,
    value: value,
    options: options,
    onChange: onChange
  });
}

/**
 * CTA Button field wrapper.
 *
 * @param {Object}   props                    - Component props.
 * @param {string}   [props.label]            - Field label.
 * @param {Object}   props.value              - Link value object.
 * @param {Function} props.onChange           - Change handler.
 * @param {string}   [props.help]             - Help text.
 * @param {boolean}  [props.showText=true]    - Show text field.
 * @param {string}   [props.textLabel]        - Text label.
 * @param {string}   [props.textPlaceholder]  - Text field placeholder.
 * @param {boolean}  [props.showVariant=true] - Show variant selector.
 * @param {string}   [props.variantLabel]     - Variant label.
 */

function CtaButtonField({
  label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Link', 'ambrygen-web'),
  value = {},
  onChange,
  help,
  showText = true,
  textLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Link Text', 'ambrygen-web'),
  textPlaceholder = '',
  showVariant = true,
  variantLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Button Style', 'ambrygen-web'),
  showNewTab = true
}) {
  const updateValue = updates => {
    onChange({
      ...value,
      ...updates
    });
  };
  const clearLink = () => {
    updateValue({
      url: '',
      target: '',
      rel: ''
    });
  };
  const linkValue = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => ({
    url: value?.url || '',
    title: value?.text || '',
    opensInNewTab: value?.target === '_blank'
  }), [value?.url, value?.text, value?.target]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    style: {
      marginBottom: '16px'
    },
    children: [label && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
      style: {
        marginBottom: '6px',
        fontWeight: '500'
      },
      children: label
    }), showText && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
      label: textLabel,
      value: value?.text || '',
      placeholder: textPlaceholder,
      onChange: text => updateValue({
        text
      })
    }), showVariant && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
      label: variantLabel,
      value: value?.variant || 'dark',
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Light', 'ambrygen-web'),
        value: 'is-style-site-tertiary-btn'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Dark', 'ambrygen-web'),
        value: 'dark'
      }],
      onChange: variant => updateValue({
        variant
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.LinkControl, {
      value: linkValue,
      settings: [],
      onChange: newLink => {
        updateValue({
          url: newLink?.url || '',
          target: newLink.opensInNewTab ? '_blank' : '',
          rel: newLink.opensInNewTab ? 'noopener noreferrer' : ''
        });
      }
    }, `${label}-${value?.url || 'empty'}-${value?.target || 'same-tab'}`), value?.url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
      variant: "link",
      isDestructive: true,
      onClick: clearLink,
      style: {
        marginTop: '8px'
      },
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Remove Link', 'ambrygen-web')
    }), showNewTab && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Open in new tab', 'ambrygen-web'),
      checked: value?.target === '_blank',
      onChange: opensInNewTab => updateValue({
        target: opensInNewTab ? '_blank' : '',
        rel: opensInNewTab ? 'noopener noreferrer' : ''
      })
    }), help && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
      style: {
        fontSize: '12px',
        color: '#666'
      },
      children: help
    })]
  });
}

/***/ },

/***/ "./assets/src/blocks/_shared/utils.js"
/*!********************************************!*\
  !*** ./assets/src/blocks/_shared/utils.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cx: () => (/* binding */ cx),
/* harmony export */   generateMenuId: () => (/* binding */ generateMenuId),
/* harmony export */   useArrayHandlers: () => (/* binding */ useArrayHandlers)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Shared Block Utilities
 *
 * Common hooks and helpers for header and mega menu blocks.
 * Import from: '../_shared/utils'
 *
 * @package
 */


/**
 * Builds className string from array, filtering falsy values.
 * @param {...string} classes - Class names
 * @return {string} Combined className
 */
const cx = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Generates a unique menu ID.
 * @return {string} Unique ID
 */
const generateMenuId = () => `menu-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Creates array manipulation callbacks with immutable updates.
 *
 * @param {Function} setAttributes - Block setAttributes function
 * @param {string}   key           - Attribute key containing the array
 * @return {Object} Handler functions: { update, add, remove, move }
 */
function useArrayHandlers(setAttributes, key) {
  const update = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((index, prop, value) => {
    setAttributes(prev => {
      const items = [...prev[key]];
      items[index] = {
        ...items[index],
        [prop]: value
      };
      return {
        [key]: items
      };
    });
  }, [setAttributes, key]);
  const add = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(defaultItem => {
    setAttributes(prev => ({
      [key]: [...prev[key], {
        ...defaultItem
      }]
    }));
  }, [setAttributes, key]);
  const remove = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((index, minCount = 1) => {
    setAttributes(prev => {
      if (prev[key].length <= minCount) {
        return {};
      }
      return {
        [key]: prev[key].filter((_, i) => i !== index)
      };
    });
  }, [setAttributes, key]);
  const move = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((index, direction) => {
    setAttributes(prev => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev[key].length) {
        return {};
      }
      const items = [...prev[key]];
      [items[index], items[newIndex]] = [items[newIndex], items[index]];
      return {
        [key]: items
      };
    });
  }, [setAttributes, key]);
  return {
    update,
    add,
    remove,
    move
  };
}

/***/ },

/***/ "./assets/src/blocks/header/block.json"
/*!*********************************************!*\
  !*** ./assets/src/blocks/header/block.json ***!
  \*********************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"ambrygen/header","version":"1.0.0","title":"Site Header","category":"ambrygen","icon":"admin-home","description":"Complete site header with navigation and mega menus","attributes":{"topBarText":{"type":"string","default":"Find us at ACMG! We\'re on booth A312, Walk in to connect with us, or use this link to setup a 1:1."},"topBarLinkText":{"type":"string","default":""},"topBarLinkUrl":{"type":"string","default":""},"topBarVisible":{"type":"boolean","default":true},"navItems":{"type":"array","default":[{"label":"Patients","url":"#","hasMegaMenu":true,"megaMenuBlock":"ambrygen/mega-menu-3-columns"},{"label":"Providers","url":"#","hasMegaMenu":true,"megaMenuBlock":"ambrygen/mega-menu-3-columns"},{"label":"Solutions","url":"#","hasMegaMenu":true,"megaMenuBlock":"ambrygen/mega-menu-split","isSecondLevel":true},{"label":"Company","url":"#","hasMegaMenu":true,"megaMenuBlock":"ambrygen/mega-menu-split","isSecondLevel":true},{"label":"Contact","url":"#","hasMegaMenu":false}]},"loginUrl":{"type":"string","default":"#"},"loginText":{"type":"string","default":"Login"},"mobileCtaText":{"type":"string","default":"See a Demo"},"mobileCtaUrl":{"type":"string","default":"#"},"logoUrl":{"type":"string","default":""},"logoId":{"type":"number","default":0},"logoAlt":{"type":"string","default":"Ambry Genetics"},"modalPosition":{"type":"string","default":"center"}},"supports":{"html":false,"align":["full","wide"]},"textdomain":"ambrygen-web","editorScript":"file:./index.js","editorStyle":"file:./index.css","render":"file:./render.php","example":{"attributes":{"topBarText":"Find us at ACMG! We\'re on booth A312, Walk in to connect with us, or use this link to setup a 1:1.","topBarLinkText":"Learn More","topBarLinkUrl":"https://example.com","topBarVisible":true,"navItems":[{"label":"Patients","url":"#","hasMegaMenu":true,"megaMenuBlock":"ambrygen/mega-menu-3-columns"},{"label":"Providers","url":"#","hasMegaMenu":true,"megaMenuBlock":"ambrygen/mega-menu-3-columns"},{"label":"Solutions","url":"#","hasMegaMenu":true,"megaMenuBlock":"ambrygen/mega-menu-split","isSecondLevel":true},{"label":"Company","url":"#","hasMegaMenu":true,"megaMenuBlock":"ambrygen/mega-menu-split","isSecondLevel":true},{"label":"Contact","url":"#","hasMegaMenu":false}],"loginUrl":"#","loginText":"Login","mobileCtaText":"See a Demo","mobileCtaUrl":"#","logoUrl":"https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png","logoId":0,"logoAlt":"Ambry Genetics"}}}');

/***/ },

/***/ "./assets/src/blocks/header/edit.js"
/*!******************************************!*\
  !*** ./assets/src/blocks/header/edit.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.mjs");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _shared_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../_shared/utils */ "./assets/src/blocks/_shared/utils.js");
/* harmony import */ var _shared_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../_shared/components */ "./assets/src/blocks/_shared/components.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * Header Block - Edit Component
 *
 * Renders the header block editor interface with:
 * - Top bar configuration
 * - Navigation items management
 * - Mega menu block assignments
 *
 * @package
 */








// Shared imports



/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */

const ALLOWED_BLOCKS = ['ambrygen/mega-menu-3-columns', 'ambrygen/mega-menu-split'];
const TEMPLATE = [['ambrygen/mega-menu-3-columns', {}], ['ambrygen/mega-menu-split', {}]];
const DEFAULT_NAV_ITEM = {
  label: 'New Item',
  url: '#',
  hasMegaMenu: false,
  megaMenuId: '',
  isSecondLevel: false
};
const DEFAULT_LOGO = '/wp-content/themes/ambrygen/assets/src/images/site-logo.svg';

/* ─────────────────────────────────────────────────────────────
   Sub-Components
───────────────────────────────────────────────────────────── */

/**
 * Single navigation item editor in sidebar.
 *
 * @param {Object}                             props             The component props.
 * @param {Object}                             props.item        The navigation item.
 * @param {number}                             props.index       Item index.
 * @param {number}                             props.total       Total items.
 * @param {Function}                           props.onUpdate    Update handler.
 * @param {Function}                           props.onMove      Move handler.
 * @param {Function}                           props.onRemove    Remove handler.
 * @param {Array<{label:string,value:string}>} props.menuOptions Menu options.
 * @return {JSX.Element} The rendered element.
 */
function NavItemEditor({
  item,
  index,
  total,
  onUpdate,
  onMove,
  onRemove,
  menuOptions
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: "header-editor__nav-item-panel",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.ItemHeader, {
      index: index,
      label: item.label,
      total: total,
      onMove: onMove,
      onRemove: onRemove
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.Field, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Label', 'ambrygen-web'),
      value: item.label,
      onChange: v => onUpdate(index, 'label', v)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.Field, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('URL', 'ambrygen-web'),
      value: item.url,
      onChange: v => onUpdate(index, 'url', v)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.Toggle, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Has Mega Menu', 'ambrygen-web'),
      checked: item.hasMegaMenu,
      onChange: v => onUpdate(index, 'hasMegaMenu', v)
    }), item.hasMegaMenu && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Select Mega Menu Instance', 'ambrygen-web'),
        value: item.megaMenuId,
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('— Select a Menu —', 'ambrygen-web'),
          value: ''
        }, ...menuOptions],
        onChange: v => onUpdate(index, 'megaMenuId', v),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Select the specific mega menu to display.', 'ambrygen-web')
      }), item.megaMenuId && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
        variant: "secondary",
        isDestructive: true,
        onClick: () => onUpdate(index, 'megaMenuId', ''),
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Unlink Menu', 'ambrygen-web')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.Toggle, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Second Level Style', 'ambrygen-web'),
        checked: item.isSecondLevel,
        onChange: v => onUpdate(index, 'isSecondLevel', v)
      })]
    })]
  });
}

/**
 * Top bar preview component.
 *
 * @param {Object}  props          The component props.
 * @param {boolean} props.visible  If visible.
 * @param {string}  props.text     Text.
 * @param {string}  props.linkText Link text.
 * @return {JSX.Element|null} The rendered element.
 */
function TopBar({
  visible,
  text,
  linkText
}) {
  if (!visible) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
    className: "top-bar center-align container-1340",
    id: "top-bar-ajax",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: "top-bar__wrapper wrapper",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "top-bar__row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "top-bar__text",
          children: [text, linkText && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
            style: {
              marginLeft: '5px'
            },
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
              type: "button",
              className: "top-bar__link is-style-link-text-btn",
              style: {
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              },
              onClick: e => e.preventDefault(),
              children: linkText
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
          className: "top-bar__close",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
            className: "top-bar__close-icon",
            children: "\xD7"
          })
        })]
      })
    })
  });
}

/**
 * Navigation item in preview.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.item     The navigation item.
 * @param {boolean}  props.isActive If active.
 * @param {Function} props.onClick  Click handler.
 * @return {JSX.Element} The rendered element.
 */
function NavItem({
  item,
  isActive,
  onClick
}) {
  const classes = (0,_shared_utils__WEBPACK_IMPORTED_MODULE_7__.cx)('nav__item', item.hasMegaMenu && 'nav__item--has-children nav__item--menu-has-children', isActive && 'nav__item--active');
  const handleClick = e => {
    e.preventDefault();
    onClick(item);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("li", {
    className: classes,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: "nav__item--angle",
      children: item.hasMegaMenu ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        className: "nav__item--tringle-touch",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("a", {
          href: item.url || '#',
          className: "nav__link",
          role: "menuitem",
          onClick: handleClick,
          children: item.label
        })
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("a", {
        href: item.url || '#',
        className: "nav__link",
        role: "menuitem",
        onClick: handleClick,
        children: item.label
      })
    }), item.hasMegaMenu && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
      className: "nav__expand"
    })]
  });
}

/**
 * Header preview in the editor.
 *
 * @param {Object}      props
 * @param {boolean}     props.topBarVisible
 * @param {string}      props.topBarText
 * @param {string}      props.topBarLinkText
 * @param {Array}       props.navItems
 * @param {string}      props.loginText
 * @param {string|null} props.activeMenu
 * @param {string}      props.logoUrl
 * @param {string}      props.logoAlt
 * @param {Function}    props.onNavClick
 * @return {JSX.Element} The rendered element.
 */
function HeaderPreview({
  topBarVisible,
  topBarText,
  topBarLinkText,
  navItems,
  loginText,
  activeMenu,
  logoUrl,
  logoAlt,
  onNavClick
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(TopBar, {
      visible: topBarVisible,
      text: topBarText,
      linkText: topBarLinkText
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: "header container-1340",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        className: "wrapper",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "header__inner d-flex justify-content-between",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "header__logo logo",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("a", {
              href: "/",
              className: "header__logo-link",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("img", {
                className: "header__logo-img header__logo-img--default",
                src: logoUrl || DEFAULT_LOGO,
                alt: logoAlt || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Site Logo', 'ambrygen-web')
              })
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "header__right",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
              className: "nav",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
                className: "nav__overlay",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
                  className: "nav__container",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("nav", {
                    className: "nav__menu",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("ul", {
                      className: "nav__list",
                      children: navItems.map((item, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(NavItem, {
                        item: item,
                        isActive: activeMenu === item.megaMenuId,
                        onClick: onNavClick
                      }, i))
                    })
                  })
                })
              })
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
            className: "header__right--col header__btns--desktop",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
              className: "header__search",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("form", {
                id: "header-search-form",
                role: "search",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
                  type: "text",
                  name: "s",
                  placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Search', 'ambrygen-web'),
                  disabled: true
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
                  className: "button",
                  type: "button",
                  disabled: true,
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Search', 'ambrygen-web')
                })]
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
              className: "header__login",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
                className: "site-btn is-style-site-marker-btn",
                children: loginText
              })
            })]
          })]
        })
      })
    })]
  });
}

/* ─────────────────────────────────────────────────────────────
   Main Edit Component
───────────────────────────────────────────────────────────── */
/**
 * Edit component for Header block.
 *
 * @param {Object}   props
 * @param {Object}   props.attributes
 * @param {Function} props.setAttributes
 * @param {string}   props.clientId
 * @return {JSX.Element} The rendered element.
 */
function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    topBarText,
    topBarVisible,
    navItems,
    loginUrl,
    loginText,
    mobileCtaText,
    mobileCtaUrl,
    logoUrl,
    logoAlt,
    topBarLinkText,
    topBarLinkUrl
  } = attributes;

  // Get inner blocks (mega menus)
  const {
    innerBlocks
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => ({
    innerBlocks: select('core/block-editor').getBlocks(clientId)
  }), [clientId]);
  const {
    insertBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useDispatch)('core/block-editor');
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)({
    className: 'header-section header-block-editor'
  });

  // Array handlers for nav items
  const {
    update: updateNav,
    add: addNav,
    remove: removeNav,
    move: moveNav
  } = (0,_shared_utils__WEBPACK_IMPORTED_MODULE_7__.useArrayHandlers)(setAttributes, 'navItems');
  const handleAddNav = () => addNav(DEFAULT_NAV_ITEM);

  // Track active mega menu
  const [activeMenuId, setActiveMenuId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(null);

  // Generate menu options from inner blocks
  const megaMenuOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => innerBlocks.map(b => ({
    label: b.attributes.menuLabel || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Untitled Menu', 'ambrygen-web'),
    value: b.attributes.menuId || ''
  })).filter(o => o.value), [innerBlocks]);

  // Toggle mega menu visibility
  const handleNavClick = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useCallback)(item => {
    if (item.hasMegaMenu && item.megaMenuId) {
      setActiveMenuId(prev => prev === item.megaMenuId ? null : item.megaMenuId);
    }
  }, []);

  // Add new mega menu block
  const addMegaMenu = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useCallback)(blockName => {
    insertBlock((0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.createBlock)(blockName), innerBlocks.length, clientId);
  }, [innerBlocks.length, clientId, insertBlock]);

  // Find active block for styling
  const activeBlockClientId = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => innerBlocks.find(b => b.attributes.menuId === activeMenuId)?.clientId, [innerBlocks, activeMenuId]);
  const innerBlocksClass = (0,_shared_utils__WEBPACK_IMPORTED_MODULE_7__.cx)('header-editor__inner-blocks', activeMenuId && 'header-editor__inner-blocks--has-active header-editor__inner-blocks--filter-active');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Logo Settings', 'ambrygen-web'),
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaUploadCheck, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaUpload, {
            onSelect: media => setAttributes({
              logoUrl: media.url,
              logoId: media.id,
              logoAlt: media.alt || media.title || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Site Logo', 'ambrygen-web')
            }),
            allowedTypes: ['image'],
            value: attributes.logoId,
            render: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.ImageUploader, {
              url: logoUrl,
              onSelect: media => {
                setAttributes({
                  logoUrl: media.url,
                  logoId: media.id,
                  logoAlt: media.alt || media.title || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Site Logo', 'ambrygen-web')
                });
              },
              onRemove: () => setAttributes({
                logoUrl: '',
                logoId: 0,
                logoAlt: ''
              }),
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Logo', 'ambrygen-web')
            })
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Top Bar', 'ambrygen-web'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.Toggle, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Show Top Bar', 'ambrygen-web'),
          checked: topBarVisible,
          onChange: v => setAttributes({
            topBarVisible: v
          })
        }), topBarVisible && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.Field, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Message', 'ambrygen-web'),
            value: topBarText,
            onChange: v => setAttributes({
              topBarText: v
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CardDivider, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.Field, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Link Label', 'ambrygen-web'),
            value: topBarLinkText,
            onChange: v => setAttributes({
              topBarLinkText: v
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.Field, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Link URL', 'ambrygen-web'),
            value: topBarLinkUrl,
            onChange: v => setAttributes({
              topBarLinkUrl: v
            })
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Navigation Items', 'ambrygen-web'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
          className: "components-base-control__help",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)(`Manage navigation items. Current: ${navItems.length}`, 'ambrygen-web')
        }), navItems.map((item, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(NavItemEditor, {
          item: item,
          index: i,
          total: navItems.length,
          onUpdate: updateNav,
          onRemove: removeNav,
          onMove: moveNav,
          menuOptions: megaMenuOptions
        }, i)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
          variant: "primary",
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
          onClick: handleAddNav,
          className: "header-editor__add-nav-btn",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Add Nav Item', 'ambrygen-web')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Manage Mega Menus', 'ambrygen-web'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
          className: "description",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Add new mega menu instances to link to.', 'ambrygen-web')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "header-editor__add-menu-buttons",
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '10px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
            variant: "secondary",
            onClick: () => addMegaMenu('ambrygen/mega-menu-3-columns'),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('+ Add 3-Column Menu', 'ambrygen-web')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
            variant: "secondary",
            onClick: () => addMegaMenu('ambrygen/mega-menu-split'),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('+ Add Split View Menu', 'ambrygen-web')
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('CTA Buttons', 'ambrygen-web'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.Field, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Login Text', 'ambrygen-web'),
          value: loginText,
          onChange: v => setAttributes({
            loginText: v
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.Field, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Login URL', 'ambrygen-web'),
          value: loginUrl,
          onChange: v => setAttributes({
            loginUrl: v
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CardDivider, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.Field, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Mobile CTA Text', 'ambrygen-web'),
          value: mobileCtaText,
          onChange: v => setAttributes({
            mobileCtaText: v
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.Field, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Mobile CTA URL', 'ambrygen-web'),
          value: mobileCtaUrl,
          onChange: v => setAttributes({
            mobileCtaUrl: v
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(HeaderPreview, {
        topBarVisible: topBarVisible,
        topBarText: topBarText,
        topBarLinkText: topBarLinkText,
        navItems: navItems,
        loginText: loginText,
        activeMenu: activeMenuId,
        logoUrl: logoUrl,
        logoAlt: logoAlt,
        onNavClick: handleNavClick
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "header-editor__mega-menus",
        children: [activeMenuId && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "header-editor__active-header",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("span", {
            className: "header-editor__active-header-title",
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Editing Menu:', 'ambrygen-web'), ' ', megaMenuOptions.find(o => o.value === activeMenuId)?.label || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Unknown Menu', 'ambrygen-web')]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("button", {
            type: "button",
            className: "header-editor__active-header-close",
            onClick: () => setActiveMenuId(null),
            children: ["\u2715 ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Close', 'ambrygen-web')]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: innerBlocksClass,
          children: [activeMenuId && activeBlockClientId && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("style", {
            children: `
								.header-editor__inner-blocks--filter-active .block-editor-block-list__layout [data-block="${activeBlockClientId}"] {
									display: grid !important;
								}
							`
          }), !activeMenuId && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("p", {
            className: "header-editor__management-info",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("strong", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Manage Mega Menu Blocks:', 'ambrygen-web')
            }), ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Use the "Manage Mega Menus" panel in the sidebar to add new menus. Click a menu item above to edit its linked menu.', 'ambrygen-web')]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks, {
            allowedBlocks: ALLOWED_BLOCKS,
            template: TEMPLATE,
            renderAppender: _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.ButtonBlockAppender
          })]
        })]
      })]
    })]
  });
}

/***/ },

/***/ "./assets/src/blocks/header/editor.scss"
/*!**********************************************!*\
  !*** ./assets/src/blocks/header/editor.scss ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./assets/src/utils/assets.js"
/*!************************************!*\
  !*** ./assets/src/utils/assets.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getThemeAssetUrl: () => (/* binding */ getThemeAssetUrl)
/* harmony export */ });
const getThemeAssetUrl = (path = '') => {
  if (!path || /^https?:\/\//.test(path)) {
    return path;
  }
  if (typeof window !== 'undefined' && window.ambrygenAssets && window.ambrygenAssets.themeUrl) {
    return `${window.ambrygenAssets.themeUrl}${path}`;
  }
  if (typeof document !== 'undefined') {
    const themeScript = [...document.scripts].find(script => script.src.includes('/assets/build/'));
    if (themeScript) {
      const themeUrl = themeScript.src.split('/assets/build/')[0];
      return `${themeUrl}${path}`;
    }
  }
  return path;
};

/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/chevron-down.mjs"
/*!*****************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/chevron-down.mjs ***!
  \*****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ chevron_down_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/chevron-down.tsx


var chevron_down_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z" }) });

//# sourceMappingURL=chevron-down.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/chevron-up.mjs"
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/chevron-up.mjs ***!
  \***************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ chevron_up_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/chevron-up.tsx


var chevron_up_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M6.5 12.4L12 8l5.5 4.4-.9 1.2L12 10l-4.5 3.6-1-1.2z" }) });

//# sourceMappingURL=chevron-up.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/plus.mjs"
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/plus.mjs ***!
  \*********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ plus_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/plus.tsx


var plus_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M11 12.5V17.5H12.5V12.5H17.5V11H12.5V6H11V11H6V12.5H11Z" }) });

//# sourceMappingURL=plus.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/trash.mjs"
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/trash.mjs ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ trash_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/trash.tsx


var trash_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(
  _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path,
  {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 5.5A2.25 2.25 0 0 0 9.878 7h4.244A2.251 2.251 0 0 0 12 5.5ZM12 4a3.751 3.751 0 0 0-3.675 3H5v1.5h1.27l.818 8.997a2.75 2.75 0 0 0 2.739 2.501h4.347a2.75 2.75 0 0 0 2.738-2.5L17.73 8.5H19V7h-3.325A3.751 3.751 0 0 0 12 4Zm4.224 4.5H7.776l.806 8.861a1.25 1.25 0 0 0 1.245 1.137h4.347a1.25 1.25 0 0 0 1.245-1.137l.805-8.861Z"
  }
) });

//# sourceMappingURL=trash.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/upload.mjs"
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/upload.mjs ***!
  \***********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ upload_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/upload.tsx


var upload_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M18.5 15v3.5H13V6.7l4.5 4.1 1-1.1-6.2-5.8-5.8 5.8 1 1.1 4-4v11.7h-6V15H4v5h16v-5z" }) });

//# sourceMappingURL=upload.mjs.map


/***/ },

/***/ "@wordpress/block-editor"
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
(module) {

module.exports = window["wp"]["blockEditor"];

/***/ },

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "@wordpress/primitives"
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["primitives"];

/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

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
  !*** ./assets/src/blocks/header/index.js ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./assets/src/blocks/header/edit.js");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./editor.scss */ "./assets/src/blocks/header/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./assets/src/blocks/header/block.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, {})
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map