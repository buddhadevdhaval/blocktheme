import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import './style.scss';
import './editor.scss';
import '../shared/tooltip-format';

registerBlockType( metadata.name, {
	...metadata,
	edit: Edit,
	save: () => null,
} );
