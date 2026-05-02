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

/***/ "./assets/src/blocks/tab-menu/block.json"
/*!***********************************************!*\
  !*** ./assets/src/blocks/tab-menu/block.json ***!
  \***********************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"ambrygen/tab-menu","title":"Tab Menu","category":"ambrygen","icon":"index-card","description":"Independent tab menu with scroll targets.","supports":{"html":false},"attributes":{"blockId":{"type":"string"},"tabBehavior":{"type":"string","default":"scroll"},"tabs":{"type":"array","default":[],"items":{"type":"object","properties":{"label":{"type":"string"},"targetId":{"type":"string"},"targetClientId":{"type":"string"},"isActive":{"type":"boolean"}}}}},"editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js","render":"file:./render.php","textdomain":"ambrygen-web","example":{"attributes":{"tabBehavior":"scroll","tabs":[{"label":"About Ambry","targetId":"section-about","isActive":true},{"label":"Multimedia Assets","targetId":"section-assets","isActive":false}]}}}');

/***/ },

/***/ "./assets/src/blocks/tab-menu/edit.js"
/*!********************************************!*\
  !*** ./assets/src/blocks/tab-menu/edit.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shared_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_shared/components */ "./assets/src/blocks/_shared/components.js");
/* harmony import */ var _shared_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../_shared/utils */ "./assets/src/blocks/_shared/utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








