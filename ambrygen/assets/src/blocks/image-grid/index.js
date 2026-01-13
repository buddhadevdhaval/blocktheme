import edit from './edit';
import save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

import { registerBlockType } from '@wordpress/blocks';

/**
 * Side-effect free block initialization
 * Moves block registration into a function to avoid top-level side effects
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
export function initializeImageGridBlock() {
	registerBlockType( metadata.name, {
		edit,
		save,
	} );
}
