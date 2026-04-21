import { registerBlockType } from '@wordpress/blocks';
import '../shared/tooltip-format';

import './style.scss';
import './editor.scss';

import edit from './edit';
import metadata from './block.json';

registerBlockType( metadata.name, {
	...metadata,
	edit,
	save: () => null,
} );
