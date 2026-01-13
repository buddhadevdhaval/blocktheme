/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files for editor only.
 * All files containing `editor` keyword are bundled together. The code used
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Side-effect free block initialization
 * Moves block registration into a function to avoid top-level side effects
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
export function initializeLeftRightContentBlock() {
	registerBlockType( metadata.name, {
		edit,
		save,
	} );
}
