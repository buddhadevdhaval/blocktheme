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

/***/ "./assets/src/blocks/marketing-files/block.json"
/*!******************************************************!*\
  !*** ./assets/src/blocks/marketing-files/block.json ***!
  \******************************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"ambrygen/marketing-files","title":"Marketing Files","category":"ambrygen","icon":"media-document","description":"Lists marketing material titles for a selected category and links each title to the latest uploaded file.","supports":{"html":false,"align":["wide","full"],"spacing":{"margin":true,"padding":true}},"attributes":{"blockId":{"type":"string","default":""},"title":{"type":"string","default":"Marketing Files"},"headingLevel":{"type":"string","default":"h2"},"selectedCategory":{"type":"object","default":{"id":0,"name":"","slug":""}},"selectedMaterialType":{"type":"object","default":{"id":0,"name":"","slug":""}},"sections":{"type":"array","default":[]}},"editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js","render":"file:./render.php","textdomain":"ambrygen-web","example":{"attributes":{"title":"Marketing Files"}}}');

/***/ },

/***/ "./assets/src/blocks/marketing-files/edit.js"
/*!***************************************************!*\
  !*** ./assets/src/blocks/marketing-files/edit.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/html-entities */ "@wordpress/html-entities");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/server-side-render */ "@wordpress/server-side-render");
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _shared_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../_shared/components */ "./assets/src/blocks/_shared/components.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);










