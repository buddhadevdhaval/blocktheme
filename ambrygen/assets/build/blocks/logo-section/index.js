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

/***/ "./assets/src/blocks/logo-section/block.json"
/*!***************************************************!*\
  !*** ./assets/src/blocks/logo-section/block.json ***!
  \***************************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"ambrygen/logo-section","title":"Logo Section","category":"ambrygen","icon":"format-image","description":"Logo usage section with downloads and guidelines.","supports":{"html":false},"attributes":{"blockId":{"type":"string","default":""},"sectionTitle":{"type":"string","default":"Logo"},"sectionTitleTag":{"type":"string","default":"h2"},"logoImageUrl":{"type":"string"},"logoImageId":{"type":"number","default":0},"logoImageAlt":{"type":"string","default":""},"downloads":{"type":"array","default":[],"items":{"type":"object","properties":{"group":{"type":"string"},"label":{"type":"string"},"fileUrl":{"type":"string"},"fileId":{"type":"number"}}}},"leftItems":{"type":"array","default":[],"items":{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"},"imageUrl":{"type":"string"},"imageId":{"type":"number"},"imageAlt":{"type":"string"},"secondaryImageUrl":{"type":"string"},"secondaryImageId":{"type":"number"},"secondaryImageAlt":{"type":"string"}}}},"rightTitle":{"type":"string","default":"Using the Logo"},"rightContent":{"type":"string","default":""},"rightSections":{"type":"array","default":[],"items":{"type":"object","properties":{"title":{"type":"string"},"content":{"type":"string"},"listItems":{"type":"array","items":{"type":"string"}}}}}},"textdomain":"ambrygen-web","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","render":"file:./render.php","example":{"attributes":{"sectionTitle":"Logo","sectionTitleTag":"h2","logoImageId":0,"downloads":[{"group":"web","label":"JPG","fileUrl":"#","fileId":0},{"group":"web","label":"PNG","fileUrl":"#","fileId":0},{"group":"print","label":"PDF","fileUrl":"#","fileId":0}],"leftItems":[{"title":"Clear Space","description":"Maintain clear space around the logo.","imageId":0},{"title":"Minimum Size","description":"Do not print smaller than the minimum width.","imageId":0}],"rightTitle":"Using the Logo","rightContent":"It is important to pay attention to clear space and size standards.","rightSections":[{"title":"Using the Logo","content":"It is important to pay attention to the clear space and minimum and maximum size standards."},{"title":"Clear Space","content":"The logo should have a minimum amount of clear space around it (see example). No content, art or other imagery should impinge on this clear space."}]}}}');

/***/ },

/***/ "./assets/src/blocks/logo-section/edit.js"
/*!************************************************!*\
  !*** ./assets/src/blocks/logo-section/edit.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shared_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_shared/components */ "./assets/src/blocks/_shared/components.js");
/* harmony import */ var _shared_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_shared/utils */ "./assets/src/blocks/_shared/utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







