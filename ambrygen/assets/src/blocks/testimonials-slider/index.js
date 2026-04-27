import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import './style.scss';
import './editor.scss';

import edit from './edit';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit,
	save: () => <InnerBlocks.Content />,
} );