const DEFAULT_TAB = {
  label: '',
  targetId: '',
  targetClientId: '',
  isActive: false
};
function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    blockId,
    tabs = [],
    tabBehavior = 'scroll'
  } = attributes;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const expectedId = `tab-menu-${clientId.slice(0, 8)}`;
    if (blockId !== expectedId) {
      setAttributes({
        blockId: expectedId
      });
    }
  }, [clientId, blockId, setAttributes]);
  const targetOptions = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const {
      getBlocks
    } = select('core/block-editor');
    const getAllBlocks = blocks => blocks.reduce((acc, block) => {
      acc.push(block);
      if (block.innerBlocks?.length) {
        acc.push(...getAllBlocks(block.innerBlocks));
      }
      return acc;
    }, []);
    const allBlocks = getAllBlocks(getBlocks());
    return [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Select Section', 'ambrygen-web'),
      value: ''
    }, ...allBlocks.map(block => ({
      ...block,
      targetId: block.attributes?.blockId || block.attributes?.anchor || ''
    })).filter(block => block.targetId).map(block => {
      const blockType = wp.blocks.getBlockType(block.name);
      const blockTitle = blockType?.title || block.name;
      const stripHTML = str => str ? str.replace(/<[^>]+>/g, '') : '';
      const heading = stripHTML(block.attributes?.heading) || stripHTML(block.attributes?.title) || stripHTML(block.attributes?.sectionTitle) || stripHTML(block.attributes?.sectiontitle) || null;
      return {
        label: heading ? `${blockTitle} - ${heading}` : `${blockTitle} - ${block.targetId}`,
        value: block.targetId,
        clientId: block.clientId
      };
    })];
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!tabs.length || !targetOptions.length) {
      return;
    }
    const targetIdByClientId = new Map(targetOptions.filter(option => option.clientId && option.value && option.value !== '').map(option => [option.clientId, option.value]));
    const optionsByValue = new Map();
    targetOptions.forEach(option => {
      if (!option.value) {
        return;
      }
      if (!optionsByValue.has(option.value)) {
        optionsByValue.set(option.value, []);
      }
      optionsByValue.get(option.value).push(option);
    });
    let hasChanges = false;
    const nextTabs = tabs.map(tab => {
      let nextTab = tab;
      if (tab.targetClientId) {
        const resolvedTargetId = targetIdByClientId.get(tab.targetClientId);
        if (resolvedTargetId && resolvedTargetId !== tab.targetId) {
          nextTab = {
            ...nextTab,
            targetId: resolvedTargetId
          };
          hasChanges = true;
        }
      } else if (tab.targetId) {
        const matchingOptions = optionsByValue.get(tab.targetId) || [];
        if (matchingOptions.length === 1) {
          nextTab = {
            ...nextTab,
            targetClientId: matchingOptions[0].clientId || ''
          };
          hasChanges = true;
        }
      }
      return nextTab;
    });
    if (hasChanges) {
      setAttributes({
        tabs: nextTabs
      });
    }
  }, [tabs, targetOptions, setAttributes]);
  const {
    update: updateTab,
    add: addTab,
    remove: removeTab,
    move: moveTab
  } = (0,_shared_utils__WEBPACK_IMPORTED_MODULE_6__.useArrayHandlers)(setAttributes, 'tabs');
  const setActiveTab = index => {
    const nextTabs = tabs.map((tab, i) => ({
      ...tab,
      isActive: i === index
    }));
    setAttributes({
      tabs: nextTabs
    });
  };
  const handleAddTab = () => {
    const shouldBeActive = tabs.length === 0;
    addTab({
      ...DEFAULT_TAB,
      isActive: shouldBeActive
    });
  };
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: 'secondary-sticky-tabs'
  });
  const activeIndex = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => tabs.findIndex(tab => tab.isActive), [tabs]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Tab Settings', 'ambrygen-web'),
        initialOpen: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Tab Mode', 'ambrygen-web'),
          checked: tabBehavior === 'tab-mode',
          onChange: value => setAttributes({
            tabBehavior: value ? 'tab-mode' : 'scroll'
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Tabs', 'ambrygen-web'),
        initialOpen: false,
        children: [tabs.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          className: "components-base-control__help",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('No tabs added yet.', 'ambrygen-web')
        }), tabs.map((tab, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_shared_components__WEBPACK_IMPORTED_MODULE_5__.PanelItem, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_5__.ItemHeader, {
            index: index,
            label: tab.label,
            total: tabs.length,
            onMove: (i, dir) => moveTab(i, dir),
            onRemove: i => removeTab(i, 0),
            minCount: 0
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_5__.Field, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Tab Label', 'ambrygen-web'),
            value: tab.label || '',
            onChange: value => updateTab(index, 'label', value)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Link to Section', 'ambrygen-web'),
            value: tab.targetId || '',
            options: targetOptions,
            onChange: value => {
              const selectedOption = targetOptions.find(option => option.value === value);
              setAttributes({
                tabs: tabs.map((currentTab, currentIndex) => currentIndex === index ? {
                  ...currentTab,
                  targetId: value,
                  targetClientId: selectedOption?.clientId || ''
                } : currentTab)
              });
            }
          }), tabBehavior !== 'scroll' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Active Tab', 'ambrygen-web'),
            checked: !!tab.isActive,
            onChange: value => {
              if (value) {
                setActiveTab(index);
              } else {
                updateTab(index, 'isActive', false);
              }
            }
          })]
        }, index)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "primary",
          onClick: handleAddTab,
          style: {
            width: '100%',
            justifyContent: 'center'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add Tab', 'ambrygen-web')
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      ...blockProps,
      id: blockId,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "horizontal-tabs",
        role: "tablist",
        children: [tabs.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          className: " tab-button tab-menu-section__empty",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add tabs from the sidebar.', 'ambrygen-web')
        }), tabs.map((tab, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
          type: "button",
          className: ` tab-button tab-menu-section__tab ${tab.isActive || activeIndex < 0 && index === 0 ? 'active' : ''}`,
          "data-scroll-target": tab.targetId || '',
          children: tab.label || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Tab', 'ambrygen-web')
        }, index))]
      })
    })]
  });
}

/***/ },

/***/ "./assets/src/blocks/tab-menu/editor.scss"
/*!************************************************!*\
  !*** ./assets/src/blocks/tab-menu/editor.scss ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./assets/src/blocks/tab-menu/index.js"
/*!*********************************************!*\
  !*** ./assets/src/blocks/tab-menu/index.js ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./assets/src/blocks/tab-menu/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor.scss */ "./assets/src/blocks/tab-menu/editor.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./assets/src/blocks/tab-menu/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./assets/src/blocks/tab-menu/block.json");
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

/***/ "./assets/src/blocks/tab-menu/style.scss"
/*!***********************************************!*\
  !*** ./assets/src/blocks/tab-menu/style.scss ***!
  \***********************************************/
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
/******/ 			"tab-menu/index": 0,
/******/ 			"tab-menu/style-index": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["tab-menu/style-index"], () => (__webpack_require__("./assets/src/blocks/tab-menu/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map