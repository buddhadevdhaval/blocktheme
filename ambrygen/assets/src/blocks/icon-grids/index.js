import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import './style.scss';

import metadata from './block.json';
import { InnerBlocks } from '@wordpress/block-editor';

registerBlockType( metadata.name, {
	...metadata,
	edit: Edit,
	save: () => <InnerBlocks.Content />,
} );
