import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import { InnerBlocks } from '@wordpress/block-editor';
import './style.scss';

registerBlockType( metadata.name, {
	...metadata,
	edit: Edit,
	save: () => <InnerBlocks.Content />,
} );
