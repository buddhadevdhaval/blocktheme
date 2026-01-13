/**
 * React hook that marks the block wrapper element for frontend rendering.
 * It provides all the necessary props like the class name for the save output.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops)
 * @see [https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save)
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Import validation utilities
 */
import { validateNumber } from '../../utils/validation.js';

/**
 * Save component for the AI Health Hero block.
 * Defines the frontend markup structure using block attributes.
 * Only renders elements that have content to optimize output.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save)
 *
 * @param {Object} props            Block properties
 * @param {Object} props.attributes Block attributes containing heading, content, counter data, and image URLs
 * @return {JSX.Element}                Frontend markup element serialized to post_content.
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
	} = attributes;

	/**
	 * Renders a single counter item only if it has valid content.
	 * Includes prefix, number, suffix, and label conditionally with validation.
	 *
	 * @param {string} number Counter number value
	 * @param {string} prefix Counter prefix text
	 * @param {string} suffix Counter suffix text
	 * @param {string} label  Counter label text
	 * @return {JSX.Element|null} Counter markup or null if empty
	 */
	const renderCounter = ( number, prefix, suffix, label ) => {
		// Only render if we have content and number is valid
		const hasContent = number || prefix || suffix || label;
		const numberValid = ! number || validateNumber( number ) === number;

		if ( ! hasContent || ! numberValid ) {
			return null;
		}

		return (
			<div className="counter-item">
				<div className="counter-number" data-counter={ number }>
					{ prefix && (
						<span className="counter-prefix">{ prefix }</span>
					) }
					{ number && (
						<strong className="counter-value">{ number }</strong>
					) }
					{ suffix && (
						<span className="counter-suffix">{ suffix }</span>
					) }
				</div>
				{ label && (
					<RichText.Content
						tagName="p"
						value={ label }
						className="counter-label"
					/>
				) }
			</div>
		);
	};

	return (
		<div { ...useBlockProps.save() }>
			<div
				className="hero-layout"
				role="region"
				aria-label="AI Health Hero section"
			>
				{ /* Logo */ }
				{ logoImage && (
					<div className="hero-logo">
						<img
							src={ logoImage }
							alt={ logoImageAlt || 'Company logo' }
							onError={ ( e ) => {
								e.target.style.display = 'none';
								// eslint-disable-next-line no-console
								console.warn(
									'Failed to load logo image:',
									logoImage
								);
							} }
						/>
					</div>
				) }

				{ /* Top media */ }
				{ imageTop && (
					<div
						className="hero-image-top"
						role="img"
						aria-label="Hero top image"
					>
						<img
							src={ imageTop }
							alt={ imageTopAlt || 'Hero top image' }
							loading="lazy"
							onError={ ( e ) => {
								e.target.style.display = 'none';
								// eslint-disable-next-line no-console
								console.warn(
									'Failed to load top image:',
									imageTop
								);
							} }
						/>
					</div>
				) }

				{ /* Bottom media */ }
				{ imageBottom && (
					<div
						className="hero-image-bottom"
						role="img"
						aria-label="Hero bottom image"
					>
						<img
							src={ imageBottom }
							alt={ imageBottomAlt || 'Hero bottom image' }
							loading="lazy"
							onError={ ( e ) => {
								e.target.style.display = 'none';
								// eslint-disable-next-line no-console
								console.warn(
									'Failed to load bottom image:',
									imageBottom
								);
							} }
						/>
					</div>
				) }

				{ /* Hero content - only render if there's content */ }
				{ ( heading ||
					content ||
					counters.some(
						( counter ) =>
							counter.number &&
							validateNumber( counter.number ) === counter.number
					) ) && (
					<div className="hero-content" role="main">
						{ heading && (
							<RichText.Content
								tagName="h1"
								value={ heading }
								className="hero-heading"
								id="hero-heading"
							/>
						) }
						{ content && (
							<RichText.Content
								tagName="p"
								value={ content }
								className="hero-description"
								role="group"
								aria-labelledby="hero-heading"
							/>
						) }
						{ /* Counters - only render if at least one has valid content */ }
						{ counters.some( ( counter ) =>
							renderCounter(
								counter.number,
								counter.prefix,
								counter.suffix,
								counter.label
							)
						) && (
							<div
								className="hero-counters"
								role="region"
								aria-labelledby="hero-heading"
								aria-label="Health statistics"
							>
								{ counters.map( ( counter ) =>
									renderCounter(
										counter.number,
										counter.prefix,
										counter.suffix,
										counter.label
									)
								) }
							</div>
						) }
					</div>
				) }
			</div>
		</div>
	);
}
