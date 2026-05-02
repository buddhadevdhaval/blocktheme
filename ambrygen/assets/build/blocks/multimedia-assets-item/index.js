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

/***/ "./assets/src/blocks/multimedia-assets-item/block.json"
/*!*************************************************************!*\
  !*** ./assets/src/blocks/multimedia-assets-item/block.json ***!
  \*************************************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"ambrygen/multimedia-assets-item","title":"Multimedia Asset","category":"ambrygen","parent":["ambrygen/multimedia-assets"],"icon":"format-image","description":"Single multimedia card.","supports":{"html":false,"reusable":false,"anchor":true},"attributes":{"sectiontitle":{"type":"string"},"imageUrl":{"type":"string"},"imageAlt":{"type":"string"},"imageId":{"type":"number"},"videoTitle":{"type":"string","default":""},"videoContent":{"type":"string","default":""},"formTitle":{"type":"string","default":""},"formContent":{"type":"string","default":""},"cta":{"type":"object","default":{"url":"","text":"","target":"","rel":"","variant":"dark","isPopup":false,"popupType":"video","videoType":"embed","iframeUrl":"","videoUrl":""}},"files":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"fileId":{"type":"number"},"fileUrl":{"type":"string"},"fileName":{"type":"string"},"sizeType":{"type":"string"}}},"default":[]}},"textdomain":"ambrygen-web","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js","render":"file:./render.php"}');

/***/ },

/***/ "./assets/src/blocks/multimedia-assets-item/edit.js"
/*!**********************************************************!*\
  !*** ./assets/src/blocks/multimedia-assets-item/edit.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _shared_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_shared/components */ "./assets/src/blocks/_shared/components.js");
/* harmony import */ var _shared_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_shared/utils */ "./assets/src/blocks/_shared/utils.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _images_play_icon_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../images/play-icon.svg */ "./assets/src/images/play-icon.svg");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);







// Use same icon as ordering options if possible or standard play icon


