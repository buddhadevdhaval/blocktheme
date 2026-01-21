/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

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
	const {
		heading,
		headingTag,
		imageUrl,
		imageAlt,
		imagePosition,
		layoutStyle,
		imageSize,
		contentAlignment,
	} = attributes;
	const blockProps = useBlockProps.save( {
		className: `flexible-content ${ layoutStyle } ${ imagePosition } ${ imageSize }`,
		style: {
			'--content-alignment': contentAlignment,
		},
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
							className="flexible-content-image"
							aria-label={
								imageAlt
									? imageAlt
									: heading ||
									  __(
											'Left right content image',
											'ambrygen-web'
									  )
							}
						/>
					) }
				</div>

				{ /* Text */ }
				<div
					className="text-wrapper"
					style={ { textAlign: contentAlignment } }
				>
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
							className="left-right-img right"
							aria-label={
								imageAlt
									? imageAlt
									: heading ||
									  __(
											'Left right content image',
											'ambrygen-web'
									  )
							}
						/>
					) }
				</div>
			</div>
		</div>
	);
}
