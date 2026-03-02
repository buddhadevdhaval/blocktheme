import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import {
	ImageUploader,
	ImagePlaceholder,
	TagSelector,
	DEFAULT_IMAGES,
} from '../_shared/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
	const {
		eyebrow,
		heading,
		headingTag = 'h2',
		description,
		image,
		imageAlt,
		overlayTopImage,
		overlayBottomImage,
		style,
	} = attributes;

	const defaultImage = DEFAULT_IMAGES().placeholder.url;
	const displayImage = image || defaultImage;

	const blockProps = useBlockProps({
		style: {
			backgroundColor: style?.color?.background,
			color: style?.color?.text,
			padding: '60px 20px',
		},
	});

	return (
		<div {...blockProps}>
			<InspectorControls>
				{ /* Newsletter Image */}
				<PanelBody title={__('Newsletter Image', 'ambrygen-web')}>
					<ImageUploader
						url={image}
						onSelect={(img) =>
							setAttributes({ image: img.url, imageId: img.id, imageAlt: img.alt || '' })
						}
						onRemove={() =>
							setAttributes({ image: '', imageId: 0, imageAlt: '' })
						}
						label={__('Newsletter Image', 'ambrygen-web')}
					/>
				</PanelBody>

				{ /* Heading Settings */}
				<PanelBody title={__('Heading Settings', 'ambrygen-web')}>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingTag || 'h2'}
						onChange={(value) =>
							setAttributes({ headingTag: value })
						}
					/>
				</PanelBody>

				{ /* Overlay Images */}
				<PanelBody title={__('Overlay Images', 'ambrygen-web')}>
					<ImageUploader
						url={overlayTopImage}
						onSelect={(img) =>
							setAttributes({
								overlayTopImage: img.url,
								overlayTopImageId: img.id,
							})
						}
						onRemove={() =>
							setAttributes({
								overlayTopImage: '',
								overlayTopImageId: 0,
							})
						}
						label={__('Top Overlay', 'ambrygen-web')}
					/>

					<ImageUploader
						url={overlayBottomImage}
						onSelect={(img) =>
							setAttributes({
								overlayBottomImage: img.url,
								overlayBottomImageId: img.id,
							})
						}
						onRemove={() =>
							setAttributes({
								overlayBottomImage: '',
								overlayBottomImageId: 0,
							})
						}
						label={__('Bottom Overlay', 'ambrygen-web')}
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Editor Preview */}
			<div className="newsletter newsletter-signup">
				<div className="newsletter__image-block">
					{displayImage ? (
						<img
							src={displayImage}
							alt={imageAlt || ''}
							className="newsletter__img"
							loading="lazy"
							decoding="async"
						/>
					) : (
						<ImagePlaceholder
							text={__(
								'No newsletter image set',
								'ambrygen-web'
							)}
						/>
					)}

					{ /* Decorative overlays */}
					{overlayTopImage && (
						<div
							className="newsletter__image-block__overlay newsletter__image-block__overlay-top"
							aria-hidden="true"
						>
							<img
								src={overlayTopImage}
								alt=""
								className="overlay__img"
								aria-hidden="true"
							/>
						</div>
					)}

					{overlayBottomImage && (
						<div
							className="newsletter__image-block__overlay newsletter__image-block__overlay-bottom"
							aria-hidden="true"
						>
							<img
								src={overlayBottomImage}
								alt=""
								className="overlay__img"
								aria-hidden="true"
							/>
						</div>
					)}
				</div>

				<div className="newsletter__content-block">
					<RichText
						tagName="div"
						value={eyebrow}
						onChange={(value) =>
							setAttributes({ eyebrow: value })
						}
						className="newsletter__content-block__eyebrow-text eyebrow"
						placeholder={__('Newsletter', 'ambrygen-web')}
					/>

					<div className="is-style-gl-s12" aria-hidden="true" />

					<RichText
						tagName={headingTag}
						value={heading}
						onChange={(value) =>
							setAttributes({ heading: value })
						}
						className="newsletter__content-block__heading heading-3 mb-0"
						placeholder={__('Stay informed', 'ambrygen-web')}
					/>

					<div className="is-style-gl-s12" aria-hidden="true" />

					<RichText
						tagName="div"
						value={description}
						onChange={(value) =>
							setAttributes({ description: value })
						}
						className="newsletter__content-block__description-text text-medium block-description"
						placeholder={__('Subscribe text…', 'ambrygen-web')}
					/>

					<div
						className="newsletter-form-placeholder"
						aria-label={__(
							'Newsletter signup form',
							'ambrygen-web'
						)}
					>
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