const HEADING_OPTIONS = [{
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
const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_TERM = {
  id: 0,
  name: '',
  slug: ''
};

// In-memory cache for material-specific category lookups to prevent duplicate API calls
const MATERIAL_CATEGORY_CACHE = {};
const getTermLabel = term => {
  if (!term) {
    return '';
  }
  if (typeof term.name === 'string' && term.name.length > 0) {
    return (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__.decodeEntities)(term.name);
  }
  if (typeof term.slug === 'string' && term.slug.length > 0) {
    return (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__.decodeEntities)(term.slug);
  }
  return term.id ? `Category ${term.id}` : '';
};
function MaterialCategoryRow({
  value,
  onChange,
  index,
  total,
  onMove,
  onRemove
}) {
  const materialType = value?.materialType || DEFAULT_TERM;
  const category = value?.category || DEFAULT_TERM;
  const selectedPostIds = Array.isArray(value?.selectedPostIds) ? value.selectedPostIds : [];
  const [materialSearchInput, setMaterialSearchInput] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(materialType?.name || '');
  const [materialSearch, setMaterialSearch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(materialType?.name || '');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    const timeoutId = setTimeout(() => setMaterialSearch(materialSearchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [materialSearchInput]);
  const {
    materialOptions,
    isLoadingMaterialTypes,
    selectedMaterial
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.useSelect)(select => {
    const query = {
      per_page: 20,
      hide_empty: false,
      orderby: 'name',
      order: 'asc',
      _fields: 'id,name,slug'
    };
    if (materialSearch) {
      query.search = materialSearch;
    }
    const fetched = select('core').getEntityRecords('taxonomy', 'marketing_material_type', query);
    const isResolving = select('core').isResolving('getEntityRecords', ['taxonomy', 'marketing_material_type', query]);
    let sTerm = null;
    if (materialType?.id) {
      sTerm = select('core').getEntityRecord('taxonomy', 'marketing_material_type', materialType.id);
    }
    return {
      materialOptions: fetched,
      isLoadingMaterialTypes: isResolving,
      selectedMaterial: sTerm
    };
  }, [materialSearch, materialType?.id]);
  const allMaterialOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    const combined = [];
    if (Array.isArray(materialOptions)) combined.push(...materialOptions);
    if (selectedMaterial) combined.push(selectedMaterial);
    const unique = [];
    const seen = new Set();
    combined.forEach(t => {
      if (t && !seen.has(t.id)) {
        seen.add(t.id);
        unique.push(t);
      }
    });
    return unique;
  }, [materialOptions, selectedMaterial]);
  const [categorySearchInput, setCategorySearchInput] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(category?.name || '');
  const [categorySearch, setCategorySearch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(category?.name || '');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    const timeoutId = setTimeout(() => setCategorySearch(categorySearchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [categorySearchInput]);

  // State for material-specific categories
  const [materialCategoryOptions, setMaterialCategoryOptions] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)([]);
  const [isLoadingMaterialCategories, setIsLoadingMaterialCategories] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const [materialCategoriesError, setMaterialCategoriesError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);

  // Fetch categories specific to the selected material type ONLY when materialType changes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    if (!materialType?.id) {
      setMaterialCategoryOptions([]);
      return;
    }
    if (MATERIAL_CATEGORY_CACHE[materialType.id]) {
      setMaterialCategoryOptions(MATERIAL_CATEGORY_CACHE[materialType.id]);
      return;
    }
    let isMounted = true;
    setIsLoadingMaterialCategories(true);
    setMaterialCategoriesError(false);
    (async () => {
      try {
        const posterCategoryIds = new Set();
        for (let page = 1; page <= 3; page++) {
          const posts = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
            path: `/wp/v2/marketing_material?per_page=100&page=${page}&marketing_material_type=${materialType.id}&_fields=poster_category`
          });
          if (Array.isArray(posts)) {
            posts.forEach(post => {
              (post?.poster_category || []).forEach(termId => posterCategoryIds.add(Number(termId)));
            });
          }
          if (!Array.isArray(posts) || posts.length < 100) break;
        }
        const includeIds = Array.from(posterCategoryIds).filter(id => id > 0);
        let results = [];
        if (includeIds.length) {
          results = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
            path: `/wp/v2/poster_category?per_page=100&hide_empty=false&orderby=name&order=asc&_fields=id,name,slug&include=${includeIds.join(',')}`
          });
        }
        if (isMounted) {
          const finalResults = Array.isArray(results) ? results : [];
          MATERIAL_CATEGORY_CACHE[materialType.id] = finalResults;
          setMaterialCategoryOptions(finalResults);
        }
      } catch (error) {
        if (isMounted) {
          setMaterialCategoryOptions([]);
          setMaterialCategoriesError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoadingMaterialCategories(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [materialType?.id]);

  // Fetch global categories when no material type is selected using Redux cache
  const {
    globalCategoryOptions,
    isLoadingGlobalCategories
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.useSelect)(select => {
    if (materialType?.id) {
      return {
        globalCategoryOptions: [],
        isLoadingGlobalCategories: false
      };
    }
    const query = {
      per_page: 20,
      hide_empty: false,
      orderby: 'name',
      order: 'asc',
      _fields: 'id,name,slug'
    };
    if (categorySearch) query.search = categorySearch;
    const fetched = select('core').getEntityRecords('taxonomy', 'poster_category', query);
    const isResolving = select('core').isResolving('getEntityRecords', ['taxonomy', 'poster_category', query]);
    return {
      globalCategoryOptions: Array.isArray(fetched) ? fetched : [],
      isLoadingGlobalCategories: isResolving
    };
  }, [categorySearch, materialType?.id]);

  // Final derived category options
  const categoryOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    let options = materialType?.id ? materialCategoryOptions : globalCategoryOptions;
    if (materialType?.id && categorySearchInput) {
      const searchLower = categorySearchInput.toLowerCase();
      options = options.filter(term => getTermLabel(term).toLowerCase().includes(searchLower));
    }
    // ensure selected category is always in the list to prevent empty selected value display
    if (category?.id && !options.some(o => Number(o.id) === Number(category.id))) {
      return [...options, category];
    }
    return options;
  }, [materialType?.id, materialCategoryOptions, globalCategoryOptions, categorySearchInput, category]);
  const isLoadingCategories = materialType?.id ? isLoadingMaterialCategories : isLoadingGlobalCategories;
  const categoriesError = materialType?.id ? materialCategoriesError : false;
  const [postsSearchInput, setPostsSearchInput] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)('');
  const [postsSearch, setPostsSearch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)('');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    const timeoutId = setTimeout(() => setPostsSearch(postsSearchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [postsSearchInput]);
  const {
    postsOptions,
    isLoadingPosts
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.useSelect)(select => {
    if (!materialType?.id || !category?.id) {
      return {
        postsOptions: [],
        isLoadingPosts: false
      };
    }
    const query = {
      marketing_material_type: materialType.id,
      order: 'asc',
      orderby: 'title',
      per_page: 20,
      poster_category: category.id,
      search: postsSearch || undefined,
      status: 'publish',
      _fields: 'id,title'
    };
    const fetched = select('core').getEntityRecords('postType', 'marketing_material', query);
    const isResolving = select('core').isResolving('getEntityRecords', ['postType', 'marketing_material', query]);
    return {
      postsOptions: Array.isArray(fetched) ? fetched : [],
      isLoadingPosts: isResolving
    };
  }, [materialType?.id, category?.id, postsSearch]);
  const togglePost = (postId, isChecked) => {
    const nextIds = isChecked ? Array.from(new Set([...selectedPostIds, postId])) : selectedPostIds.filter(id => Number(id) !== Number(postId));
    onChange({
      ...value,
      selectedPostIds: nextIds
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.ItemHeader, {
      index: index,
      label: category?.name || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Untitled Row', 'ambrygen-web'),
      prefix: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Row', 'ambrygen-web'),
      total: total,
      onMove: onMove,
      onRemove: onRemove,
      minCount: 1
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ComboboxControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Material Type', 'ambrygen-web'),
      value: String(materialType?.id || ''),
      options: allMaterialOptions.map(term => ({
        label: getTermLabel(term),
        value: String(term.id)
      })),
      onFilterValueChange: setMaterialSearchInput,
      onChange: nextValue => {
        if (!nextValue) {
          onChange({
            ...value,
            materialType: DEFAULT_TERM,
            category: DEFAULT_TERM,
            selectedPostIds: []
          });
          setMaterialSearchInput('');
          setMaterialSearch('');
          setCategorySearchInput('');
          setCategorySearch('');
          return;
        }
        const term = materialOptions.find(item => String(item.id) === nextValue);
        if (!term) {
          return;
        }
        const termLabel = getTermLabel(term);
        setMaterialSearch(termLabel);
        setCategorySearch('');
        onChange({
          ...value,
          materialType: {
            id: term.id,
            name: termLabel,
            slug: term.slug || ''
          },
          category: DEFAULT_TERM,
          selectedPostIds: []
        });
      },
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Search to find a marketing material type.', 'ambrygen-web')
    }), isLoadingMaterialTypes && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ComboboxControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Category', 'ambrygen-web'),
      value: String(category?.id || ''),
      options: categoryOptions.map(term => ({
        label: getTermLabel(term),
        value: String(term.id)
      })),
      onFilterValueChange: setCategorySearchInput,
      onChange: nextValue => {
        if (!nextValue) {
          onChange({
            ...value,
            category: DEFAULT_TERM,
            selectedPostIds: []
          });
          setCategorySearchInput('');
          setCategorySearch('');
          return;
        }
        const term = categoryOptions.find(item => String(item.id) === nextValue);
        if (!term) {
          return;
        }
        const termLabel = getTermLabel(term);
        setCategorySearch(termLabel);
        onChange({
          ...value,
          category: {
            id: term.id,
            name: termLabel,
            slug: term.slug || ''
          },
          selectedPostIds: []
        });
      },
      help: categoriesError ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Unable to load categories right now.', 'ambrygen-web') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Select a category for this row.', 'ambrygen-web')
    }), isLoadingCategories && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Search Posts', 'ambrygen-web'),
      value: postsSearchInput,
      onChange: setPostsSearchInput,
      disabled: !materialType?.id || !category?.id,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Search to instantly filter posts.', 'ambrygen-web')
    }), isLoadingPosts && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, {}), materialType?.id > 0 && category?.id > 0 && !isLoadingPosts && postsOptions.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('No posts found for this selection.', 'ambrygen-web')
    }), materialType?.id > 0 && category?.id > 0 && postsOptions.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Select All', 'ambrygen-web'),
      checked: (postsOptions || []).every(post => selectedPostIds.some(id => Number(id) === Number(post?.id))),
      onChange: isChecked => {
        const visibleIds = (postsOptions || []).map(post => Number(post?.id)).filter(Boolean);
        if (!visibleIds.length) {
          return;
        }
        if (isChecked) {
          const next = Array.from(new Set([...selectedPostIds, ...visibleIds]));
          onChange({
            ...value,
            selectedPostIds: next
          });
          return;
        }
        const visibleSet = new Set(visibleIds.map(Number));
        const next = selectedPostIds.filter(id => !visibleSet.has(Number(id)));
        onChange({
          ...value,
          selectedPostIds: next
        });
      }
    }), materialType?.id > 0 && category?.id > 0 && postsOptions.map(post => {
      const postId = Number(post?.id);
      const postTitle = post?.title?.rendered ? (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__.decodeEntities)(post.title.rendered) : '';
      if (!postId) {
        return null;
      }
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
        label: postTitle || `Post ${postId}`,
        checked: selectedPostIds.some(id => Number(id) === postId),
        onChange: isChecked => togglePost(postId, isChecked)
      }, postId);
    })]
  });
}
function Edit({
  attributes,
  setAttributes,
  clientId,
  name
}) {
  const {
    blockId,
    title,
    headingLevel,
    selectedCategory,
    sections
  } = attributes;
  const TagName = headingLevel || 'h2';
  const normalizedSections = Array.isArray(sections) ? sections : [];
  const hasRepeaterSelection = normalizedSections.some(section => Array.isArray(section?.categories) && section.categories.length > 0);
  const moveSection = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= normalizedSections.length || index === newIndex) return;
    const nextSections = [...normalizedSections];
    [nextSections[index], nextSections[newIndex]] = [nextSections[newIndex], nextSections[index]];
    setAttributes({
      sections: nextSections
    });
  };
  const removeSection = index => {
    const nextSections = normalizedSections.filter((_, i) => i !== index);
    setAttributes({
      sections: nextSections
    });
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    const expectedId = `marketing-files-${clientId.slice(0, 8)}`;
    if (!blockId || !blockId.endsWith(clientId.slice(0, 8))) {
      setAttributes({
        blockId: expectedId
      });
    }
  }, [blockId, clientId, setAttributes]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Block Settings', 'ambrygen-web'),
        initialOpen: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ComboboxControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Heading Tag', 'ambrygen-web'),
          value: headingLevel,
          options: HEADING_OPTIONS,
          onChange: value => setAttributes({
            headingLevel: value
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Repeater', 'ambrygen-web'),
        initialOpen: false,
        children: [normalizedSections.map((section, sectionIndex) => {
          const sectionTitle = section?.title || '';
          const rows = Array.isArray(section?.categories) ? section.categories : [];
          const updateSection = nextSection => {
            const nextSections = normalizedSections.map((s, i) => i === sectionIndex ? nextSection : s);
            setAttributes({
              sections: nextSections
            });
          };
          const moveRow = (rowIndex, direction) => {
            const newIndex = rowIndex + direction;
            if (newIndex < 0 || newIndex >= rows.length || rowIndex === newIndex) return;
            const nextRows = [...rows];
            [nextRows[rowIndex], nextRows[newIndex]] = [nextRows[newIndex], nextRows[rowIndex]];
            updateSection({
              ...section,
              categories: nextRows
            });
          };
          const removeRow = rowIndex => {
            const nextRows = rows.filter((_, i) => i !== rowIndex);
            updateSection({
              ...section,
              categories: nextRows
            });
          };
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
            style: {
              border: '1px solid #dcdcde',
              padding: '12px',
              marginBottom: '12px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_8__.ItemHeader, {
              index: sectionIndex,
              label: sectionTitle || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Untitled Section', 'ambrygen-web'),
              prefix: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Section', 'ambrygen-web'),
              total: normalizedSections.length,
              onMove: (itemIndex, direction) => moveSection(sectionIndex, direction),
              onRemove: () => removeSection(sectionIndex),
              minCount: 1
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Section Title', 'ambrygen-web'),
              value: sectionTitle,
              onChange: next => updateSection({
                ...section,
                title: next
              })
            }), rows.map((row, rowIndex) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
              style: {
                marginTop: '12px'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(MaterialCategoryRow, {
                value: row,
                onChange: nextRow => {
                  const nextRows = rows.map((r, i) => i === rowIndex ? nextRow : r);
                  updateSection({
                    ...section,
                    categories: nextRows
                  });
                },
                index: rowIndex,
                total: rows.length,
                onMove: (itemIndex, direction) => moveRow(rowIndex, direction),
                onRemove: () => removeRow(rowIndex)
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("hr", {})]
            }, `row-${sectionIndex}-${rowIndex}`)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              variant: "primary",
              onClick: () => {
                updateSection({
                  ...section,
                  categories: [...rows, {
                    materialType: DEFAULT_TERM,
                    category: DEFAULT_TERM,
                    selectedPostIds: []
                  }]
                });
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add Row', 'ambrygen-web')
            })]
          }, `section-${sectionIndex}`);
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "primary",
          onClick: () => {
            setAttributes({
              sections: [...normalizedSections, {
                title: '',
                categories: []
              }]
            });
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add Section', 'ambrygen-web')
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      ...(0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)(),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        className: "marketing-catlouge",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
          className: "marketing-catlouge__header",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(TagName, {
            className: "heading-4 block-title mb-0 marketing-catlouge__title",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
              tagName: "span",
              value: title,
              onChange: value => setAttributes({
                title: value
              }),
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add title...', 'ambrygen-web')
            })
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "marketing-files__preview",
        children: [!hasRepeaterSelection && !selectedCategory?.id && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add a section/row in the Repeater to load marketing files.', 'ambrygen-web')
        }), (hasRepeaterSelection || selectedCategory?.id) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
          className: "marketing-files__ssr",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6__.ServerSideRender, {
            block: name,
            httpMethod: "POST",
            attributes: {
              ...attributes,
              sections: normalizedSections.map(s => ({
                ...s,
                categories: (s.categories || []).filter(c => c.materialType?.id > 0 && c.category?.id > 0)
              })).filter(s => s.title || s.categories.length > 0)
            }
          })
        })]
      })]
    })]
  });
}

