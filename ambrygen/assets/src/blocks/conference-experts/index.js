/**
 * Internal dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';

/**
 * Register: ambrygen/conference-experts
 */
registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
