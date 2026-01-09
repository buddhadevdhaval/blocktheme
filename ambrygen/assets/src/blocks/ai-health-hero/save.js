/**
 * React hook that marks the block wrapper element for frontend rendering.
 * It provides all the necessary props like the class name for the save output.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops)
 * @see [https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save)
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

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
		counter1Number,
		counter1Prefix,
		counter1Suffix,
		counter1Label,
		counter2Number,
		counter2Prefix,
		counter2Suffix,
		counter2Label,
		counter3Number,
		counter3Prefix,
		counter3Suffix,
		counter3Label,
		counter4Number,
		counter4Prefix,
		counter4Suffix,
		counter4Label,
		imageTop,
		imageBottom,
		logoImage,
	} = attributes;

	/**
	 * Renders a single counter item only if it has content.
	 * Includes prefix, number, suffix, and label conditionally.
	 *
	 * @param {string} number Counter number value
	 * @param {string} prefix Counter prefix text
	 * @param {string} suffix Counter suffix text
	 * @param {string} label  Counter label text
	 * @return {JSX.Element|null} Counter markup or null if empty
	 */
	const renderCounter = ( number, prefix, suffix, label ) =>
		( number || prefix || suffix || label ) && (
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

	return (
		<div { ...useBlockProps.save() }>
			<div className="hero-layout">
				{ /* Logo */ }
				{ logoImage && (
					<div className="hero-logo">
						<img src={ logoImage } alt="Logo" />
					</div>
				) }

				{ /* Top media */ }
				{ imageTop && (
					<div className="hero-image-top">
						<img src={ imageTop } alt="Top Media" />
					</div>
				) }

				{ /* Bottom media */ }
				{ imageBottom && (
					<div className="hero-image-bottom">
						<img src={ imageBottom } alt="Bottom Media" />
					</div>
				) }

				{ /* Hero content */ }
				<div className="hero-content">
					{ heading && (
						<RichText.Content
							tagName="h1"
							value={ heading }
							className="hero-heading"
						/>
					) }
					{ content && (
						<RichText.Content
							tagName="p"
							value={ content }
							className="hero-description"
						/>
					) }
					<div className="hero-counters">
						{ renderCounter(
							counter1Number,
							counter1Prefix,
							counter1Suffix,
							counter1Label
						) }
						{ renderCounter(
							counter2Number,
							counter2Prefix,
							counter2Suffix,
							counter2Label
						) }
						{ renderCounter(
							counter3Number,
							counter3Prefix,
							counter3Suffix,
							counter3Label
						) }
						{ renderCounter(
							counter4Number,
							counter4Prefix,
							counter4Suffix,
							counter4Label
						) }
					</div>
				</div>
			</div>
		</div>
	);
}
