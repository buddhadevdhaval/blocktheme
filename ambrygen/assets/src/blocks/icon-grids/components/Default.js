import { InnerBlocks } from '@wordpress/block-editor';

export default function Default( { template } ) {
	return (
		<InnerBlocks
			allowedBlocks={ [ 'ambrygen/icon-grids-item' ] }
			template={ template }
			templateLock={ false }
		/>
	);
}
