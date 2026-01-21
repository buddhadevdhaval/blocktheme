/**
 * WordPress dependencies for block editor functionality.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * React element creation utility.
 *
 * @see https://react.dev/reference/react/createElement
 */
import { createElement } from '@wordpress/element';

/**
 * Save component for the Section Container block.
 *
 * Renders the saved block content on the frontend with:
 * - Semantic HTML tag (section, div, article, aside, main)
 * - Container width classes (1340px, 1280px, full-width)
 * - Background style classes (theme colors)
 * - InnerBlocks content
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props            Block properties.
 * @param {Object} props.attributes Block attributes.
 * @return {JSX.Element} Saved block markup.
 */
export default function Save( { attributes } ) {
	const { tagName, containerWidth, backgroundStyle, isFixedBackground } =
		attributes;

	const classes = [
		containerWidth,
		backgroundStyle,
		isFixedBackground ? 'bg-fixed' : '',
	]
		.filter( Boolean )
		.join( ' ' );

	const blockProps = useBlockProps.save( {
		className: classes || undefined,
	} );

	return createElement(
		tagName,
		blockProps,
		<div className="wrapper">
			<InnerBlocks.Content />
		</div>
	);
}