const DEFAULT_DOWNLOAD = {
  group: 'web',
  label: 'JPG',
  fileUrl: '',
  fileId: 0
};
const DEFAULT_LEFT_ITEM = {
  title: '',
  description: '',
  imageUrl: '',
  imageId: 0,
  imageAlt: '',
  secondaryImageUrl: '',
  secondaryImageId: 0,
  secondaryImageAlt: ''
};
const DEFAULT_RIGHT_SECTION = {
  title: '',
  content: '',
  listItems: []
};
function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    blockId,
    sectionTitle,
    sectionTitleTag,
    logoImageUrl,
    logoImageAlt,
    downloads = [],
    leftItems = [],
    rightTitle,
    rightContent,
    rightSections = []
  } = attributes;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    const expectedId = `section-${clientId.slice(0, 8)}`;
    if (!blockId || !blockId.endsWith(clientId.slice(0, 8))) {
      setAttributes({
        blockId: expectedId
      });
    }
  }, [clientId, blockId, setAttributes]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: 'logo-section'
  });
  const defaultImages = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => (0,_shared_components__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_IMAGES)(), []);
  const displayLogo = logoImageUrl || defaultImages.placeholder.url;
  const {
    update: updateDownload,
    add: addDownload,
    remove: removeDownload,
    move: moveDownload
  } = (0,_shared_utils__WEBPACK_IMPORTED_MODULE_5__.useArrayHandlers)(setAttributes, 'downloads');
  const {
    update: updateLeftItem,
    add: addLeftItem,
    remove: removeLeftItem,
    move: moveLeftItem
  } = (0,_shared_utils__WEBPACK_IMPORTED_MODULE_5__.useArrayHandlers)(setAttributes, 'leftItems');
  const {
    update: updateRightSection,
    add: addRightSection,
    remove: removeRightSection,
    move: moveRightSection
  } = (0,_shared_utils__WEBPACK_IMPORTED_MODULE_5__.useArrayHandlers)(setAttributes, 'rightSections');
  const updateDownloadMedia = (index, media) => {
    setAttributes(prev => {
      const nextDownloads = [...(prev.downloads || [])];
      nextDownloads[index] = {
        ...nextDownloads[index],
        fileUrl: media?.url || '',
        fileId: media?.id || 0
      };
      return {
        downloads: nextDownloads
      };
    });
  };
  const clearDownloadMedia = index => {
    setAttributes(prev => {
      const nextDownloads = [...(prev.downloads || [])];
      nextDownloads[index] = {
        ...nextDownloads[index],
        fileUrl: '',
        fileId: 0
      };
      return {
        downloads: nextDownloads
      };
    });
  };
  const updateLeftImage = (index, media) => {
    setAttributes(prev => {
      const nextItems = [...(prev.leftItems || [])];
      nextItems[index] = {
        ...nextItems[index],
        imageUrl: media?.url || '',
        imageId: media?.id || 0,
        imageAlt: media?.alt || ''
      };
      return {
        leftItems: nextItems
      };
    });
  };
  const updateLeftSecondaryImage = (index, media) => {
    setAttributes(prev => {
      const nextItems = [...(prev.leftItems || [])];
      nextItems[index] = {
        ...nextItems[index],
        secondaryImageUrl: media?.url || '',
        secondaryImageId: media?.id || 0,
        secondaryImageAlt: media?.alt || ''
      };
      return {
        leftItems: nextItems
      };
    });
  };
  const updateRightListItem = (sectionIndex, itemIndex, value) => {
    setAttributes(prev => {
      const nextSections = [...(prev.rightSections || [])];
      const nextSection = {
        ...(nextSections[sectionIndex] || {})
      };
      const nextItems = [...(nextSection.listItems || [])];
      nextItems[itemIndex] = value;
      nextSection.listItems = nextItems;
      nextSections[sectionIndex] = nextSection;
      return {
        rightSections: nextSections
      };
    });
  };
  const addRightListItem = sectionIndex => {
    setAttributes(prev => {
      const nextSections = [...(prev.rightSections || [])];
      const nextSection = {
        ...(nextSections[sectionIndex] || {})
      };
      const nextItems = [...(nextSection.listItems || []), ''];
      nextSection.listItems = nextItems;
      nextSections[sectionIndex] = nextSection;
      return {
        rightSections: nextSections
      };
    });
  };
  const removeRightListItem = (sectionIndex, itemIndex) => {
    setAttributes(prev => {
      const nextSections = [...(prev.rightSections || [])];
      const nextSection = {
        ...(nextSections[sectionIndex] || {})
      };
      const nextItems = [...(nextSection.listItems || [])];
      nextItems.splice(itemIndex, 1);
      nextSection.listItems = nextItems;
      nextSections[sectionIndex] = nextSection;
      return {
        rightSections: nextSections
      };
    });
  };
  const moveRightListItem = (sectionIndex, itemIndex, direction) => {
    setAttributes(prev => {
      const nextSections = [...(prev.rightSections || [])];
      const nextSection = {
        ...(nextSections[sectionIndex] || {})
      };
      const nextItems = [...(nextSection.listItems || [])];
      const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
      if (targetIndex < 0 || targetIndex >= nextItems.length || itemIndex < 0 || itemIndex >= nextItems.length) {
        return {
          rightSections: nextSections
        };
      }
      const temp = nextItems[itemIndex];
      nextItems[itemIndex] = nextItems[targetIndex];
      nextItems[targetIndex] = temp;
      nextSection.listItems = nextItems;
      nextSections[sectionIndex] = nextSection;
      return {
        rightSections: nextSections
      };
    });
  };
  const webDownloads = downloads.filter(item => item.group === 'web');
  const printDownloads = downloads.filter(item => item.group === 'print');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Heading Settings', 'ambrygen-web'),
        initialOpen: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.TagSelector, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Heading Tag', 'ambrygen-web'),
          type: "heading",
          value: sectionTitleTag || 'h2',
          onChange: value => setAttributes({
            sectionTitleTag: value
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Logo Settings', 'ambrygen-web'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.Field, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Section Title', 'ambrygen-web'),
          value: sectionTitle,
          onChange: value => setAttributes({
            sectionTitle: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.ImageUploader, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Logo Image', 'ambrygen-web'),
          url: logoImageUrl,
          onSelect: media => setAttributes({
            logoImageUrl: media.url,
            logoImageId: media.id,
            logoImageAlt: media.alt || ''
          }),
          onRemove: () => setAttributes({
            logoImageUrl: '',
            logoImageId: 0,
            logoImageAlt: ''
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Download Files', 'ambrygen-web'),
        initialOpen: false,
        children: [downloads.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          className: "components-base-control__help",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No downloads added yet.', 'ambrygen-web')
        }), downloads.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.PanelItem, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.ItemHeader, {
            index: index,
            label: item.label || item.fileUrl,
            total: downloads.length,
            onMove: (i, dir) => moveDownload(i, dir),
            onRemove: i => removeDownload(i, 0),
            minCount: 0
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Group', 'ambrygen-web'),
            value: item.group || 'web',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('For Web', 'ambrygen-web'),
              value: 'web'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('For Print', 'ambrygen-web'),
              value: 'print'
            }],
            onChange: value => updateDownload(index, 'group', value)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Label', 'ambrygen-web'),
            value: item.label || 'JPG',
            options: [{
              label: 'JPG',
              value: 'JPG'
            }, {
              label: 'PNG',
              value: 'PNG'
            }, {
              label: 'PDF',
              value: 'PDF'
            }, {
              label: 'SVG',
              value: 'SVG'
            }],
            onChange: value => updateDownload(index, 'label', value)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            style: {
              marginBottom: '8px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
                allowedTypes: ['application', 'text', 'image'],
                onSelect: media => updateDownloadMedia(index, media),
                render: ({
                  open
                }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                  variant: "secondary",
                  onClick: e => {
                    e.stopPropagation();
                    open();
                  },
                  children: item.fileUrl ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Replace File', 'ambrygen-web') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select File', 'ambrygen-web')
                })
              })
            }), item.fileUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              variant: "secondary",
              isDestructive: true,
              onClick: e => {
                e.stopPropagation();
                clearDownloadMedia(index);
              },
              style: {
                marginLeft: '8px'
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove File', 'ambrygen-web')
            })]
          })]
        }, index)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "primary",
          onClick: () => addDownload(DEFAULT_DOWNLOAD),
          style: {
            width: '100%',
            justifyContent: 'center'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Download', 'ambrygen-web')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Guideline Items', 'ambrygen-web'),
        initialOpen: false,
        children: [leftItems.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          className: "components-base-control__help",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No guideline items added yet.', 'ambrygen-web')
        }), leftItems.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.PanelItem, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.ItemHeader, {
            index: index,
            label: item.title,
            total: leftItems.length,
            onMove: (i, dir) => moveLeftItem(i, dir),
            onRemove: i => removeLeftItem(i, 0),
            minCount: 0
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.Field, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title', 'ambrygen-web'),
            value: item.title || '',
            onChange: value => updateLeftItem(index, 'title', value),
            onClick: e => e.stopPropagation()
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.Field, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Description', 'ambrygen-web'),
            value: item.description || '',
            onChange: value => updateLeftItem(index, 'description', value),
            onClick: e => e.stopPropagation()
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.ImageUploader, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Primary Image', 'ambrygen-web'),
            url: item.imageUrl,
            onSelect: media => updateLeftImage(index, media),
            onRemove: () => updateLeftImage(index, null)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.ImageUploader, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Secondary Image (optional)', 'ambrygen-web'),
            url: item.secondaryImageUrl,
            onSelect: media => updateLeftSecondaryImage(index, media),
            onRemove: () => updateLeftSecondaryImage(index, null)
          })]
        }, index)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "primary",
          onClick: () => addLeftItem(DEFAULT_LEFT_ITEM),
          style: {
            width: '100%',
            justifyContent: 'center'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Guideline', 'ambrygen-web')
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "logo-section__header",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
          tagName: sectionTitleTag || 'h2',
          className: "logo-section__title heading-3 mb-0",
          value: sectionTitle,
          onChange: value => setAttributes({
            sectionTitle: value
          }),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Logo', 'ambrygen-web')
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "is-style-gl-s50",
        "aria-hidden": "true"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "logo-section__top",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "logo-section__logo",
          children: displayLogo ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
            src: displayLogo,
            alt: logoImageAlt
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.ImagePlaceholder, {
            text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No logo set', 'ambrygen-web')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "logo-section__downloads",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            className: "logo-section__downloads-group",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
              className: "logo-section__downloads-title subtitle2-sbold",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('For Web', 'ambrygen-web')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "logo-section__downloads-list",
              children: [webDownloads.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                className: "logo-section__downloads-item with-icon",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No files', 'ambrygen-web')
              }), webDownloads.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                className: "logo-section__downloads-item",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                  className: "logo-section__downloads-link",
                  children: item.label || 'JPG'
                })
              }, `${index}-web`))]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            className: "logo-section__downloads-group",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
              className: "logo-section__downloads-title subtitle2-sbold",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('For Print', 'ambrygen-web')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "logo-section__downloads-list",
              children: [printDownloads.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                className: "logo-section__downloads-item with-icon",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No files', 'ambrygen-web')
              }), printDownloads.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                className: "logo-section__downloads-item",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                  className: "logo-section__downloads-link",
                  children: item.label || 'PDF'
                })
              }, `${index}-print`))]
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "logo-section__divider",
        "aria-hidden": "true"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "logo-section__bottom",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "logo-section__left",
          children: [leftItems.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
            className: "logo-section__empty",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add guideline items from the sidebar.', 'ambrygen-web')
          }), leftItems.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            className: "logo-section__guideline-item",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
              tagName: "h4",
              className: "logo-section__guideline-title heading-6 mb-0",
              value: item.title,
              onChange: value => updateLeftItem(index, 'title', value),
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Guideline Title', 'ambrygen-web')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "logo-section__guideline-images",
              children: [item.imageUrl ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
                src: item.imageUrl,
                alt: item.imageAlt || ''
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.ImagePlaceholder, {}), item.secondaryImageUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
                src: item.secondaryImageUrl,
                alt: item.secondaryImageAlt || ''
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
              tagName: "p",
              className: "logo-section__guideline-description",
              value: item.description,
              onChange: value => updateLeftItem(index, 'description', value),
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Guideline description', 'ambrygen-web')
            })]
          }, index))]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "logo-section__right",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            className: "logo-section__right-content",
            children: [rightSections.length > 0 ? rightSections.map((section, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              className: "logo-section__right-content__section subtitle2",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.ItemHeader, {
                index: index,
                label: section.title,
                total: rightSections.length,
                onMove: (i, dir) => moveRightSection(i, dir),
                onRemove: i => removeRightSection(i, 0),
                minCount: 0
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.PlainText, {
                className: "logo-section__right-content__section-title subtitle2-sbold",
                value: section.title,
                onChange: value => updateRightSection(index, 'title', value),
                placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Section Title', 'ambrygen-web')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
                tagName: "div",
                value: section.content,
                onChange: value => updateRightSection(index, 'content', value),
                placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Section content', 'ambrygen-web')
              }), (section.listItems || []).length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("ul", {
                className: "logo-section__right-content__section-list",
                children: (section.listItems || []).map((listItem, itemIndex) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("li", {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.Field, {
                    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('List item', 'ambrygen-web'),
                    value: listItem,
                    onChange: value => updateRightListItem(index, itemIndex, value)
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_4__.ItemHeader, {
                    index: itemIndex,
                    label: listItem,
                    total: section.listItems.length,
                    onMove: (i, dir) => moveRightListItem(index, i, dir),
                    onRemove: i => removeRightListItem(index, i),
                    minCount: 0
                  })]
                }, itemIndex))
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                variant: "secondary",
                onClick: () => addRightListItem(index),
                style: {
                  marginTop: '8px'
                },
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add List Item', 'ambrygen-web')
              })]
            }, index)) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
                tagName: "h3",
                className: "logo-section__right-title heading-6 mb-0",
                value: rightTitle,
                onChange: value => setAttributes({
                  rightTitle: value
                }),
                placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Using the Logo', 'ambrygen-web')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
                tagName: "div",
                className: "logo-section__right-content",
                value: rightContent,
                onChange: value => setAttributes({
                  rightContent: value
                }),
                placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Right content', 'ambrygen-web')
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              variant: "primary",
              onClick: () => addRightSection(DEFAULT_RIGHT_SECTION),
              style: {
                width: '100%',
                justifyContent: 'center',
                marginTop: '16px'
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Information', 'ambrygen-web')
            })]
          })
        })]
      })]
    })]
  });
}

/***/ },

/***/ "./assets/src/blocks/logo-section/editor.scss"
/*!****************************************************!*\
  !*** ./assets/src/blocks/logo-section/editor.scss ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./assets/src/blocks/logo-section/index.js"
/*!*************************************************!*\
  !*** ./assets/src/blocks/logo-section/index.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./assets/src/blocks/logo-section/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor.scss */ "./assets/src/blocks/logo-section/editor.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./assets/src/blocks/logo-section/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./assets/src/blocks/logo-section/block.json");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */



/**
 * Internal dependencies
 */



/**
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  /**
   * @see ./save.js
   */
  save: () => null
});

/***/ },

/***/ "./assets/src/blocks/logo-section/style.scss"
/*!***************************************************!*\
  !*** ./assets/src/blocks/logo-section/style.scss ***!
  \***************************************************/
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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"logo-section/index": 0,
/******/ 			"logo-section/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
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
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkambrygen"] = globalThis["webpackChunkambrygen"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["logo-section/style-index"], () => (__webpack_require__("./assets/src/blocks/logo-section/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map