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
function CounterItem( { number, prefix, suffix, label } ) {
	// Validate presence - require at least number or label
	if ( ! number && ! label ) {
		return null;
	}

	// Validate number format
	if ( number && validateNumber( number ) !== number ) {
		return null;
	}

	return (
		<div className="counter-item">
			<div className="counter-number heading-3">
				{ prefix && (
					<span className="counter-prefix">
						<RichText.Content value={ prefix } />
					</span>
				) }

				{ number && (
					<span className="count">
						<RichText.Content value={ number } />
					</span>
				) }

				{ suffix && (
					<span className="counter-suffix">
						<RichText.Content value={ suffix } />
					</span>
				) }
			</div>

			{ label && (
				<div className="counter-title body1">
					<RichText.Content value={ label } />
				</div>
			) }
		</div>
	);
}

/**
 * ImageWrapper Component
 *
 * Renders an image with error handling and accessibility features.
 * Hides the image on load error and logs a warning.
 *
 * @param {Object} props                  Component properties.
 * @param {string} props.src              Image source URL.
 * @param {string} props.alt              Image alt text.
 * @param {string} props.className        CSS class name.
 * @param {string} props.wrapperClassName Wrapper CSS class name.
 * @param {string} props.fallbackAlt      Fallback alt text if alt is empty.
 * @return {JSX.Element|null} Image wrapper or null if no src.
 */
function ImageWrapper( {
	src,
	alt,
	className,
	wrapperClassName,
	fallbackAlt,
} ) {
	if ( ! src ) {
		return null;
	}

	/**
	 * Handles image load errors.
	 * Hides the image and logs a warning to the console.
	 *
	 * @param {Event} e Error event.
	 */
	const handleImageError = ( e ) => {
		e.target.style.display = 'none';
		// eslint-disable-next-line no-console
		console.warn( 'Failed to load image:', src );
	};

	return (
		<div
			className={ wrapperClassName }
			role="img"
			aria-label={ alt || fallbackAlt }
		>
			<img
				src={ src }
				alt={ alt || fallbackAlt }
				className={ className }
				onError={ handleImageError }
			/>
		</div>
	);
}

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
export default function Save( { attributes } ) {
	const {
		heading,
		content,
		counters,
		imageTop,
		imageTopAlt,
		imageBottom,
		imageBottomAlt,
		logoImage,
		logoImageAlt,
		backgroundColor,
		textColor,
	} = attributes;

	const blockProps = useBlockProps.save( {
		style: {
			backgroundColor: backgroundColor || undefined,
			color: textColor || undefined,
		},
	} );

	return (
		<div { ...blockProps }>
			<div className="ai-hero">
				<div className="container-1340">
					<div className="is-style-gl-s48" />
					<div className="wrapper">
						<div className="ai-hero__grid">
							<div className="ai-hero__col-images">
								<div className="ai-hero__images">
									<div className="ai-hero__image-wrapper">
										<div className="ai-hero__logo">
											<div className="ai-hero__logo-inner">
												{ logoImage && (
													<img
														src={ logoImage }
														alt={
															logoImageAlt ||
															__(
																'Company logo',
																'ambrygen-web'
															)
														}
														style={ {
															maxWidth: '100%',
															height: 'auto',
														} }
													/>
												) }
											</div>
										</div>
									</div>
									<div className="ai-hero__image-wrapper">
										<div className="ai-hero__image">
											<ImageWrapper
												src={ imageTop }
												alt={ imageTopAlt }
												className="hero-top-img"
												wrapperClassName="hero-image-top"
												fallbackAlt={ __(
													'Hero top image',
													'ambrygen-web'
												) }
											/>
										</div>
									</div>
									<div className="ai-hero__image-wrapper">
										<div className="ai-hero__image">
											<ImageWrapper
												src={ imageBottom }
												alt={ imageBottomAlt }
												className="hero-bottom-img"
												wrapperClassName="hero-image-bottom"
												fallbackAlt={ __(
													'Hero bottom image',
													'ambrygen-web'
												) }
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="ai-hero__col-content">
								<div className="ai-hero__content">
									<h2 className="ai-hero__heading heading-2 mb-0">
										{ heading && (
											<RichText.Content
												tagName="h1"
												value={ heading }
												className="hero-heading"
												id="hero-heading"
											/>
										) }
									</h2>
									<div className="ai-hero__description body1">
										{ content && (
											<RichText.Content
												tagName="p"
												value={ content }
												className="hero-description"
												role="group"
												aria-labelledby="hero-heading"
											/>
										) }
									</div>
									<div className="ai-hero__counters">
										{ counters.map( ( counter, index ) => (
											<CounterItem
												key={ index }
												number={ counter.number }
												prefix={ counter.prefix }
												suffix={ counter.suffix }
												label={ counter.label }
											/>
										) ) }
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
