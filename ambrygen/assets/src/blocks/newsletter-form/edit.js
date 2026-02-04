import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	Button,
	SelectControl,
} from '@wordpress/components';
import { dispatch } from '@wordpress/data';

const DEFAULT_IMAGE =
	'/wp-content/themes/ambrygen/assets/src/images/news-latter.jpg';
const DEFAULT_OVERLAY_TOP =
	'/wp-content/themes/ambrygen/assets/src/images/news-latter/overlay-top.svg';
const DEFAULT_OVERLAY_BOTTOM =
	'/wp-content/themes/ambrygen/assets/src/images/news-latter/overlay-bottom.svg';

function buildSrcSet(sizes) {
	if (!sizes) {
		return undefined;
	}
	return Object.values(sizes)
		.filter((size) => size?.url && size?.width)
		.map((size) => `${size.url} ${size.width}w`)
		.join(', ');
}

export default function Edit({ attributes, setAttributes }) {
	const {
		eyebrow,
		heading,
		headingTag = 'h2',
		description,
		image,
		imageAlt = '',
		imageSizes,
		overlayTopImage = DEFAULT_OVERLAY_TOP,
		overlayBottomImage = DEFAULT_OVERLAY_BOTTOM,
		backgroundColor = '',
		textColor = '',
		style,
	} = attributes;

	const displayImage = image || DEFAULT_IMAGE;
	const srcSet = buildSrcSet(imageSizes);

	const blockProps = useBlockProps({
		style: {
			backgroundColor: backgroundColor || style?.color?.background,
			color: textColor,
			padding: '60px 20px',
		},
	});

	const openInspector = () => {
		dispatch('core/edit-post').openGeneralSidebar('edit-post/block');
	};

	// Handlers for images
	const onSelectImage = (img) => {
		setAttributes({
			image: img.url,
			imageId: img.id,
			imageAlt: img.alt || '',
			imageSizes: img.sizes || {},
		});
	};

	const onRemoveImage = () => {
		setAttributes({
			image: '',
			imageId: 0,
			imageAlt: '',
			imageSizes: {},
		});
	};

	const onSelectOverlayTop = (img) =>
		setAttributes({ overlayTopImage: img?.url || '' });
	const onRemoveOverlayTop = () => setAttributes({ overlayTopImage: '' });

	const onSelectOverlayBottom = (img) =>
		setAttributes({ overlayBottomImage: img?.url || '' });
	const onRemoveOverlayBottom = () =>
		setAttributes({ overlayBottomImage: '' });

	return (
		<div {...blockProps}>
			<InspectorControls>
				{ /* Main Image */}
				<PanelBody title={__('Newsletter Image', 'ambrygen-web')}>
					<PanelRow>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectImage}
								allowedTypes={['image']}
								render={({ open }) => (
									<Button
										onClick={open}
										variant={
											image ? 'secondary' : 'primary'
										}
									>
										{image
											? __(
												'Replace Image',
												'ambrygen-web'
											)
											: __(
												'Upload Image',
												'ambrygen-web'
											)}
									</Button>
								)}
							/>
						</MediaUploadCheck>

						{image && (
							<Button
								isDestructive
								variant="link"
								onClick={onRemoveImage}
							>
								{__('Remove Image', 'ambrygen-web')}
							</Button>
						)}
					</PanelRow>
				</PanelBody>

				{ /* Heading Tag Selector */}
				<PanelBody title={__('Heading Settings', 'ambrygen-web')}>
					<SelectControl
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingTag}
						options={[
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						]}
						onChange={(value) =>
							setAttributes({ headingTag: value })
						}
					/>
				</PanelBody>

				{ /* Overlay Images */}
				<PanelBody title={__('Overlay Images', 'ambrygen-web')}>
					<PanelRow>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectOverlayTop}
								allowedTypes={['image']}
								render={({ open }) => (
									<Button
										onClick={open}
										variant="secondary"
									>
										{overlayTopImage
											? __(
												'Replace Top Overlay',
												'ambrygen-web'
											)
											: __(
												'Upload Top Overlay',
												'ambrygen-web'
											)}
									</Button>
								)}
							/>
						</MediaUploadCheck>

						{overlayTopImage && (
							<Button
								isDestructive
								variant="link"
								onClick={onRemoveOverlayTop}
							>
								{__('Remove Top Overlay', 'ambrygen-web')}
							</Button>
						)}
					</PanelRow>

					<PanelRow>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectOverlayBottom}
								allowedTypes={['image']}
								render={({ open }) => (
									<Button
										onClick={open}
										variant="secondary"
									>
										{overlayBottomImage
											? __(
												'Replace Bottom Overlay',
												'ambrygen-web'
											)
											: __(
												'Upload Bottom Overlay',
												'ambrygen-web'
											)}
									</Button>
								)}
							/>
						</MediaUploadCheck>

						{overlayBottomImage && (
							<Button
								isDestructive
								variant="link"
								onClick={onRemoveOverlayBottom}
							>
								{__(
									'Remove Bottom Overlay',
									'ambrygen-web'
								)}
							</Button>
						)}
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			{/* Frontend Preview in Editor */}
			<div className="newsletter newsletter-signup">
				<div className="newsletter__image-block">
					<img
						src={displayImage}
						srcSet={srcSet || undefined}
						sizes="(max-width: 768px) 100vw, 600px"
						alt={
							imageAlt || __('Newsletter Image', 'ambrygen-web')
						}
						className="newsletter__img"
						loading="lazy"
						decoding="async"
					/>

					{ /* Overlay Top */}
					{overlayTopImage && (
						<div className="newsletter__image-block__overlay newsletter__image-block__overlay-top">
							<img
								src={overlayTopImage}
								alt={__('Overlay Top', 'ambrygen-web')}
								className="overlay__img"
							/>
						</div>
					)}

					{ /* Overlay Bottom */}
					{overlayBottomImage && (
						<div className="newsletter__image-block__overlay newsletter__image-block__overlay-bottom">
							<img
								src={overlayBottomImage}
								alt={__('Overlay Bottom', 'ambrygen-web')}
								className="overlay__img"
							/>
						</div>
					)}
				</div>

				<div className="newsletter__content-block">
					{eyebrow && (
						<RichText
							tagName="span"
							value={eyebrow}
							onChange={(value) =>
								setAttributes({ eyebrow: value })
							}
							className="newsletter__content-block__eyebrow-text eyebrow"
							placeholder={__('Newsletter', 'ambrygen-web')}
						/>
					)}

					<div className="is-style-gl-s12"></div>

					{heading && (
						<RichText
							tagName={headingTag}
							value={heading}
							onChange={(value) =>
								setAttributes({ heading: value })
							}
							className="newsletter__content-block__heading heading-3 mb-0"
							placeholder={__(
								'Stay informed',
								'ambrygen-web'
							)}
						/>
					)}

					<div className="is-style-gl-s12"></div>

					<div className="newsletter__content-block__description text-medium">
						{description && (
							<RichText
								tagName="p"
								value={description}
								onChange={(value) =>
									setAttributes({ description: value })
								}
								className="newsletter__content-block__description-text"
								placeholder={__(
									'Subscribe text…',
									'ambrygen-web'
								)}
							/>
						)}
					</div>

					<div className="newsletter-form-placeholder">
						<InnerBlocks
							allowedBlocks={[
								'gravityforms/form',
								'core/shortcode',
								'core/html',
							]}
							templateLock={false}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