/***/ },

/***/ "./assets/src/blocks/marketing-files/editor.scss"
/*!*******************************************************!*\
  !*** ./assets/src/blocks/marketing-files/editor.scss ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./assets/src/blocks/marketing-files/index.js"
/*!****************************************************!*\
  !*** ./assets/src/blocks/marketing-files/index.js ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./assets/src/blocks/marketing-files/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor.scss */ "./assets/src/blocks/marketing-files/editor.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./assets/src/blocks/marketing-files/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./assets/src/blocks/marketing-files/block.json");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_4__,
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: () => null
});

/***/ },

/***/ "./assets/src/blocks/marketing-files/style.scss"
/*!******************************************************!*\
  !*** ./assets/src/blocks/marketing-files/style.scss ***!
  \******************************************************/
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

/***/ "@wordpress/api-fetch"
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
(module) {

module.exports = window["wp"]["apiFetch"];

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

/***/ "@wordpress/html-entities"
/*!**************************************!*\
  !*** external ["wp","htmlEntities"] ***!
  \**************************************/
(module) {

module.exports = window["wp"]["htmlEntities"];

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

/***/ "@wordpress/server-side-render"
/*!******************************************!*\
  !*** external ["wp","serverSideRender"] ***!
  \******************************************/
(module) {

module.exports = window["wp"]["serverSideRender"];

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
/******/ 			"marketing-files/index": 0,
/******/ 			"marketing-files/style-index": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["marketing-files/style-index"], () => (__webpack_require__("./assets/src/blocks/marketing-files/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map