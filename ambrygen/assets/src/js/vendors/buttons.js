const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl, TextControl, Button, BaseControl, TextareaControl, Modal, Popover } = wp.components;
const { MediaUpload, MediaUploadCheck, RichText } = wp.blockEditor;
const { useState } = wp.element;
const el = wp.element.createElement;
const Fragment = wp.element.Fragment;

const buttonStyles = [
	{ name: 'site-btn-style', label: 'Primary Button' },
	{ name: 'site-secondary-btn', label: 'Secondary Button' },
	{ name: 'site-tertiary-btn', label: 'Tertiary Button' },
	{ name: 'site-text-btn', label: 'Text Button' }
];

buttonStyles.forEach(style => {
	wp.blocks.registerBlockStyle('core/button', style);
});

wp.domReady(() => {
	// wp.blocks.unregisterBlockStyle('core/button', 'outline');
	// wp.blocks.unregisterBlockStyle('core/button', 'fill');
});

/**
 * Gutenberg Block Extension for Arrow Icons
 */

// 1. Add Custom Attribute
addFilter(
	'blocks.registerBlockType',
	'ambrygen/button-arrow-attribute',
	(settings, name) => {
		if (name === 'core/button') {
			settings.attributes = Object.assign(settings.attributes, {
				buttonArrowIcon: {
					type: 'string',
					default: ''
				},
				videoType: {
					type: 'string',
					default: 'embed'
				},
				videoUrl: {
					type: 'string',
					default: ''
				},
				iframeUrl: {
					type: 'string',
					default: ''
				},
				videoTitle: {
					type: 'string',
					default: ''
				},
				videoContent: {
					type: 'string',
					default: ''
				},
				formPopupTitle: {
					type: 'string',
					default: ''
				},
				videoPlatform: {
					type: 'string',
					default: 'youtube'
				}
			});
		}
		return settings;
	}
);

// 2. Add Editor Control Panel
const withArrowIconControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (props.name !== 'core/button') {
			return el(BlockEdit, props);
		}

		const [isModalOpen, setIsModalOpen] = useState(false);

		return el(Fragment, {},
			el(BlockEdit, props),
			el(InspectorControls, {},
				el(PanelBody, { title: 'Arrow Options', initialOpen: true },
					el(SelectControl, {
						label: 'Select Arrow Icon',
						value: props.attributes.buttonArrowIcon,
						options: [
							{ label: 'None', value: '' },
							{ label: 'Right Arrow', value: 'has-right-arrow' },
							{ label: 'Download Arrow', value: 'has-download-arrow' },
							{ label: 'Form Arrow', value: 'has-form-arrow has-right-arrow' },
							{ label: 'Video Arrow', value: 'has-video-arrow has-right-arrow' }
						],
						onChange: (val) => props.setAttributes({ buttonArrowIcon: val })
					}),
					props.attributes.buttonArrowIcon.includes('has-form-arrow') && el(Fragment, {},
						el('hr', { style: { margin: '20px 0 10px' } }),
						el(TextControl, {
							label: 'Form Popup Title',
							value: props.attributes.formPopupTitle || '',
							onChange: (val) => props.setAttributes({ formPopupTitle: val })
						})
					),
					props.attributes.buttonArrowIcon && props.attributes.buttonArrowIcon.includes('has-video-arrow') && el(Fragment, {},
						el('hr', { style: { margin: '20px 0 10px' } }),
						el('p', { style: { fontWeight: '600' } }, 'Video Settings'),
						el(SelectControl, {
							label: 'Video Type',
							value: props.attributes.videoType || 'embed',
							options: [
								{ label: 'Embed (YouTube/Vimeo)', value: 'embed' },
								{ label: 'MP4 File', value: 'mp4' }
							],
							onChange: (val) => props.setAttributes({ videoType: val })
						}),
						props.attributes.videoType === 'embed' && el(SelectControl, {
							label: 'Platform',
							value: props.attributes.videoPlatform || 'youtube',
							options: [
								{ label: 'YouTube', value: 'youtube' },
								{ label: 'Vimeo', value: 'vimeo' }
							],
							onChange: (val) => props.setAttributes({ videoPlatform: val })
						}),
						props.attributes.videoType === 'mp4' ? el(BaseControl, { label: 'Video File' },
							el(MediaUploadCheck, {},
								el(MediaUpload, {
									onSelect: (media) => props.setAttributes({ videoUrl: media.url }),
									allowedTypes: ['video'],
									value: props.attributes.videoUrl,
									render: ({ open }) => el(Button, {
										variant: 'secondary',
										onClick: open,
										style: { width: '100%', marginBottom: '10px' }
									}, props.attributes.videoUrl ? 'Replace Video' : 'Select Video')
								})
							),
							el(TextControl, {
								label: 'Video URL',
								value: props.attributes.videoUrl,
								onChange: (val) => props.setAttributes({ videoUrl: val })
							})
						) : el(BaseControl, { label: 'Video ID' },
							el(TextControl, {
								value: props.attributes.iframeUrl,
								onChange: (val) => props.setAttributes({ iframeUrl: val }),
								help: `Prefix: ${props.attributes.videoPlatform === 'vimeo' ? 'https://player.vimeo.com/video/' : 'https://www.youtube.com/embed/'}`
							})
						),
						el(TextControl, {
							label: 'Video Title (Popup)',
							value: props.attributes.videoTitle,
							onChange: (val) => props.setAttributes({ videoTitle: val })
						}),
						el(Button, {
							variant: 'secondary',
							onClick: () => setIsModalOpen(!isModalOpen),
							style: { width: '100%', marginTop: '10px' },
							id: 'ambrygen-video-content-btn'
						}, 'Edit Video Popup Content'),
						isModalOpen && el(Popover, {
							anchor: document.getElementById('ambrygen-video-content-btn'),
							onClose: () => setIsModalOpen(false),
							position: 'bottom center',
							noArrow: false,
							className: 'ambrygen-video-content-popover'
						},
							el('div', { style: { padding: '20px', width: '350px', background: '#fff' } },
								el(RichText, {
									tagName: 'div',
									value: props.attributes.videoContent,
									onChange: (val) => props.setAttributes({ videoContent: val }),
									placeholder: 'Enter Video content (links supported)...',
									allowedFormats: ['core/bold', 'core/italic', 'core/link', 'core/text-color'],
									style: { minHeight: '100px', border: '1px solid #ddd', padding: '10px', marginBottom: '15px' }
								}),
								el(Button, {
									variant: 'primary',
									onClick: () => setIsModalOpen(false),
									isSmall: true
								}, 'Done')
							)
						)
					)
				)
			)
		);
	};
}, 'withArrowIconControl');

