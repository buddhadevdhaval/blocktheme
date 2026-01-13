/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props            Block properties
 * @param {Object} props.attributes Block attributes
 * @return {Element} Element to render.
 */

export default function Save( { attributes } ) {
	const { heading, headingTag, imageUrl, imageId, imageAlt, imagePosition } =
		attributes;
	const blockProps = useBlockProps.save( {
		className: `left-right-block ${ imagePosition }`,
	} );

	return (
		<div { ...blockProps }>
			<div className="content-wrapper">
				{ /* Left image */ }
				<div className="image-wrapper">
					{ imagePosition === 'left' && imageUrl && (
						<img
							src={ imageUrl }
							alt={ imageAlt || heading || '' }
							data-image-id={ imageId }
							className="responsive-image"
						/>
					) }
				</div>

				{ /* Text */ }
				<div className="text-wrapper">
					<RichText.Content
						tagName={ headingTag }
						value={ heading }
					/>
					<InnerBlocks.Content />
				</div>

				{ /* Right image */ }
				<div className="image-wrapper">
					{ imagePosition === 'right' && imageUrl && (
						<img
							src={ imageUrl }
							alt={ imageAlt || heading || '' }
							data-image-id={ imageId }
							className="responsive-image"
						/>
					) }
				</div>
			</div>
		</div>
	);
}
