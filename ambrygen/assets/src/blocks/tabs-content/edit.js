import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

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

export default function Edit() {
	const blockProps = useBlockProps( { className: 'tabs-table-content' } );

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