addFilter('editor.BlockEdit', 'ambrygen/with-arrow-icon-control', withArrowIconControl);

// 3. Apply Class to frontend wrapper
addFilter(
	'blocks.getSaveContent.extraProps',
	'ambrygen/save-button-arrow-class',
	(extraProps, blockType, attributes) => {
		if (blockType.name === 'core/button' && attributes.buttonArrowIcon) {
			extraProps.className = extraProps.className
				? extraProps.className + ' ' + attributes.buttonArrowIcon
				: attributes.buttonArrowIcon;

			if (attributes.buttonArrowIcon && attributes.buttonArrowIcon.includes('has-video-arrow')) {
				let videoSrc = attributes.videoType === 'mp4' ? attributes.videoUrl : attributes.iframeUrl;

				if (attributes.videoType === 'embed' && attributes.iframeUrl) {
					const prefix = attributes.videoPlatform === 'vimeo' ? 'https://player.vimeo.com/video/' : 'https://www.youtube.com/embed/';
					if (!videoSrc.startsWith('http')) {
						videoSrc = prefix + videoSrc;
					}
				}

				extraProps['data-video-type'] = attributes.videoType || 'embed';
				extraProps['data-video-src'] = videoSrc;
				extraProps['data-video-title'] = attributes.videoTitle;
				extraProps['data-video-content'] = attributes.videoContent;
			}

			if (attributes.buttonArrowIcon && attributes.buttonArrowIcon.includes('has-form-arrow')) {
				extraProps['data-form-title'] = attributes.formPopupTitle || 'Coming soon';
			}
		}
		return extraProps;
	}
);

// 4. Apply Class internally in the Editor preview
const withArrowIconClassEditor = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		if (props.name === 'core/button' && props.attributes.buttonArrowIcon) {
			let customClassName = props.attributes.buttonArrowIcon;
			return el(BlockListBlock, {
				...props,
				className: props.className ? props.className + ' ' + customClassName : customClassName
			});
		}
		return el(BlockListBlock, props);
	};
}, 'withArrowIconClassEditor');

addFilter('editor.BlockListBlock', 'ambrygen/editor-button-arrow-class', withArrowIconClassEditor);
