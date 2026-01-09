/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

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
export default function save( { attributes } ) {
	const { heading, content } = attributes;

	return (
		<div { ...useBlockProps.save() }>
			<RichText.Content
				tagName="h2"
				value={ heading }
				className="hero-heading"
			/>
			<RichText.Content
				tagName="p"
				value={ content }
				className="hero-content"
			/>
			<div
				{ ...useBlockProps.save( {
					className: 'body-small heading-6',
				} ) }
			>
				This is Priiyank
			</div>
		</div>
	);
}
