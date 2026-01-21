/**
 * WordPress dependencies for block editor functionality.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Save component for the AI Hero Section block.
 *
 * Renders the saved block content on the frontend with:
 * - Background image with rounded styling
 * - Headlines and descriptions
 * - Call-to-action buttons
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
		tagline,
		backgroundImage,
		backgroundImageAlt,
		buttonPrimaryText,
		buttonPrimaryUrl,
		buttonSecondaryText,
		buttonSecondaryUrl,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: 'hero-section',
	} );

	return (
		<div { ...blockProps }>
			<div className="hero-section__container">
				<div className="hero-section__background">
					{ backgroundImage && (
						<img
							src={ backgroundImage }
							alt={ backgroundImageAlt || '' }
							className="hero-section__image"
							loading="eager"
						/>
					) }
				</div>

				<div className="hero-section__content">
					{ heading && (
						<RichText.Content tagName="h1" value={ heading } />
					) }

					{ content && (
						<div className="hero-section__description">
							<RichText.Content value={ content } />
						</div>
					) }

					{ tagline && (
						<div className="hero-section__tagline">
							<RichText.Content tagName="p" value={ tagline } />
						</div>
					) }

					<div className="hero-section__actions">
						{ buttonSecondaryText && (
							<a
								href={ buttonSecondaryUrl }
								className="hero-section__button hero-section__button--secondary"
							>
								<span className="hero-section__button-text">
									{ buttonSecondaryText }
								</span>
								<span
									className="hero-section__button-icon"
									aria-hidden="true"
								>
									&rsaquo;
								</span>
							</a>
						) }

						{ buttonPrimaryText && (
							<a
								href={ buttonPrimaryUrl }
								className="hero-section__button hero-section__button--primary"
							>
								<span className="hero-section__button-text">
									{ buttonPrimaryText }
								</span>
								<span
									className="hero-section__button-icon"
									aria-hidden="true"
								>
									&rsaquo;
								</span>
							</a>
						) }
					</div>
				</div>
			</div>
		</div>
	);
}
