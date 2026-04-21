import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import './editor.scss';

import edit from './edit';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit,
	save: () => null,
} );
