import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { BlockExamplePreview } from '../_shared/components';

const TEMPLATE = [
	[
		'ambrygen/tabs-content-item',
		{
			heading: 'Tab 1',
		},
	],
	[
		'ambrygen/tabs-content-item',
		{
			heading: 'Tab 2',
		},
	],
];

export default function Edit( { attributes } ) {
	const { activeTabId } = attributes;
	const blockProps = useBlockProps( { className: 'tabs-table-content block-layout' } );

	if ( activeTabId === 'example-block-preview' ) {
		return (
			<BlockExamplePreview
				className="example-block-preview"
				imagePath="/assets/src/images/tabs-content/preview.png"
			/>
		);
	}

	return (
		<div { ...blockProps }>
			<InnerBlocks
				allowedBlocks={ [ 'ambrygen/tabs-content-item' ] }
				template={ TEMPLATE }
				templateLock={ false }
				renderAppender={ InnerBlocks.ButtonBlockAppender }
			/>
		</div>
	);
}
