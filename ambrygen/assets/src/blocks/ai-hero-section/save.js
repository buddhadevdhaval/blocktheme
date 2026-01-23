/**
 * WordPress dependencies for block editor functionality.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Internationalization utilities.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Import validation utilities.
 */
import { validateNumber } from '../../utils/validation.js';

/**
 * CounterItem Component
 *
 * Renders a single counter item with validation.
 * Only renders if the counter has valid content (number or label).
 *
 * @param {Object} props        Component properties.
 * @param {string} props.number Counter number value.
 * @param {string} props.prefix Counter prefix text.
 * @param {string} props.suffix Counter suffix text.
 * @param {string} props.label  Counter label text.
 * @return {JSX.Element|null} Counter markup or null if invalid.
 */
// ----- CounterItem -----
const CounterItem = ({ number, prefix, suffix, label }) => {
	if (!number && !label) {
		return null;
	}
	const safeNumber = validateNumber(number) || '0';
	return (
		<div className="counter-item">
			<div className="counter-number heading-3 mb-0">
				{prefix && (
					<div className="counter-prefix">
						<RichText.Content value={prefix} />
					</div>
				)}
				{number && (
					<div className="count">
						{safeNumber}
						{suffix && <RichText.Content value={suffix} />}
					</div>
				)}
			</div>
			{label && (
				<div className="counter-title body1">
					<RichText.Content value={label} />
				</div>
			)}
		</div>
	);
};

/**
 * ImageWrapper component.
 *
 * @param {Object} props
 * @param {string} props.src                Image source URL.
 * @param {string} props.alt                Image alt text.
 * @param {string} [props.className]        Image class name.
 * @param {string} [props.wrapperClassName] Wrapper class name.
 * @param {string} [props.fallbackAlt]      Fallback alt text.
 * @param {string} [props.srcSet]           Responsive image srcset.
 * @param {string} [props.sizes]            Responsive image sizes attribute.
 *
 * @return {JSX.Element} Rendered image wrapper.
 */
// ----- ImageWrapper with lazy load and srcSet -----
const ImageWrapper = ({
	src,
	alt,
	className,
	wrapperClassName,
	fallbackAlt,
	srcSet, // optional
	sizes, // optional
}) => {
	if (!src) {
		return null;
	}

	const handleImageError = (e) => {
		e.target.style.display = 'none';
	};

	return (
		<div
			className={wrapperClassName}
			role="img"
			aria-label={alt || fallbackAlt}
		>
			<img
				src={src}
				alt={alt || fallbackAlt}
				className={className}
				loading="lazy" // <-- lazy load
				srcSet={srcSet} // <-- responsive srcSet
				sizes={sizes} // <-- responsive sizes
				onError={handleImageError}
			/>
		</div>
	);
};

/**
 * Save component for the AI Hero Section block.
 *
 * Renders the saved block content on the frontend with:
 * - Three images (logo, top, bottom) with error handling
 * - Rich text heading and content
 * - Four validated counters with prefix, number, suffix, and label
 * - Custom background and text colors
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props            Block properties.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Saved block markup.
 */
export default function Save({ attributes }) {
	const {
		heading,
		content,
		counters,
		headingLevel,
		imageTop,
		imageTopAlt,
		imageTopSrcSet,
		imageTopSizes,
		imageBottom,
		imageBottomAlt,
		imageBottomSrcSet,
		imageBottomSizes,
		logoImage,
		logoImageAlt,
		logoImageSrcSet,
		logoImageSizes,
		backgroundColor,
		textColor,
	} = attributes;
	const HeadingTag = headingLevel || 'h2';
	const blockProps = useBlockProps.save({
		style: {
			backgroundColor: backgroundColor || undefined,
			color: textColor || undefined,
		},
	});

	return (
		<div {...blockProps}>
			<div className="ai-hero">
				<div className="container-1340">
					<div className="is-style-gl-s48" />
					<div className="wrapper">
						<div className="ai-hero__grid">
							<div className="ai-hero__col ai-hero__col--images">
								<div className="ai-hero__images">
									<div className="ai-hero__image-wrapper">
										<div className="ai-hero__logo">
											<div className="ai-hero__logo-inner">
												<img
													src={logoImage}
													srcSet={logoImageSrcSet}
													sizes={logoImageSizes}
													alt={
														logoImageAlt ||
														__(
															'Company logo',
															'ambrygen-web'
														)
													}
													loading="lazy"
												/>
											</div>
										</div>
									</div>
									<div className="ai-hero__image-wrapper">
										<div className="ai-hero__image">
											<ImageWrapper
												src={imageTop}
												alt={imageTopAlt}
												className="ai-hero__image-img"
												wrapperClassName="ai-hero__image-container"
												loading="lazy"
												fallbackAlt={__(
													'Hero top image',
													'ambrygen-web'
												)}
												srcSet={imageTopSrcSet}
												sizes={imageTopSizes}
											/>
										</div>
									</div>
									<div className="ai-hero__image-wrapper ai-hero__image-wrapper--full">
										<div className="ai-hero__image ai-hero__image--bottom">
											<ImageWrapper
												src={imageBottom}
												alt={imageBottomAlt}
												className="ai-hero__image-img"
												wrapperClassName="ai-hero__image-container"
												loading="lazy"
												fallbackAlt={__(
													'Hero bottom image',
													'ambrygen-web'
												)}
												srcSet={imageBottomSrcSet}
												sizes={imageBottomSizes}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="ai-hero__col ai-hero__col--content">
								<div className="ai-hero__content">
									<HeadingTag className="ai-hero__heading heading-2 mb-0">
										{heading && (
											<RichText.Content
												tagName=""
												value={heading}
												className="ai-hero__heading-text"
												id="hero-heading"
											/>
										)}
									</HeadingTag>
									<div className="is-style-gl-s24"></div>
									<div className="ai-hero__description body1">
										{content && (
											<RichText.Content
												tagName="p"
												value={content}
												className="ai-hero__description-text"
												role="group"
												aria-labelledby="hero-heading"
											/>
										)}
									</div>
									<div className="is-style-gl-s24"></div>
									<div className="ai-hero__counters">
										{counters.map((counter, index) => (
											<CounterItem
												key={index}
												number={counter.number}
												prefix={counter.prefix}
												suffix={counter.suffix}
												label={counter.label}
											/>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="is-style-gl-s48" />
				</div>
			</div>
		</div>
	);
}
