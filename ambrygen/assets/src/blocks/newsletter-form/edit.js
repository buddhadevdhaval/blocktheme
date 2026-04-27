import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import {
	ImageUploader,
	DEFAULT_IMAGES,
	TagSelector,
	CtaButtonField,
} from '../_shared/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo } from '@wordpress/element';
import { getThemeAssetUrl } from '../../utils/assets';


export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		blockId,
		eyebrow,
		heading,
		headingTag = 'h2',
		description,
		phoneNumber = '',
		emailAddress = '',
		buttonText = '',
		buttonUrl = '',
		cta = {},
		image,
		imageAlt,
		overlayTopImage,
		overlayBottomImage,
		backgroundImage,
		backgroundImageAlt,
		isTopAligned,
	} = attributes;

	const PHONE_ICON_URL = getThemeAssetUrl('/assets/src/images/phone-icon.svg');
	const MAIL_ICON_URL = getThemeAssetUrl('/assets/src/images/mail-icon.svg');

	const blockProps = useBlockProps();
	const defaults = useMemo(() => DEFAULT_IMAGES(), []);
	const defaultImage = defaults?.placeholder || {};
	const displayImage = image || defaultImage.url || '';
	const displayImageAlt = image ? imageAlt || '' : defaultImage.alt || '';
	const phoneHref = phoneNumber.replace(/[^0-9+]/g, '');
	const ctaValue = {
		text: cta?.text || buttonText || '',
		url: cta?.url || buttonUrl || '',
		target: cta?.target || '',
		rel: cta?.rel || '',
	};
	const ctaRel =
		ctaValue.target === '_blank'
			? [ctaValue.rel, 'noopener', 'noreferrer']
					.filter(Boolean)
					.join(' ')
			: ctaValue.rel;

	useEffect(() => {
		const expectedId = `section-${clientId.slice(0, 8)}`;

		if (!blockId) {
			setAttributes({
				blockId: expectedId,
			});
		}
	}, [clientId, blockId, setAttributes]);

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Newsletter Section', 'ambrygen-web')}>
					<ImageUploader
						url={image}
						onSelect={(img) =>
							setAttributes({
								image: img.url,
								imageId: img.id,
								imageAlt: img.alt || '',
							})
						}
						onRemove={() =>
							setAttributes({
								image: '',
								imageId: 0,
								imageAlt: '',
							})
						}
						label={__('Newsletter Image', 'ambrygen-web')}
					/>
					<TagSelector
						label={__('Heading Tag', 'ambrygen-web')}
						value={headingTag || 'h2'}
						type="heading"
						onChange={(value) =>
							setAttributes({ headingTag: value })
						}
					/>
					<TextControl
						label={__('Phone Number', 'ambrygen-web')}
						value={phoneNumber}
						onChange={(value) =>
							setAttributes({ phoneNumber: value || '' })
						}
					/>
					<TextControl
						type="email"
						label={__('Email Address', 'ambrygen-web')}
						value={emailAddress}
						onChange={(value) =>
							setAttributes({ emailAddress: value || '' })
						}
					/>
					<CtaButtonField
						label={__('CTA', 'ambrygen-web')}
						value={ctaValue}
						showVariant={false}
						onChange={(value) =>
							setAttributes({
								cta: value,
								buttonText: value?.text || '',
								buttonUrl: value?.url || '',
							})
						}
					/>
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
					<ImageUploader
						url={backgroundImage}
						onSelect={(img) =>
							setAttributes({
								backgroundImage: img.url,
								backgroundImageId: img.id,
								backgroundImageAlt: img.alt || '',
							})
						}
						onRemove={() =>
							setAttributes({
								backgroundImage: '',
								backgroundImageId: 0,
								backgroundImageAlt: '',
							})
						}
						label={__('Background Image', 'ambrygen-web')}
					/>
					<ToggleControl
						label={__('Top Align Content', 'ambrygen-web')}
						checked={isTopAligned}
						onChange={(value) =>
							setAttributes({ isTopAligned: value })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div className={`newsletter newsletter-signup ${isTopAligned ? 'is-top-aligned' : ''}`}>
				{backgroundImage && (
					<div className="block-bg-image">
						<img
							src={backgroundImage}
							alt={backgroundImageAlt}
						/>
					</div>
				)}
				<div className="newsletter__image-block">
					{displayImage && (
						<img
							src={displayImage}
							alt={displayImageAlt}
							className="newsletter__img"
							loading="lazy"
							decoding="async"
						/>
					)}

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
						allowedFormats={['core/text-color']}
						onChange={(value) =>
							setAttributes({ eyebrow: value })
						}
						className="newsletter__content-block__eyebrow-text eyebrow"
						placeholder={__(
							'Add Eyebrow…',
							'ambrygen-web'
						)}
					/>

					<div className="is-style-gl-s12" aria-hidden="true" />

					<RichText
						tagName={headingTag}
						value={heading}
						allowedFormats={['core/text-color']}
						onChange={(value) =>
							setAttributes({ heading: value })
						}
						className="newsletter__content-block__heading heading-3 mb-0"
						placeholder={__('Add Heading…', 'ambrygen-web')}
					/>

					<div className="is-style-gl-s12" aria-hidden="true" />

					<RichText
						tagName="div"
						value={description}
						onChange={(value) =>
							setAttributes({ description: value })
						}
						className="newsletter__content-block__description-text text-medium block-description"
						placeholder={__('Add Description…', 'ambrygen-web')}
					/>

					{(phoneNumber || emailAddress) && (
						<>
							<div
								className="is-style-gl-s36"
								aria-hidden="true"
							/>
							<div className="newsletter__info-listing">
								{phoneNumber && phoneHref && (
									<div className="newsletter__info-listing__item">
										<div
											className="newsletter__info-listing__item__icon"
											aria-hidden="true"
										>
											<img
												src={PHONE_ICON_URL}
												alt=""
											/>
										</div>
										<div className="newsletter__info-listing__item__text text-medium">
											<a href={`tel:${phoneHref}`}>
												{phoneNumber}
											</a>
										</div>
									</div>
								)}
								{emailAddress && (
									<div className="newsletter__info-listing__item">
										<div
											className="newsletter__info-listing__item__icon"
											aria-hidden="true"
										>
											<img
												src={MAIL_ICON_URL}
												alt=""
											/>
										</div>
										<div className="newsletter__info-listing__item__text text-medium">
											<a
												href={`mailto:${emailAddress}`}
											>
												{emailAddress}
											</a>
										</div>
									</div>
								)}
							</div>
						</>
					)}

					{ctaValue.text && (
						<>
							<div
								className="is-style-gl-s36"
								aria-hidden="true"
							/>
							<div className="newsletter__block__button-wrapper">
								<a
									className="site-btn is-style-site-secondary-btn  has-right-arrow"
									href={ctaValue.url || '#'}
									role="button"
									aria-label={ctaValue.text}
									target={ctaValue.target || undefined}
									rel={ctaRel || undefined}
								>
									{ctaValue.text}
								</a>
							</div>
						</>
					)}

					<div className="is-style-gl-s12" aria-hidden="true" />
					<div
						className="newsletter-form-placeholder"
						role="group"
						aria-label={__(
							'Newsletter signup form',
							'ambrygen-web'
						)}
					>
						<InnerBlocks
							allowedBlocks={['core/shortcode']}
							templateLock={false}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