const createFileId = () => `file-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const DEFAULT_FILE = {
  id: '',
  fileId: 0,
  fileUrl: '',
  fileName: '',
  sizeType: 'small'
};
function Edit({
  attributes,
  setAttributes
}) {
  const {
    sectiontitle,
    imageId,
    imageUrl,
    imageAlt,
    cta = {},
    files,
    videoTitle,
    videoContent,
    formTitle,
    formContent
  } = attributes;
  const defaults = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => (0,_shared_components__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_IMAGES)(), []);
  const normalizedFiles = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => (files || []).map(file => ({
    ...file,
    id: file?.id || createFileId()
  })), [files]);
  const validFiles = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => normalizedFiles.filter(file => file?.fileUrl && file.fileUrl.trim()), [normalizedFiles]);
  const defaultImage = defaults?.placeholder?.url || '';
  const defaultImageId = defaults?.placeholder?.id || 0;
  const isDefaultImage = imageUrl === defaultImage && imageId === defaultImageId;
  const displayImage = imageUrl || defaultImage;
  const displayImageAlt = imageUrl ? imageAlt || '' : '';
  const hasTextContent = sectiontitle || validFiles.length > 0;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    if (normalizedFiles.length > 0 && normalizedFiles.some((file, index) => file.id !== files?.[index]?.id)) {
      setAttributes({
        files: normalizedFiles
      });
    }
  }, [files, normalizedFiles, setAttributes]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)({
    className: 'approach-card'
  });
  const {
    update,
    add,
    remove,
    move
  } = (0,_shared_utils__WEBPACK_IMPORTED_MODULE_3__.useArrayHandlers)(setAttributes, 'files');
  const updateFileMedia = (index, media) => {
    setAttributes(prev => {
      const nextFiles = [...(prev.files || [])];
      nextFiles[index] = {
        ...nextFiles[index],
        fileUrl: media?.url || '',
        fileId: media?.id || 0,
        fileName: media?.title || media?.filename || nextFiles[index]?.fileName || ''
      };
      return {
        files: nextFiles
      };
    });
  };
  const clearFileMedia = index => {
    setAttributes(prev => {
      const nextFiles = [...(prev.files || [])];
      nextFiles[index] = {
        ...nextFiles[index],
        fileUrl: '',
        fileId: 0
      };
      return {
        files: nextFiles
      };
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Card Settings', 'ambrygen-web'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_2__.ImageUploader, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Card Image', 'ambrygen-web'),
          url: isDefaultImage ? '' : imageUrl,
          onSelect: media => setAttributes({
            imageUrl: media.url,
            imageId: media.id,
            imageAlt: media.alt || ''
          }),
          onRemove: () => setAttributes({
            imageUrl: '',
            imageId: 0,
            imageAlt: ''
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "is-style-gl-s16",
          style: {
            height: '16px'
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.BaseControl, {
          className: "ordering-options-editor__cta-control",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Enable Popup?', 'ambrygen-web'),
            checked: !!cta.isPopup,
            onChange: value => setAttributes({
              cta: {
                ...cta,
                isPopup: value
              }
            })
          }), !!cta.isPopup && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Popup Type', 'ambrygen-web'),
            value: cta.popupType || 'video',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Video', 'ambrygen-web'),
              value: 'video'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Form', 'ambrygen-web'),
              value: 'form'
            }],
            onChange: value => setAttributes({
              cta: {
                ...cta,
                popupType: value
              }
            })
          }), !cta.isPopup && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_2__.CtaButtonField, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('CTA Link Settings', 'ambrygen-web'),
            value: cta,
            showVariant: true,
            onChange: value => setAttributes({
              cta: value
            })
          }), !!cta.isPopup && cta.popupType === 'video' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            style: {
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #ccc'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
              style: {
                marginBottom: '8px',
                fontWeight: '500'
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Video Settings', 'ambrygen-web')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Button Text', 'ambrygen-web'),
              value: cta.text || '',
              onChange: value => setAttributes({
                cta: {
                  ...cta,
                  text: value
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Video Type', 'ambrygen-web'),
              value: cta.videoType || 'embed',
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Embed (Youtube/Vimeo)', 'ambrygen-web'),
                value: 'embed'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('MP4 File', 'ambrygen-web'),
                value: 'mp4'
              }],
              onChange: value => setAttributes({
                cta: {
                  ...cta,
                  videoType: value
                }
              })
            }), cta.videoType === 'mp4' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
              style: {
                marginBottom: '16px'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaUploadCheck, {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaUpload, {
                  onSelect: media => setAttributes({
                    cta: {
                      ...cta,
                      videoUrl: media.url || ''
                    }
                  }),
                  allowedTypes: ['video'],
                  value: cta.videoUrl,
                  render: ({
                    open
                  }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                    variant: "secondary",
                    onClick: open,
                    style: {
                      width: '100%',
                      justifyContent: 'center',
                      marginBottom: '8px'
                    },
                    children: cta.videoUrl ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Replace Video', 'ambrygen-web') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Select / Upload Video', 'ambrygen-web')
                  })
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('MP4 Video URL', 'ambrygen-web'),
                value: cta.videoUrl || '',
                onChange: value => setAttributes({
                  cta: {
                    ...cta,
                    videoUrl: value
                  }
                })
              })]
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Embed URL', 'ambrygen-web'),
              value: cta.iframeUrl || '',
              onChange: value => setAttributes({
                cta: {
                  ...cta,
                  iframeUrl: value
                }
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Paste YouTube/Vimeo or iframe embed URL.', 'ambrygen-web')
            })]
          }), !!cta.isPopup && cta.popupType === 'form' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            style: {
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #ccc'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
              style: {
                marginBottom: '8px',
                fontWeight: '500'
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Form Settings', 'ambrygen-web')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Button Text', 'ambrygen-web'),
              value: cta.text || '',
              onChange: value => setAttributes({
                cta: {
                  ...cta,
                  text: value
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Form Title', 'ambrygen-web'),
              value: formTitle || '',
              onChange: value => setAttributes({
                formTitle: value
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText, {
              tagName: "div",
              value: formContent || '',
              onChange: value => setAttributes({
                formContent: value
              }),
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Form Content…', 'ambrygen-web'),
              className: "form-content-editor"
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('File Downloads', 'ambrygen-web'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          className: "components-base-control__help",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add files to show a download link with size type.', 'ambrygen-web')
        }), (files || []).length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          className: "components-base-control__help",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('No files added yet.', 'ambrygen-web')
        }), normalizedFiles.map((fileItem, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_shared_components__WEBPACK_IMPORTED_MODULE_2__.PanelItem, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_2__.ItemHeader, {
            index: index,
            label: fileItem.fileName || fileItem.fileUrl,
            total: (files || []).length,
            onMove: (i, dir) => move(i, dir),
            onRemove: i => remove(i, 0),
            minCount: 0
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            style: {
              marginBottom: '8px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaUploadCheck, {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaUpload, {
                allowedTypes: ['application', 'text', 'audio', 'video'],
                onSelect: media => updateFileMedia(index, media),
                render: ({
                  open
                }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                  variant: "secondary",
                  onClick: e => {
                    e.stopPropagation();
                    open();
                  },
                  children: fileItem.fileUrl ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Replace File', 'ambrygen-web') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Select File', 'ambrygen-web')
                })
              })
            }), fileItem.fileUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
              variant: "secondary",
              isDestructive: true,
              onClick: e => {
                e.stopPropagation();
                clearFileMedia(index);
              },
              style: {
                marginLeft: '8px'
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Remove File', 'ambrygen-web')
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_2__.Field, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('File Name (optional)', 'ambrygen-web'),
            value: fileItem.fileName || '',
            onChange: value => update(index, 'fileName', value),
            onClick: e => e.stopPropagation()
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('File Size Type', 'ambrygen-web'),
            value: fileItem.sizeType || 'small',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Small', 'ambrygen-web'),
              value: 'small'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Large', 'ambrygen-web'),
              value: 'large'
            }],
            onChange: value => update(index, 'sizeType', value)
          })]
        }, fileItem.id)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          variant: "primary",
          onClick: () => add({
            ...DEFAULT_FILE,
            id: createFileId()
          }),
          style: {
            width: '100%',
            justifyContent: 'center'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add File', 'ambrygen-web')
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "approach-card__inner",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "approach-card__image-wrapper",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
            className: "approach-card__image",
            children: displayImage ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("img", {
              src: displayImage,
              alt: displayImageAlt
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_2__.ImagePlaceholder, {
              text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('No image set', 'ambrygen-web')
            })
          }), hasTextContent && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
            className: "is-style-gl-s24",
            "aria-hidden": "true"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: "approach-card__text-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText, {
              tagName: "h3",
              className: "approach-card__title heading-5 mb-0",
              value: sectiontitle,
              onChange: value => setAttributes({
                sectiontitle: value
              }),
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add Title…', 'ambrygen-web'),
              allowedFormats: ['core/text-color']
            }), validFiles.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
              className: "approach-card__files mt-2",
              children: validFiles.map(file => {
                const extension = file?.fileUrl?.split('.').pop()?.toUpperCase();
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                  className: "approach-card__file",
                  children: extension && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
                    className: "file-type",
                    children: ["(", extension, ")"]
                  })
                }, file.id);
              })
            })]
          })]
        }), cta?.text && hasTextContent && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "is-style-gl-s32",
          "aria-hidden": "true"
        }), cta?.text && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "approach-card__cta-wrapper",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
            className: `approach-card__cta ${cta.variant || 'dark'} ${cta.isVideo ? 'site-btn has-right-arrow' : ''}`,
            role: "presentation",
            children: cta.text
          })
        }), !!cta.isPopup && cta.popupType === 'video' && (cta.videoUrl || cta.iframeUrl) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "ordering-options__video-preview-backend",
          style: {
            marginTop: '20px',
            borderTop: '1px dashed #ccc',
            paddingTop: '15px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
            style: {
              fontSize: '12px',
              color: '#666',
              marginBottom: '8px'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Video Popup Preview', 'ambrygen-web')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText, {
            tagName: "div",
            className: "heading-6 mb-2",
            value: videoTitle,
            onChange: value => setAttributes({
              videoTitle: value
            }),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Video Title (Popup)', 'ambrygen-web')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText, {
            tagName: "div",
            className: "body2-reg mb-3",
            value: videoContent,
            onChange: value => setAttributes({
              videoContent: value
            }),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Video Content (Popup)', 'ambrygen-web')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
            className: "has-video-arrow js-gsap-fade",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
              className: cta.videoType === 'mp4' ? 'features-media__video-wrapper' : 'features-media__video-wrapper--iframe',
              style: {
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%',
                background: '#000'
              },
              children: [cta.videoType === 'mp4' && cta.videoUrl ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("video", {
                src: cta.videoUrl,
                style: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                },
                autoPlay: true,
                loop: true,
                muted: true,
                playsInline: true
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("iframe", {
                src: cta.iframeUrl || '',
                title: "Video player",
                style: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                },
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
                className: "features-media__iframe"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                className: "play-icon-video",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                  className: "play-icon circle-icon",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("img", {
                    src: _images_play_icon_svg__WEBPACK_IMPORTED_MODULE_6__["default"],
                    className: "play-icon__img",
                    alt: "Play Icon"
                  })
                })
              })]
            })
          })]
        }), !!cta.isPopup && cta.popupType === 'form' && (formTitle || formContent) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "ordering-options__form-preview-backend",
          style: {
            marginTop: '20px',
            borderTop: '1px dashed #ccc',
            paddingTop: '15px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
            style: {
              fontSize: '12px',
              color: '#666',
              marginBottom: '8px'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Form Popup Preview', 'ambrygen-web')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
            className: "heading-6 mb-2",
            children: formTitle
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
            className: "body2-reg mb-3",
            dangerouslySetInnerHTML: {
              __html: formContent
            }
          })]
        })]
      })
    })]
  });
}

/***/ },

/***/ "./assets/src/blocks/multimedia-assets-item/editor.scss"
/*!**************************************************************!*\
  !*** ./assets/src/blocks/multimedia-assets-item/editor.scss ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./assets/src/blocks/multimedia-assets-item/index.js"
/*!***********************************************************!*\
  !*** ./assets/src/blocks/multimedia-assets-item/index.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./assets/src/blocks/multimedia-assets-item/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor.scss */ "./assets/src/blocks/multimedia-assets-item/editor.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./assets/src/blocks/multimedia-assets-item/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./assets/src/blocks/multimedia-assets-item/block.json");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */




/**
 * Internal dependencies
 */



/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_4__,
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

/***/ "./assets/src/blocks/multimedia-assets-item/style.scss"
/*!*************************************************************!*\
  !*** ./assets/src/blocks/multimedia-assets-item/style.scss ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./assets/src/images/play-icon.svg"
/*!*****************************************!*\
  !*** ./assets/src/images/play-icon.svg ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactComponent: () => (/* binding */ SvgPlayIcon),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _path;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

var SvgPlayIcon = function SvgPlayIcon(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: 22,
    height: 22,
    fill: "none"
  }, props), _path || (_path = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("path", {
    fill: "#061835",
    d: "M20.34 10.04 2.74.14a1.102 1.102 0 0 0-1.638.96v19.8a1.1 1.1 0 0 0 1.639.96l17.6-9.9a1.103 1.103 0 0 0 0-1.918"
  })));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxnIGlkPSJwbGF5IDEiPg0KPHBhdGggaWQ9IlZlY3RvciIgZD0iTTIwLjM0MDUgMTAuMDQwOEwyLjc0MDU2IDAuMTQwODQyQzIuMzk5NTYgLTAuMDUwNTU3NyAxLjk4Mzc2IC0wLjA0NjE1NzcgMS42NDcxNiAwLjE0OTY0MkMxLjMwODM2IDAuMzQ3NjQxIDEuMTAxNTYgMC43MDg0NCAxLjEwMTU2IDEuMTAwMDRWMjAuOUMxLjEwMTU2IDIxLjI5MTYgMS4zMDgzNiAyMS42NTI0IDEuNjQ3MTYgMjEuODUwNEMxLjgxODc2IDIxLjk0OTQgMi4wMTAxNiAyMiAyLjIwMTU2IDIyQzIuMzg2MzYgMjIgMi41NzMzNiAyMS45NTM4IDIuNzQwNTYgMjEuODU5MkwyMC4zNDA1IDExLjk1OTJDMjAuNjg1OSAxMS43NjM0IDIwLjkwMTUgMTEuMzk4MiAyMC45MDE1IDExQzIwLjkwMTUgMTAuNjAxOCAyMC42ODU5IDEwLjIzNjYgMjAuMzQwNSAxMC4wNDA4WiIgZmlsbD0iIzA2MTgzNSIvPg0KPC9nPg0KPC9zdmc+DQo=");

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

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

module.exports = window["React"];

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
/******/ 			"multimedia-assets-item/index": 0,
/******/ 			"multimedia-assets-item/style-index": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["multimedia-assets-item/style-index"], () => (__webpack_require__("./assets/src/blocks/multimedia-assets-item/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map