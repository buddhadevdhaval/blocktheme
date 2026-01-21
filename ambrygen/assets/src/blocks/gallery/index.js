import edit from './edit';
import save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

import { registerBlockType } from '@wordpress/blocks';

/**
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	edit,
	save,
} );
