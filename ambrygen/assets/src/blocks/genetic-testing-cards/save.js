/**
 * WordPress dependencies for block editor functionality.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Save component for the Genetic Testing Cards block.
 *
 * @return {JSX.Element} Saved block markup.
 */
export default function Save() {
	const blockProps = useBlockProps.save( {
		className: 'genetic-cards',
	} );

	return (
		<div { ...blockProps }>
			<div className="genetic-cards__container">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
