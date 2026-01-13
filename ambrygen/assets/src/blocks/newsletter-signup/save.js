/**
 * Block editor components for frontend rendering.
 * useBlockProps: Marks block wrapper with necessary props for save output.
 * RichText.Content: Renders saved rich text content.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops)
 */
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

/**
 * Save component for Newsletter Signup block.
 * Renders frontend markup with conditional image and heading.
 * Provides form placeholder for inner blocks like Gravity Forms.
 *
 * @see [https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save)
 *
 * @param {Object} root0            Block properties
 * @param {Object} root0.attributes Block attributes (heading, image, backgroundColor, style)
 * @return {JSX.Element}                  Frontend markup element
 */
export default function Save( { attributes } ) {
	const { heading, image, imageId, imageAlt, backgroundColor, style } =
		attributes;

	/**
	 * Block props with dynamic background color for frontend.
	 */
	const blockProps = useBlockProps.save( {
		style: {
			backgroundColor: backgroundColor || style?.color?.background,
			padding: '60px 20px',
		},
	} );

	return (
		<div { ...blockProps }>
			<div className="newsletter-signup">
				{ /* Image section - conditional render */ }
				{ image && (
					<div className="newsletter-image">
						<img
							src={ image }
							alt={ imageAlt || 'Newsletter illustration' }
							data-image-id={ imageId }
							className="responsive-image"
						/>
					</div>
				) }

				{ /* Form section with heading and placeholder */ }
				<div className="newsletter-form-section">
					{ heading && (
						<RichText.Content
							tagName="h3"
							value={ heading }
							className="newsletter-heading"
						/>
					) }

					{ /* Placeholder for Gravity Forms or other blocks */ }
					<div className="newsletter-form-placeholder">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</div>
	);
}
